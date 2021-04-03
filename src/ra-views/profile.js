// created 9-sep-2020 by rich braun <docker@instantlinux.net>

import React from 'react';
import { AutocompleteInput, Create, Edit, FormDataConsumer, ReferenceInput,
         SelectInput, SimpleForm, TextInput } from 'react-admin';

import { localeChoices, privacyChoices, profileChoices,
         pronounChoices } from '../lib/constants';
import { validateRequired96String, validateSelected } from '../lib/validate';
import { LocationRenderer, MenuTitle } from '../lib/ra-custom'

export const profileCreate = props => {
    const { uid } = (typeof props.location.state !== 'undefined'
                     && props.location.state.record);
    const redirect = uid ? `/person/${uid}/2` : 'show';
    return (
    <Create {...props} title='Add Profile Item'>
      <SimpleForm redirect={redirect} >
        <ReferenceInput source='uid' reference='person' disabled
                        filter={{id: sessionStorage.getItem('uid')}}
                        label='User' default_value={uid}>
            <SelectInput optionText='name' />
        </ReferenceInput>
        <ProfileItemFields item='lang' />
        <AutocompleteInput source='privacy' choices={privacyChoices}
                        defaultValue='public' />
        <TextInput disabled source='status' defaultValue='active' />
      </SimpleForm>
    </Create>)
};

export const profileEdit = props => {
    const uid = sessionStorage.getItem('uid')
    const redirect = uid ? `/person/${uid}/2` : '/list';

    return <Edit {...props} title={<MenuTitle />}>
      <SimpleForm redirect={redirect}>
        <ReferenceInput source='uid' reference='person' disabled
                        filter={{id: sessionStorage.getItem('uid')}}
                        label='User' default_value={uid}>
            <SelectInput optionText='name' />
        </ReferenceInput>
        <ProfileItemFields />
        <AutocompleteInput source='privacy' choices={privacyChoices}
                        defaultValue='public' />
        <TextInput disabled source='status' defaultValue='active' />
      </SimpleForm>
    </Edit>
};


const ProfileItemFields = ({item, record, ...props}) => {
  const val = item ? item : record.item;

  return (<div>
    <AutocompleteInput source='item' choices={profileChoices}
        defaultValue={val} />
    <FormDataConsumer>
        {({ formData, ...rest }) => [
            'lang', 'location', 'pronouns', 'tz'].includes(formData.item) ||
        <TextInput source='value' validate={validateRequired96String} />}
    </FormDataConsumer>
    <FormDataConsumer>
        {({ formData, ...rest }) => formData.item === 'lang' &&
         <SelectInput source='value' choices={localeChoices}
             validate={validateSelected} />}
    </FormDataConsumer>
    <FormDataConsumer>
        {({ formData, ...rest }) => formData.item === 'pronouns' &&
        <SelectInput source='value' choices={pronounChoices}
             validate={validateSelected} />}
    </FormDataConsumer>
    <FormDataConsumer>
        {({ formData, ...rest }) => formData.item === 'location' &&
        <ReferenceInput source='location_id' reference='location'
                 validate={validateSelected}>
           <AutocompleteInput optionText={LocationRenderer} />
        </ReferenceInput>}
    </FormDataConsumer>
    <FormDataConsumer>
        {({ formData, ...rest }) => formData.item === 'tz' &&
        <ReferenceInput source='tz_id' reference='tz' label='Timezone'
                 validate={validateSelected}>
           <AutocompleteInput optionText='name' />
        </ReferenceInput>}
    </FormDataConsumer>
  </div>)
}

export default profileCreate;
