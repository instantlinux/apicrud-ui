// created 20-jan-2020 by rich braun <docker@instantlinux.net>

import React from 'react';
import { AutocompleteInput, ChipField, Create, Datagrid, DeleteButton,
         Edit, List, ImageField, ReferenceArrayField, ReferenceField,
         ReferenceInput, SelectArrayInput, SelectInput, Show,
         SimpleForm, TextField, TextInput } from 'react-admin';

import { privacyChoices, defaultThumbnailSizes } from '../lib/constants';
import { TopbarActions } from '../lib/ra-custom';
import { validateNameShort } from '../lib/validate';
import { MediaGallery, MediaInput } from '../lib/media';

export const albumCreate = props => (
    <Create {...props}>
      <SimpleForm>
        <TextInput source='name' validate={validateNameShort} />
        <AutocompleteInput source='privacy' choices={privacyChoices}
            defaultValue='invitee' />
        <SelectArrayInput source='sizes' label='Thumbnail sizes - height'
         choices={[
            { id: 80, name: '80' },
            { id: 100, name: '100' },
            { id: 120, name: '120' },
            { id: 160, name: '160' },
            { id: 240, name: '240' },
            { id: 600, name: '600' },
            { id: 720, name: '720' },
            { id: 800, name: '800' },
            { id: 1024, name: '1024' },
            { id: 1080, name: '1080' },
            { id: 1280, name: '1280' },
            { id: 2048, name: '2048' },
        ]} defaultValue={defaultThumbnailSizes} disabled />
        <TextInput disabled source='status' defaultValue='active' />
      </SimpleForm>
    </Create>
);

export const albumEdit = props => (
    <Edit {...props} title={<RecordName />} >
      <SimpleForm>
        <TextInput source='name' validate={validateNameShort} />
        <MediaInput parent_id={props.id} />
        <AutocompleteInput source='privacy' choices={privacyChoices} />
        <ReferenceArrayField source='pictures' reference='picture' fullWidth>
           <Datagrid rowClick='edit'>
             <ImageField source='thumbnail50x50' label='Pic' />
             <TextField source='name' />
             <TextField source='caption' multiline emptyText=' ' />
             <DeleteButton />
           </Datagrid>
        </ReferenceArrayField>
        <SelectArrayInput source='sizes' label='Thumbnail sizes - height'
         choices={[
            { id: 80, name: '80' },
            { id: 100, name: '100' },
            { id: 120, name: '120' },
            { id: 160, name: '160' },
            { id: 240, name: '240' },
            { id: 600, name: '600' },
            { id: 720, name: '720' },
            { id: 800, name: '800' },
            { id: 1024, name: '1024' },
            { id: 1080, name: '1080' },
            { id: 1280, name: '1280' },
            { id: 2048, name: '2048' },
        ]} disabled />
        <ReferenceInput source='category_id' reference='category' >
           <SelectInput optionText='name' />
        </ReferenceInput>
      </SimpleForm>
    </Edit>
);

export const albumShow = props => (
    <Show {...props} title={<RecordName />} actions={<TopbarActions />}>
        <MediaGallery />
    </Show>
);

export const albumList = props => (
    <List {...props}>
        <Datagrid rowClick="show">
	    <ReferenceField label='Cover' source='cover_id' link={false}
                    reference='picture'>
                <ImageField source='thumbnail50x50' />
            </ReferenceField>
            <ChipField source='name' />
            <ChipField source='owner' sortable={false} />
        </Datagrid>
    </List>
);

const RecordName = ({ record }) => {
    return <span>{record ? record.name : ''}</span>;
}

export default albumCreate;
