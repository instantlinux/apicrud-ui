// created 30-dec-2020 by rich braun <docker@instantlinux.net>

import React from 'react';
import { AutocompleteInput, Create, Edit, SimpleForm,
         TextInput } from 'react-admin';

import { MenuTitle } from '../lib/ra-custom';
import { validate32String } from '../lib/validate';

export const scopeCreate = props => (
    <Create {...props}>
      <SimpleForm redirect={`/settings/${sessionStorage.getItem('settings_id')}/3`} >
        <TextInput source='name' validate={validate32String} />
      </SimpleForm>
    </Create>
);

export const scopeEdit = props => (
    <Edit {...props} title={<MenuTitle />}>
      <SimpleForm redirect={`/settings/${sessionStorage.getItem('settings_id')}/3`} >
        <TextInput source='name' validate={validate32String} />
        <AutocompleteInput source='status' choices={[
            { id: 'active', name: 'active' },
            { id: 'disabled', name: 'disabled' },
        ]} />
      </SimpleForm>
    </Edit>
);

export default scopeCreate;
