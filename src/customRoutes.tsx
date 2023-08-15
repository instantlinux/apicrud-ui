// created 9-apr-2019 by rich braun <docker@instantlinux.net>

import React from 'react';
import { CustomRoutes } from 'react-admin';
import { Route } from 'react-router-dom';
import welcome from './views/welcome';
import AboutPage from './views/aboutPage';
import apikeyNew from './views/apikey-new';
import cnfrm from './views/confirm';
import confirmWait from './views/confirm-wait';
import loginExt from './lib/login-ext';
import magic from './lib/magic';
import MFA from './views/mfa';
import prefs from './lib/prefs';

export const AppCustomRoutes = () => (
  <CustomRoutes>
    <Route path="/" element={welcome} />
    <Route path="/welcome" element={welcome} />
    <Route path="/about" element={<AboutPage />} />
    <Route path="/apikeynew" element={apikeyNew} />
    <Route path="/confirm" element={cnfrm} />
    <Route path="/confirmwait" element={confirmWait} />
    <Route path="/ev" element={magic} noLayout />
    <Route path="/login/ext" element={loginExt} />
    <Route path="/mfa" element={MFA} />
    <Route path="/prefs" element={prefs} noLayout />
  </CustomRoutes>
);
