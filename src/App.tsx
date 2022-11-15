// created 25-mar-2019 by rich braun <docker@instantlinux.net>

import React from 'react';
import { Admin, Resource, resolveBrowserLocale } from 'react-admin';
import accountIcon from '@material-ui/icons/PersonPin';
import categoryIcon from '@material-ui/icons/Style';
import listIcon from '@material-ui/icons/Sort';
import locationIcon from '@material-ui/icons/Place';
import messageIcon from '@material-ui/icons/Chat';
import personIcon from '@material-ui/icons/People';
import pictureIcon from '@material-ui/icons/PhotoCamera';
import trashcanIcon from '@material-ui/icons/Delete';

import polyglotI18nProvider from 'ra-i18n-polyglot';
import chineseMessages from 'ra-language-chinese';
import englishMessages from 'ra-language-english';
import frenchMessages from 'ra-language-french';
import germanMessages from 'ra-language-german';
import italianMessages from 'ra-language-italian';
import portugueseMessages from 'ra-language-portuguese';
import russianMessages from 'ra-language-russian';
// TODO resolve
// Qualified path resolution failed - none of the candidates can be found on the disk.
// import spanishMessages from '@blackbox-vision/ra-language-spanish';

import './App.css';

import authProvider from './authProvider';
import dataProvider from './dataProvider';
import { customLayout, theme } from './customLayout';
import customRoutes from './customRoutes';
import isRegistered from './lib/registry';
import LoginPage from './views/login';
import { accountCreate, accountEdit, accountList, accountSecurity,
         accountShow } from './ra-views/account';
import { albumCreate, albumEdit, albumList, albumShow } from './ra-views/album';
import { ApikeyCreate, apikeyEdit } from './ra-views/apikey';
import { credentialCreate, credentialEdit } from './ra-views/credential';
import { categoryCreate, categoryEdit, categoryList } from './ra-views/category';
import { contactCreate, contactEdit } from './ra-views/contact';
import { grantEdit } from './ra-views/grant';
import { listCreate, listEdit, listList, listShow } from './ra-views/list';
import { locationCreate, locationEdit, locationList,
         locationShow } from './ra-views/location';
import { messageCreate, messageEdit, messageShow } from './ra-views/message';
import { personCreate, personEdit, personList,
         personShow } from './ra-views/person';
import { pictureCreate, pictureEdit } from './ra-views/picture';
import { profileCreate, profileEdit } from './ra-views/profile';
import { scopeCreate, scopeEdit } from './ra-views/scope';
import { settingsEdit } from './ra-views/settings';
import { storageCreate, storageEdit } from './ra-views/storage';
import { trashcanEdit, trashcanList } from './ra-views/trashcan';
import { tzEdit } from './ra-views/tz';

const messages = {
    zh: chineseMessages,
    en: englishMessages,
    fr: frenchMessages,
    de: germanMessages,
    it: italianMessages,
    pt: portugueseMessages,
    ru: russianMessages,
    // es: spanishMessages,
};
const i18nProvider = polyglotI18nProvider(locale => messages[locale],
    resolveBrowserLocale());
const loggedin = /^(admin|user)/;

const App = () => (
    <Admin authProvider={authProvider}
           i18nProvider={i18nProvider}
           dataProvider={dataProvider} customRoutes={customRoutes}
           layout={customLayout} loginPage={LoginPage} theme={theme} >
       {permissions => [
        <Resource name='account' create={accountCreate}
          list={permissions.match(/^admin/) ? accountList : null}
          edit={permissions.match(loggedin) ? accountEdit : null}
          show={permissions.match(loggedin) ? accountShow : null}
          icon={accountIcon} />,
        <Resource name='account_password' edit={accountSecurity} />,
        <Resource name='album'
          list={isRegistered('album') && permissions.match(/^admin/) ? albumList : null}
          create={albumCreate} edit={albumEdit}
          show={albumShow} icon={pictureIcon} />,
        <Resource name='apikey'
          create={permissions.match(loggedin) ? ApikeyCreate : null}
          edit={permissions.match(loggedin) ? apikeyEdit : null} />,
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
        <Resource name='grant'
          edit={permissions.match(/^admin/) ? grantEdit : null} />,
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
        <Resource name='picture'
          create={permissions.match(loggedin) ? pictureCreate : null}
          edit={permissions.match(loggedin) ? pictureEdit : null} />,
        <Resource name='profile'
          create={permissions.match(loggedin) ? profileCreate : null}
          edit={permissions.match(loggedin) ? profileEdit : null} />,
        <Resource name='scope'
          create={permissions.match(/^admin/) ? scopeCreate : null}
          edit={permissions.match(/^admin/) ? scopeEdit : null} />,
        <Resource name='storage'
          create={permissions.match(loggedin) ? storageCreate : null}
          edit={permissions.match(loggedin) ? storageEdit : null} />,
        <Resource name='settings'
          edit={permissions.match(/^admin/) ? settingsEdit : null} />,
        <Resource name='trashcan'
          list={permissions.match(loggedin) ? trashcanList : null}
          edit={permissions.match(loggedin) ? trashcanEdit : null}
          icon={trashcanIcon} options={{ label: 'Trash' }} />,
        <Resource name='tz' edit={tzEdit} />,
	]}
    </Admin>
);

export default App;
