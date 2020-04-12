// created 2-feb-2020 by rich braun <docker@instantlinux.net>

import React from 'react';
import { AutocompleteInput, Create, DateTimeInput, Edit, SimpleForm,
         TextInput } from 'react-admin';

import { validateNameShort } from '../lib/validate'

const vendors = [
    { id: 'aws', name: 'aws' },
    { id: 'azure', name: 'azure' },
    { id: 'backblaze', name: 'backblaze' },
    { id: 'google', name: 'google' },
    { id: 'mapquest', name: 'mapquest' },
]

export const credentialCreate = props => (
    <Create {...props}>
      <SimpleForm>
        <TextInput source='name' validate={validateNameShort} />
	<AutocompleteInput source='vendor' choices={vendors} />
        <TextInput source='key' />
	<TextInput source='secret' type='password' />
	<TextInput source='otherdata' labe='Other data' type='password' />
        <TextInput source='type' />
        <TextInput source='url' label='URL' type='url' />
        <DateTimeInput source='expires' />
        </SimpleForm>
    </Create>
);

export const credentialEdit = props => (
    <Edit {...props} title={<MenuTitle />}>
      <SimpleForm>
        <TextInput source='name' validate={validateNameShort} />
	<AutocompleteInput source='vendor' choices={vendors} />
        <TextInput source='key' />
	<TextInput source='secret' type='password' />
	<TextInput source='otherdata' labe='Other data' type='password' />
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
