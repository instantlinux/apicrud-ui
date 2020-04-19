# Usage:
#  See .gitlab-ci.yml for the main pipeline, which invokes these targets:
#    create_image test_functional promote_images clean_images

include Makefile.vars

REACT_APP_API_URL    ?= http://$(shell hostname -f):$(APP_PORT)/api/v1
REACT_APP_MEDIA_URL  ?= http://$(shell hostname -f):$(MEDIA_PORT)/api/v1
REGISTRY             ?= $(REGISTRY_URI)/$(USER_LOGIN)
export APICRUD_ENV   ?= local

# Local dev - you need 6 services running; see the Makefile in
#  github.com/instantlinux/apicrud. This Makefile supports:
#
#  make ui_local

.PHONY: apicrud-%/tag
ui_local: .env /usr/bin/yarn
	yarn dev

# All vars passed via process.env must be prefixed REACT_APP_
.env:
	echo 'REACT_APP_API_URL=$(REACT_APP_API_URL)' >$@
	@echo 'REACT_APP_MEDIA_URL=$(REACT_APP_MEDIA_URL)' >>$@
	@echo 'REACT_APP_TOKEN_MAPBOX=$(REACT_APP_TOKEN_MAPBOX)' >>$@
	@echo 'PORT=$(APICRUD_UI_PORT)' >>$@

analysis:
	@echo "Running ESLint code analysis"
	yarn && yarn lint

test:
	@echo "Running unit tests"
	yarn ci-test

test_functional:
	@echo "Run Functional Tests - not yet implemented"

publish:
	@echo Publishing npm package
	npm publish

create_image:
	@echo docker build -t $(REGISTRY)/$(APPNAME)-$(CI_JOB_STAGE):$(TAG)
	@docker build -t $(REGISTRY)/$(APPNAME)-$(CI_JOB_STAGE):$(TAG) . \
	 -f Dockerfile.$(CI_JOB_STAGE) \
	 --build-arg=VCS_REF=$(CI_COMMIT_SHA) \
	 --build-arg=TAG=$(TAG) \
	 --build-arg=BUILD_DATE=$(shell date +%Y-%m-%dT%H:%M:%SZ) \
	 --build-arg=REACT_APP_API_URL=https://apicrud-dev.$(DOMAIN)/api/v1 \
	 --build-arg=REACT_APP_MEDIA_URL=https://apicrud-media-dev.$(DOMAIN)/api/v1 \
	 --build-arg=REACT_APP_TOKEN_MAPBOX=$(REACT_APP_TOKEN_MAPBOX)
	docker push $(REGISTRY)/$(APPNAME)-$(CI_JOB_STAGE):$(TAG)

promote_images:
	$(foreach target, $(IMAGES), \
	  image=$(shell basename $(target)) && \
	  docker pull $(REGISTRY)/$(APPNAME)-$${image}:$(TAG) && \
	  docker tag $(REGISTRY)/$(APPNAME)-$${image}:$(TAG) \
	    $(REGISTRY)/$(APPNAME)-$${image}:latest && \
	  docker push $(REGISTRY)/$(APPNAME)-$${image}:latest \
	;)
ifneq ($(CI_COMMIT_TAG), "")
	# Also push to dockerhub, if registry is somewhere like GitLab
ifneq ($(REGISTRY), $(USER_LOGIN))
	docker login -u $USER_LOGIN -p $DOCKER_TOKEN
	$(foreach target, $(IMAGES), \
	  image=$(shell basename $(target)) && \
	  docker tag $(REGISTRY)/$(APPNAME)-$${image}:$(TAG) \
	    $(USER_LOGIN)/$(APPNAME)-$${image}:$(CI_COMMIT_TAG) && \
	  docker tag $(REGISTRY)/$(APPNAME)-$${image}:$(TAG) \
	    $(USER_LOGIN)/$(APPNAME)-$${image}:latest && \
	  docker push $(USER_LOGIN)/$(APPNAME)-$${image}:$(CI_COMMIT_TAG) \
	  docker push $(USER_LOGIN)/$(APPNAME)-$${image}:latest \
	;)
endif
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
	@docker build -t $(REGISTRY)/$(APPNAME)-ui:$(TAG) . \
	 -f Dockerfile.ui \
	 --build-arg=VCS_REF=$(shell git rev-parse HEAD^) \
	 --build-arg=TAG=$(TAG) \
	 --build-arg=BUILD_DATE=$(shell date +%Y-%m-%dT%H:%M:%SZ) \
	 --build-arg=REACT_APP_API_URL=https://apicrud-ui.$(DOMAIN)/api/v1 \
	 --build-arg=REACT_APP_MEDIA_URL=https://apicrud-media.$(DOMAIN)/api/v1 \
	 --build-arg=REACT_APP_TOKEN_MAPBOX=$(REACT_APP_TOKEN_MAPBOX)
	docker push $(REGISTRY)/$(APPNAME)-ui:$(TAG)

clean:
	find . -regextype egrep -regex '.*(coverage.xml|results.xml|~)' \
	 -exec rm -rf {} \;
wipe_clean: clean
	rm -rf node_modules

/usr/bin/yarn:
	sudo curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
	sudo bash -c 'echo "deb https://dl.yarnpkg.com/debian/ stable main" > /etc/apt/sources.list.d/yarn.list'
	sudo bash -c 'apt update && apt install yarn'
