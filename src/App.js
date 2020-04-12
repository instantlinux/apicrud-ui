// created 25-mar-2019 by rich braun <docker@instantlinux.net>

import React from 'react';
import { Admin, Resource, resolveBrowserLocale } from 'react-admin';
import accountIcon from '@material-ui/icons/PersonPin';
import categoryIcon from '@material-ui/icons/Style';
import listIcon from '@material-ui/icons/Sort';
import locationIcon from '@material-ui/icons/Place';
import messageIcon from '@material-ui/icons/Chat';
import personIcon from '@material-ui/icons/People';

import polyglotI18nProvider from 'ra-i18n-polyglot';
import chineseMessages from 'ra-language-chinese';
import englishMessages from 'ra-language-english';
import frenchMessages from 'ra-language-french';
import germanMessages from 'ra-language-german';
import italianMessages from 'ra-language-italian';
import portugueseMessages from 'ra-language-portuguese';
import russianMessages from 'ra-language-russian';
import spanishMessages from '@blackbox-vision/ra-language-spanish';

import './App.css';

import authProvider from './authProvider';
import dataProvider from './dataProvider';
import { customLayout, theme } from './customLayout';
import customRoutes from './customRoutes';
import { accountCreate, accountEdit, accountList, accountPassword,
         accountShow } from './ra-views/account';
import { credentialCreate, credentialEdit } from './ra-views/credential';
import { categoryCreate, categoryEdit, categoryList } from './ra-views/category';
import { contactCreate, contactEdit } from './ra-views/contact';
import { listCreate, listEdit, listList, listShow } from './ra-views/list';
import { locationCreate, locationEdit, locationList,
         locationShow } from './ra-views/location';
import { messageCreate, messageEdit, messageShow } from './ra-views/message';
import { personCreate, personEdit, personList,
         personShow } from './ra-views/person';
import { settingsEdit } from './ra-views/settings';
import { storageCreate, storageEdit } from './ra-views/storage';
import { tzEdit } from './ra-views/tz';

const messages = {
    zh: chineseMessages,
    en: englishMessages,
    fr: frenchMessages,
    de: germanMessages,
    it: italianMessages,
    pt: portugueseMessages,
    ru: russianMessages,
    es: spanishMessages,
};
const i18nProvider = polyglotI18nProvider(locale => messages[locale],
    resolveBrowserLocale());
const loggedin = /^(admin|user)/;

const App = () => (
    <Admin authProvider={authProvider}
           i18nProvider={i18nProvider}
           dataProvider={dataProvider} customRoutes={customRoutes}
           layout={customLayout} theme={theme} >
	{permissions => [
        <Resource name='account' create={accountCreate}
          list={permissions.match(/^admin/) ? accountList : null}
          edit={permissions.match(loggedin) ? accountEdit : null}
          show={permissions.match(loggedin) ? accountShow : null}
          icon={accountIcon} />,
        <Resource name='account_password' edit={accountPassword} />,
        <Resource name='credential'
          create={permissions.match(loggedin) ? credentialCreate : null}
          edit={permissions.match(loggedin) ? credentialEdit : null} />,
        <Resource name='category'
          list={permissions.match(/^admin/) ? categoryList : null}
          create={permissions.match(/^admin/) ? categoryCreate : null}
          edit={permissions.match(/^admin/) ? categoryEdit : null}
          icon={categoryIcon} />,
        <Resource name='contact'
          create={contactCreate} edit={contactEdit} />,
        <Resource name='list'
          list={permissions.match(loggedin) ? listList : null}
          create={permissions.match(loggedin) ? listCreate : null}
          edit={permissions.match(loggedin) ? listEdit : null}
          show={listShow} icon={listIcon} />,
        <Resource name='location'
          list={permissions.match(loggedin) ? locationList : null}
          create={permissions.match(loggedin) ? locationCreate : null}
          edit={permissions.match(loggedin) ? locationEdit : null}
          show={locationShow} icon={locationIcon} />,
        <Resource name='message' create={messageCreate}
          edit={messageEdit}
          show={messageShow} icon={messageIcon} />,
        <Resource name='person'
          list={permissions.match(loggedin) ? personList : null}
          create={permissions.match(loggedin) ? personCreate : null}
          edit={personEdit} show={personShow} icon={personIcon} />,
        <Resource name='storage'
          create={permissions.match(loggedin) ? storageCreate : null}
          edit={permissions.match(loggedin) ? storageEdit : null} />,
        <Resource name='settings'
          edit={permissions.match(/^admin/) ? settingsEdit : null} />,
        <Resource name='tz' edit={tzEdit} />,
	]}
    </Admin>
);

export default App;
