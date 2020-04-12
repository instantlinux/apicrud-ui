// created 9-apr-2019 by rich braun <docker@instantlinux.net>

import React from 'react';
import { Route } from 'react-router-dom';
import welcome from './views/welcome.js';
import aboutPage from './views/aboutPage.js';
import cnfrm from './views/confirm.js';
import confirmWait from './views/confirm-wait.js';
import magic from './lib/magic.js';
import prefs from './views/prefs.js';

export default [
    <Route exact path="/" component={welcome} />,
    <Route exact path="/welcome" component={welcome} />,
    <Route exact path="/about" component={aboutPage} />,
    <Route exact path="/confirm" component={cnfrm} />,
    <Route exact path="/confirmwait" component={confirmWait} />,
    <Route exact path="/ev" component={magic} noLayout />,
    <Route exact path="/prefs" component={prefs} noLayout />,
];
