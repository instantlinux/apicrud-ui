// created 26-apr-2019 by rich braun <docker@instantlinux.net>

import React from 'react';
import { AppBar, Layout, MenuItemLink, UserMenu,
         useTranslate } from 'react-admin';
import AboutIcon from  '@material-ui/icons/ShortText';
import HomeIcon from  '@material-ui/icons/Home';
import PasswordIcon from  '@material-ui/icons/VpnKey';
import ProfileIcon from '@material-ui/icons/PersonPin';
import SettingsIcon from '@material-ui/icons/Settings';
import { createTheme } from '@material-ui/core/styles';
import blue from '@material-ui/core/colors/blue';

const CustomUserMenu = (props) => {
    var permissions = sessionStorage.getItem('auth');
    var account_id = sessionStorage.getItem('account_id');
    var uid = sessionStorage.getItem('uid');
    const translate = useTranslate();
    return <UserMenu {...props}>
        <MenuItemLink to='/' primaryText='Home'
                      leftIcon={<HomeIcon />}
        />
        <MenuItemLink to='/about' primaryText={translate('ra.message.about')}
                      leftIcon={<AboutIcon />}
        />
        {uid &&
        <MenuItemLink to={'/person/' + uid}
         primaryText={translate('ra.auth.user_menu')} leftIcon={<ProfileIcon />}
        />}
        {uid && account_id &&
        <MenuItemLink to={'/account_password/' + uid}
         primaryText={translate('ra.auth.password')} leftIcon={<PasswordIcon />}
        />}
        {permissions && permissions.match(/^admin/) &&
        <MenuItemLink to={'/settings/' + sessionStorage.getItem('settings_id')}
                      primaryText='Settings' leftIcon={<SettingsIcon />}
        />}
    </UserMenu>
};

const CustomAppBar = props => <AppBar {...props} userMenu={<CustomUserMenu />} />;

export const theme = createTheme({
    palette: { secondary: blue, contrastThreshold: 3, tonalOffset: 0.2 },
    sidebar: { width: 150, closedWidth: 55 },
});

export const customLayout = (props) => <Layout {...props}
    appBar={CustomAppBar}
/>;

export default customLayout;
