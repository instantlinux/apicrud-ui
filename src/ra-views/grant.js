import React from 'react';
import { Edit, SimpleForm, TextInput } from 'react-admin';

export const grantEdit = props => (
    <Edit {...props}>
      <SimpleForm>
        <TextInput source='name' />
	<TextInput source='value'/>
      </SimpleForm>
    </Edit>
);

export default grantEdit;
