// created 2-feb-2020 by rich braun <docker@instantlinux.net>

import React from 'react';
import { AutocompleteInput, Create, DateTimeInput, Edit, SimpleForm,
         TextInput } from 'react-admin';

import { validateNameShort } from '../lib/validate'

const vendors = [
    { id: 'att', name: 'AT&T' },
    { id: 'aws', name: 'AWS' },
    { id: 'azure', name: 'Azure' },
    { id: 'backblaze', name: 'Backblaze' },
    { id: 'cloudflare', name: 'Cloudflare' },
    { id: 'github', name: 'GitHub' },
    { id: 'gitlab', name: 'GitLab' },
    { id: 'google', name: 'Google' },
    { id: 'local', name: 'local' },
    { id: 'mapquest', name: 'Mapquest' },
    { id: 'twilio', name: 'Twilio' },
    { id: 'vonage', name: 'Vonage' },
]

export const credentialCreate = props => (
    <Create {...props}>
      <SimpleForm redirect={`/settings/${sessionStorage.getItem('settings_id')}/2`} >
        <TextInput source='name' validate={validateNameShort} />
	<AutocompleteInput source='vendor' choices={vendors} />
        <TextInput source='key' label='Username or key ID' />
	<TextInput source='secret' type='password' />
	<TextInput source='otherdata' label='Other data' type='password' />
        <TextInput source='type' />
        <TextInput source='url' label='URL' type='url' />
        <DateTimeInput source='expires' />
        </SimpleForm>
    </Create>
);

export const credentialEdit = props => (
    <Edit {...props} title={<MenuTitle />}>
      <SimpleForm redirect={`/settings/${sessionStorage.getItem('settings_id')}/2`} >
        <TextInput source='name' validate={validateNameShort} />
	<AutocompleteInput source='vendor' choices={vendors} />
        <TextInput source='key' label='Username or key ID' />
	<TextInput source='secret' type='password' />
	<TextInput source='otherdata' label='Other data' type='password' />
        <TextInput source='type' />
        <TextInput source='url' label='URL' type='url' />
        <DateTimeInput source='expires' />
        <AutocompleteInput source='status' choices={[
            { id: 'active', name: 'active' },
            { id: 'disabled', name: 'disabled' },
        ]} />
      </SimpleForm>
    </Edit>
);

const MenuTitle = ({ record}) => {
    return <span>{record ? `${record.vendor} credential: ${record.name}` : ''
		 }</span>;
};

export default credentialCreate;
