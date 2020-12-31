// created 30-dec-2020 by rich braun <docker@instantlinux.net>

import React from 'react';
import { AutocompleteInput, AutocompleteArrayInput, Create, DateTimeInput,
         Edit, ReferenceArrayInput, SimpleForm, TextInput,
	 useRedirect } from 'react-admin';

import { validate32String } from '../lib/validate';
import { MenuTitle } from '../lib/ra-custom';

export const ApikeyCreate = props => {
  const redirect = useRedirect();
  const onSuccess = ({ data }) => {
      sessionStorage.setItem('apikey', JSON.stringify(data));
      redirect('/apikeynew');
  };
  return (
    <Create {...props} title='Create API key' onSuccess={onSuccess}>
      <SimpleForm>
        <TextInput source='name' validate={validate32String} />
        <ReferenceArrayInput label='Scopes' source='scopes' 
              filter={{ settings_id: sessionStorage.getItem('settings_id') }}
              sort={{ field: 'name', order: 'ASC' }}
              reference='scope' target='scope_id'>
          <AutocompleteArrayInput optionText='name' />
        </ReferenceArrayInput>
        <DateTimeInput source='expires' />
      </SimpleForm>
    </Create>
  );
};

export const apikeyEdit = props => (
    <Edit {...props} title={<MenuTitle />}>
      <SimpleForm redirect={`/person/${sessionStorage.getItem('uid')}/4`} >
        <TextInput source='name' validate={validate32String} />
        <ReferenceArrayInput label='Scopes' source='scopes' 
              filter={{ settings_id: sessionStorage.getItem('settings_id') }}
              sort={{ field: 'name', order: 'ASC' }}
              reference='scope' target='scope_id'>
          <AutocompleteArrayInput optionText='name' />
        </ReferenceArrayInput>
        <AutocompleteInput source='status' choices={[
            { id: 'active', name: 'active' },
            { id: 'disabled', name: 'disabled' },
        ]} />
        <DateTimeInput disabled source='expires' />
        <DateTimeInput disabled source='last_used' />
        <TextInput disabled source='prefix' />
      </SimpleForm>
    </Edit>
);

export default ApikeyCreate;
