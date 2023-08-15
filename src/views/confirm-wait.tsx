// created 19-nov-2019 by rich braun <docker@instantlinux.net>

import React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { Title } from 'react-admin';

const ConfirmWait = () => (
    <Card>
	<Title title="Account Confirmation" />
	<CardContent>
        To confirm your identity, please click on the link sent to you
        and use it to set your password.
	</CardContent>
    </Card>
);
export default ConfirmWait;
