// created 9-apr-2019 by rich braun <docker@instantlinux.net>

import React from 'react';
import { AutocompleteInput, ChipField, Create, Datagrid,
         Edit, List, SimpleForm, TextField, TextInput } from 'react-admin';

export const categoryCreate = props => (
    <Create {...props}>
      <SimpleForm>
        <TextInput source='name' />
        <AutocompleteInput source='status' choices={[
            { id: 'active', name: 'active' },
            { id: 'disabled', name: 'disabled' },
        ]} defaultValue='active' />
      </SimpleForm>
    </Create>
);

export const categoryEdit = props => (
    <Edit {...props}>
      <SimpleForm>
        <TextInput source='name' />
        <AutocompleteInput source='status' choices={[
            { id: 'active', name: 'active' },
            { id: 'disabled', name: 'disabled' },
        ]} />
      </SimpleForm>
    </Edit>
);

export const categoryList = props => (
    <List {...props} bulkActionButtons={false}>
        <Datagrid rowClick="edit">
            <ChipField source='name' />
            <TextField source='owner' />
        </Datagrid>
    </List>
);

export default categoryCreate;
