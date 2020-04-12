// created 2-feb-2020 by rich braun <docker@instantlinux.net>

import React from 'react';
import { AutocompleteInput, Create, Edit, ReferenceInput,
         SimpleForm, TextInput } from 'react-admin';

import { privacyChoices } from '../lib/constants';
import { validate64String, validateNameShort,
         validateSelected, validateURI } from '../lib/validate'

export const storageCreate = props => (
    <Create {...props}>
      <SimpleForm>
        <TextInput source='name' validate={validateNameShort} />
        <TextInput source='prefix' validate={validate64String} />
        <TextInput source='bucket' validate={validateNameShort} />
        <TextInput source='cdn_uri' label='CDN service URL'
            validate={validateURI} />
        <TextInput source='identifier' validate={validate64String} />
        <AutocompleteInput source='privacy' choices={privacyChoices}
            defaultValue='public' />
        <ReferenceInput source='credentials_id' reference='credential'
                validate={validateSelected} >
           <AutocompleteInput optionText='name' />
        </ReferenceInput>
      </SimpleForm>
    </Create>
);

export const storageEdit = props => (
    <Edit {...props} title={<MenuTitle />}>
      <SimpleForm>
        <TextInput source='name' validate={validateNameShort} />
        <TextInput source='prefix' validate={validate64String} />
        <TextInput source='bucket' validate={validateNameShort} />
        <TextInput source='cdn_uri' label='CDN service URL'
            validate={validateURI} />
        <TextInput source='identifier' validate={validate64String} />
        <AutocompleteInput source='privacy' choices={privacyChoices} />
        <ReferenceInput source='credentials_id' reference='credential'
                validate={validateSelected} >
           <AutocompleteInput optionText='name' />
        </ReferenceInput>
        <AutocompleteInput source='status' choices={[
            { id: 'active', name: 'active' },
            { id: 'disabled', name: 'disabled' },
        ]} />
      </SimpleForm>
    </Edit>
);

const MenuTitle = ({ record}) => {
    return <span>{record ? `Storage: ${record.name}` : ''
                 }</span>;
};

export default storageCreate;
