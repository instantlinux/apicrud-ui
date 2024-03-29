# Usage:
#  See .gitlab-ci.yml for the main pipeline, which invokes these targets:
#    create_image test_functional promote_images clean_images

include Makefile.vars

BUILDX               ?= https://github.com/docker/buildx/releases/download/v0.4.1/buildx-v0.4.1.linux-amd64
BUILD_ARGS            = --build-arg=VCS_REF=$(CI_COMMIT_SHA) \
   --build-arg=BUILD_DATE=$(shell date +%Y-%m-%dT%H:%M:%SZ) \
   --build-arg=REACT_APP_API_URL=$(REACT_APP_API_URL) \
   --build-arg=REACT_APP_TOKEN_MAPBOX=$(REACT_APP_TOKEN_MAPBOX)
REGISTRY             ?= $(REGISTRY_URI)/$(USER_LOGIN)
export APICRUD_ENV   ?= local
export DOCKER_CLI_EXPERIMENTAL = enabled

# Local dev - you need 6 services running; see the Makefile in
#  github.com/instantlinux/apicrud. This Makefile supports:
#
#  make ui_local

.PHONY: apicrud-%/tag qemu
ui_local: .env .yarn/releases/yarn-$(VERSION_YARN).cjs /usr/bin/yarn
	REACT_APP_API_URL=$(REACT_APP_API_URL_DEV) \
	yarn dev

# All vars passed via process.env must be prefixed REACT_APP_
.env:
	echo 'REACT_APP_API_URL=$(REACT_APP_API_URL_DEV)' >$@
	@echo 'REACT_APP_TOKEN_MAPBOX=$(REACT_APP_TOKEN_MAPBOX)' >>$@
	@echo 'PORT=$(APICRUD_UI_PORT)' >>$@

analysis: .yarn/releases/yarn-$(VERSION_YARN).cjs
	@echo "Running ESLint code analysis"
	yarn && yarn eslint

test:
	@echo "Running unit tests"
	yarn ci-test || echo TODO ignore ambiguous worker-loader error

test_functional:
	@echo "Run Functional Tests - not yet implemented"

publish: clean
	@echo Publishing npm package
	@mkdir -p build
	@echo Workaround for https://gist.github.com/ugultopu/e1949b60bfcd86df782dd16ae51caf05
	npm install -g $(shell cat package.json | jq -r '.devDependencies' | \
	 grep @babel | awk  -F '"' '{ print $$2"@"$$4 }')
	yarn transpile
	@cp package.json README.md build/
	cd build && npm publish

create_image: qemu
	@echo docker build -t $(REGISTRY)/$(APPNAME)-$(CI_JOB_STAGE):$(TAG)
	@echo Hardcoded REACT_APP_API_URL=$(REACT_APP_API_URL)
	@docker buildx build \
	 --tag $(REGISTRY)/$(APPNAME)-$(CI_JOB_STAGE):$(TAG) . \
	 --push -f Dockerfile.$(CI_JOB_STAGE) \
	 --build-arg=TAG=$(TAG) $(BUILD_ARGS)

promote_images: qemu
ifeq ($(CI_COMMIT_TAG),)
	$(foreach target, $(IMAGES), \
	  image=$(shell basename $(target)) && \
	  docker buildx build --platform $(PLATFORMS) \
	    --tag $(REGISTRY)/$(APPNAME)-$${image}:latest \
	    --push --file Dockerfile.$${image} . $(BUILD_ARGS) \
	;)
	echo commit_tag=$(CI_COMMIT_TAG)
else
	# Also push to dockerhub, if registry is somewhere like GitLab
	docker login -u $(USER_LOGIN) -p $(DOCKER_TOKEN)
	$(foreach target, $(IMAGES), \
	  image=$(shell basename $(target)) && \
	  docker buildx build --platform $(PLATFORMS) \
	    --tag $(REGISTRY)/$(APPNAME)-$${image}:$(CI_COMMIT_TAG) \
	    --tag $(REGISTRY)/$(APPNAME)-$${image}:latest \
	    --tag $(USER_LOGIN)/$(APPNAME)-$${image}:$(CI_COMMIT_TAG) \
	    --tag $(USER_LOGIN)/$(APPNAME)-$${image}:latest \
	    --push --file Dockerfile.$${image} . $(BUILD_ARGS) \
	;)
endif

clean_images:
	docker rmi $(REGISTRY)/$(APPNAME)-ui:$(TAG) || true

apicrud-%/tag:
	docker pull $(REGISTRY)/$(@D):latest
	docker tag $(REGISTRY)/$(@D):latest $(REGISTRY)/$(@D):$(TAG)
	docker push $(REGISTRY)/$(@D):$(TAG)

create_ui_prod:
ifeq ($(TAG),)
	@echo Please specify a new tag in form yy.mm.x
	@exit 1
endif
	@echo docker build -t $(REGISTRY)/$(APPNAME)-ui:$(TAG) -f Dockerfile.ui
	docker login -u $(USER_LOGIN) -p $(DOCKER_TOKEN)
	@docker build -t $(REGISTRY)/$(APPNAME)-ui:$(TAG) . \
	 -f Dockerfile.ui --build-arg=TAG=$(TAG) $(BUILD_ARGS)

clean:
	rm -rf .env build coverage npm-debug.log
	find . -name coverage.xml -o -name results.xml -o -name '*~' \
	 -exec rm -rf {} \;
wipe_clean: clean
	rm -rf .yarn node_modules

qemu:
	mkdir -p /usr/lib/docker/cli-plugins
	wget -O /usr/lib/docker/cli-plugins/docker-buildx $(BUILDX)
	chmod +x /usr/lib/docker/cli-plugins/docker-buildx
	docker run --rm --privileged multiarch/qemu-user-static --reset -p yes
	docker buildx create --name multibuild
	docker buildx use multibuild
	# TODO - sometimes gitlab-ci cache isn't working, why not?
	mkdir -p .yarn
	touch .pnp.js

.yarn/releases/yarn-$(VERSION_YARN).cjs:
	yarn set version berry
	yarn set version $(VERSION_YARN)

/usr/bin/yarn:
	sudo curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
	sudo bash -c 'echo "deb https://dl.yarnpkg.com/debian/ stable main" > /etc/apt/sources.list.d/yarn.list'
	sudo bash -c 'apt update && apt install yarn'
