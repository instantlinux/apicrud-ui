// created 6-apr-2019 by rich braun <docker@instantlinux.net>

import React from 'react';
import { AutocompleteInput, BooleanInput, Create, Edit, ReferenceField,
         ReferenceInput,
         SelectInput, SimpleForm, TextField, TextInput } from 'react-admin';

import { privacyChoices } from '../lib/constants';

export const contactCreate = props => {
    const { uid } = (typeof props.location.state !== 'undefined' 
                     && props.location.state.record);
    const redirect = uid ? `/person/${uid}/1` : 'show';
    return (
    <Create {...props}>
      <SimpleForm redirect={redirect} >
        <AutocompleteInput source='type' choices={[
            { id: 'email', name: 'email' },
            { id: 'linkedin', name: 'linkedin' },
            { id: 'location', name: 'location' },
            { id: 'messenger', name: 'messenger' },
            { id: 'slack', name: 'slack' },
            { id: 'sms', name: 'sms' },
            { id: 'voice', name: 'voice' },
            { id: 'whatsapp', name: 'whatsapp' },
        ]} defaultValue='email' />
        <TextInput source='info' label='Contact number/address'/>
        <AutocompleteInput source='carrier' choices={[
            { id: null, name: 'Choose...' },
            { id: 'att', name: 'AT&T' },
            { id: 'sprint', name: 'Sprint' },
            { id: 'tmobile', name: 'T-Mobile' },
            { id: 'verizon', name: 'Verizon' },
        ]} defaultValue={null} />
        <AutocompleteInput source='label' choices={[
            { id: 'home', name: 'home' },
            { id: 'mobile', name: 'mobile' },
            { id: 'work', name: 'work' },
            { id: 'other', name: 'other' },
        ]} defaultValue='home' />
        <AutocompleteInput source='privacy' choices={privacyChoices}
                        defaultValue='member' />
        <BooleanInput source='muted' defaultValue={false}
                        label='Mute notifications' />
        <ReferenceInput source="uid" reference="person"
                        filter={{id: sessionStorage.getItem('uid')}}
                        label='User' default_value={uid}>
            <SelectInput optionText="name" />
        </ReferenceInput>
        <TextInput disabled source='status' defaultValue='unconfirmed' />  
      </SimpleForm>
    </Create>)
};

export const contactEdit = props => {
    const uid = sessionStorage.getItem('uid')
    const redirect = uid ? `/person/${uid}/1` : '/list';

    return <Edit {...props} title={<MenuTitle />}>
        <SimpleForm redirect={redirect}>
            <TextInput source='info' label='Contact number/address'/>
            <AutocompleteInput source='type' choices={[
                { id: 'email', name: 'email' },
                { id: 'linkedin', name: 'linkedin' },
                { id: 'location', name: 'location' },
                { id: 'messenger', name: 'messenger' },
                { id: 'slack', name: 'slack' },
                { id: 'sms', name: 'sms' },
                { id: 'voice', name: 'voice' },
                { id: 'whatsapp', name: 'whatsapp' },
            ]} />
            <AutocompleteInput source='carrier' choices={[
                { id: 'att', name: 'AT&T' },
                { id: 'sprint', name: 'Sprint' },
                { id: 'tmobile', name: 'T-Mobile' },
                { id: 'verizon', name: 'Verizon' },
            ]} />
            <AutocompleteInput source='label' choices={[
                { id: 'home', name: 'home' },
                { id: 'mobile', name: 'mobile' },
                { id: 'work', name: 'work' },
                { id: 'other', name: 'other' },
            ]} />
            <AutocompleteInput source='privacy' choices={privacyChoices} />
            <BooleanInput source='muted' defaultValue={false}
                          label='Mute notifications' />
            <ReferenceField label='User' source='uid' reference='person'
                          filter={{id: sessionStorage.getItem('uid')}}>
               <TextField source='name' />
            </ReferenceField>
        </SimpleForm>
    </Edit>
};

const MenuTitle = ({ record}) => {
    return <span>{record ? `Contact ${record.type}: ${record.info}` : ''}</span>;
};

export default contactCreate;
