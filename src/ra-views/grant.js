import React from 'react';
import { Edit, DateInput, SimpleForm, TextInput } from 'react-admin';

export const grantEdit = props => {
    const account_id = new URLSearchParams(
        window.location.hash.split('?')[1]).get('account_id');
    const redir = account_id ? `/account/${account_id}/1` : '/account';
    return <Edit {...props} title={<MenuTitle />}>
      <SimpleForm redirect={redir}>
        <TextInput source='name' disabled />
        <TextInput source='value'/>
        <DateInput source='expires' />
      </SimpleForm>
    </Edit>
};

const MenuTitle = ({ record }) => {
    return <span>{record ?
        `Grant: ${record.name}` + (typeof record.owner === 'undefined' ?
                                   '' : ` (${record.owner})`) : '' }</span>;
};

export default grantEdit;
