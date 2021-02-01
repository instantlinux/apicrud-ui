// created 9-apr-2019 by rich braun <docker@instantlinux.net>

import React from 'react';
import { AutocompleteInput, ChipField, Create, Datagrid, DateField, Edit,
         FormTab, List, NumberField, NumberInput, ReferenceField,
         ReferenceInput, ReferenceManyField, SelectInput, SimpleForm,
         TabbedForm, TextField, TextInput, UrlField } from 'react-admin';
import { Link } from 'react-router-dom';
import Button from '@material-ui/core/Button';

import isRegistered from '../lib/registry'
import { privacyChoices } from '../lib/constants';
import { validateKeywordAlpha } from '../lib/validate';

export const settingsCreate = props => (
    <Create {...props}>
      <SimpleForm>
        <TextInput source='name' validation={validateKeywordAlpha} />
        <SelectInput source='privacy' choices={privacyChoices}
            defaultValue='public' />
        <TextInput source='smtp_smarthost' />
        <NumberInput source='smtp_port' />
        <ReferenceInput source='smtp_credential_id' label='SMTP credential'
                reference='credential' allowEmpty>
           <SelectInput optionText='name' />
        </ReferenceInput>
        <ReferenceInput source="administrator_id" reference="person">
           <SelectInput optionText="name" />
        </ReferenceInput>
        <ReferenceInput source='smtp_sender' />
        <TextInput source='country' />
        <ReferenceInput source="tz_id" reference="tz">
           <AutocompleteInput optionText='name' />
        </ReferenceInput>
        <TextInput source='url' type='url' label='URL' />
        <ReferenceInput source='default_cat_id' reference='category'>
           <SelectInput optionText='name' />
        </ReferenceInput>
        <TextInput source='window_title' />
      </SimpleForm>
    </Create>
);

export const settingsEdit = props => (
    <Edit {...props} title='Settings'>
     <TabbedForm >
        <FormTab label='settings'>
          <TextInput source='name' validation={validateKeywordAlpha} />
          <SelectInput source='privacy' label='Default privacy'
              choices={privacyChoices} defaultValue='public' />
          <TextInput source='smtp_smarthost' label='SMTP smarthost' />
          <NumberInput source='smtp_port' label='SMTP port' />
          <ReferenceInput source='smtp_credential_id' label='SMTP credential'
                  reference='credential' allowEmpty>
             <SelectInput optionText='name' />
          </ReferenceInput>
          <ReferenceInput source='administrator_id' reference='person'>
             <SelectInput optionText='name' />
          </ReferenceInput>
          <TextInput source='country' />
          <AutocompleteInput source='lang' label='Default language' choices={[
              { id: 'zh', name: 'Chinese' },
              { id: 'en_US', name: 'English' },
              { id: 'fr', name: 'French' },
              { id: 'de', name: 'German' },
              { id: 'pt', name: 'Portuguese' },
              { id: 'es', name: 'Spanish' },
          ]} defaultValue='en_US' />
          <ReferenceInput source='tz_id' reference='tz'
               label='Default timezone'>
             <AutocompleteInput optionText='name' />
          </ReferenceInput>
          <TextInput source='url' label='URL' />
          <TextInput source='window_title' />
          {isRegistered('storage') &&
          <ReferenceInput source='default_storage_id' reference='storage'
               label='Default storage volume'>
             <AutocompleteInput optionText='name' />
          </ReferenceInput>}
          <ReferenceInput source='default_hostlist_id' reference='list'
               label='Default hostlist' >
            <AutocompleteInput optionText='name' />
          </ReferenceInput>
          <ReferenceInput source='default_cat_id' reference='category'
               label='Default category'>
             <AutocompleteInput optionText='name' />
          </ReferenceInput>
        </FormTab>
        {isRegistered('storage') &&
        <FormTab label='Storage' toolbar={null} >
            <ReferenceManyField reference='storage' target='uid'
                    filter={{uid: sessionStorage.getItem('uid')}}
                    addLabel={false}>
                <Datagrid rowClick='edit'>
                    <TextField source='name' />
                    <TextField source='prefix' />
                    <TextField source='bucket' />
                    <ChipField source='privacy' />
                    <ReferenceField source='credentials_id' reference='credential'>
                       <TextField source='name' />
                    </ReferenceField>
                    <ChipField source='status' />
                </Datagrid>
            </ReferenceManyField>
            <CreateStorageButton />
         </FormTab>}
        <FormTab label='Credentials' toolbar={null}>
            <ReferenceManyField reference='credential' target='settings_id'
                                addLabel={false}>
                <Datagrid rowClick='edit'>
                    <TextField source='name' />
                    <TextField source='vendor' />
                    <TextField source='key' emptyText=' ' />
                    <TextField source='type' emptyText=' ' />
                    <DateField source='expires' />
                    <ChipField source='status' />
                </Datagrid>
            </ReferenceManyField>
            <CreateCredentialButton />
        </FormTab>
        <FormTab label='Scopes' toolbar={null}>
            <ReferenceManyField reference='scope' target='settings_id'
                                addLabel={false}>
                <Datagrid rowClick='edit'>
                    <TextField source='name' />
                    <ChipField source='status' />
                </Datagrid>
            </ReferenceManyField>
            <CreateScopeButton />
        </FormTab>
      </TabbedForm>
    </Edit>
);

export const settingsList = props => (
    <List {...props}>
        <Datagrid rowClick="edit">
            <TextField source='privacy' />
            <NumberField source='smtp_port' />
            <TextField source='smtp_smarthost' />
            <UrlField source='url' />
            <TextField source='window_title' />
            <TextField source='owner' sortable={false} />
            <DateField source='created' />
            <DateField source='modified' />
        </Datagrid>
    </List>
);

const CreateCredentialButton = ({ record }) => (
    <Button component={Link} variant='contained'
        to={{
            pathname: '/credential/create',
            state: { record: { settings_id: record.id } },
        }}>
        Add
    </Button>
);

const CreateScopeButton = ({ record }) => (
    <Button component={Link} variant='contained'
        to={{ pathname: '/scope/create' }}>
        Add
    </Button>
);

const CreateStorageButton = ({ record }) => (
    <Button component={Link} variant='contained'
        to={{ pathname: '/storage/create' }}>
        Add
    </Button>
);

export default settingsCreate;
