// created 1-may-2019 by rich braun <docker@instantlinux.net>

import React from 'react';
import { ChipField, Create, Datagrid,
         Edit, List, SimpleForm, TextInput } from 'react-admin';

export const tzCreate = props => (
    <Create {...props}>
      <SimpleForm>
        <TextInput source='name' />
      </SimpleForm>
    </Create>
);

export const tzEdit = props => (
    <Edit {...props}>
      <SimpleForm>
        <TextInput source='name' />
      </SimpleForm>
    </Edit>
);

export const tzList = props => (
    <List {...props}>
        <Datagrid rowClick="edit">
            <ChipField source='name' />
        </Datagrid>
    </List>
);

export default tzCreate;
