// created 2-feb-2020 by rich braun <docker@instantlinux.net>

import React from 'react';
import { AutocompleteInput, Create, Edit, ImageField, NumberInput,
         ReferenceInput, SelectInput, SimpleForm,
         TextInput } from 'react-admin';

import { privacyChoices } from '../lib/constants';
import { MediaInput } from '../lib/media';
import { validateNameShort, validate64String } from '../lib/validate';

export const pictureCreate = props => (
    <Create {...props}>
      <SimpleForm>
        <TextInput source='name' validate={validateNameShort} />
        <MediaInput />
        <TextInput multiline source='caption' />
        <AutocompleteInput source='privacy' choices={privacyChoices}
            defaultValue='secret' />
        <TextInput source='path' validate={validate64String} />
        <ReferenceInput source='category_id' reference='category' >
           <SelectInput optionText='name' />
        </ReferenceInput>
        <TextInput disabled source='status' defaultValue='active' />
      </SimpleForm>
    </Create>
);

export const pictureEdit = props => (
    <Edit {...props}>
      <SimpleForm>
        <TextInput source='name' validate={validateNameShort} />
        <ImageField source='thumbnail50x50' label='Thumbnail' />
        <TextInput multiline source='caption' />
        <AutocompleteInput source='privacy' choices={privacyChoices} />
        <ReferenceInput source='category_id' reference='category' >
           <SelectInput optionText='name' />
        </ReferenceInput>
        <SelectInput source='orientation' disabled choices={[
            { id: 1, name: 'normal' },
            { id: 3, name: 'inverted' },
            { id: 5, name: '90 clockwise' },
            { id: 7, name: '90 counterclockwise' },
        ]} />
        <NumberInput source='size' label='File size' disabled />
	<NumberInput source='height' disabled />
	<NumberInput source='width' disabled />
	<TextInput source='model' disabled />
        <MediaInput />
      </SimpleForm>
    </Edit>
);

export default pictureCreate;
