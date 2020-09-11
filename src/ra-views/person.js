// created 9-apr-2019 by rich braun <docker@instantlinux.net>

import React from 'react';
import { AutocompleteInput, BooleanField, ChipField, Create, Datagrid,
         DateField, Edit, EditButton, Filter, FormTab, FunctionField, ImageField,
         List, ReferenceField, ReferenceInput, ReferenceManyField,
         SimpleForm, Show, Tab, TabbedForm, TabbedShowLayout,
         TextField, TextInput } from 'react-admin';
import { Link } from 'react-router-dom';
import Button from '@material-ui/core/Button';

import { BottombarSaveOnly, ListPagination, LocationRenderer,
         MenuTitle, TopbarActions, TopbarNoActions } from '../lib/ra-custom'
import isRegistered from '../lib/registry'

export const personCreate = props => (
    <Create {...props} title={<MenuTitle />} redirect='show' >
        <SimpleForm>
            <TextInput source='name' />
            <TextInput source='identity' label='Identity (email)' />
            <ReferenceInput source='location_id' reference='location'>
               <AutocompleteInput optionText={LocationRenderer} />
            </ReferenceInput>
            <TextInput disabled source='status' defaultValue='active' />
            <TextInput disabled source='privacy' defaultValue='public' />
        </SimpleForm>
    </Create>
);

export const personEdit = ({permissions, data, ...props}) => {
  var uid = sessionStorage.getItem('uid');
  return <span>
    <Edit {...props} title={<MenuTitle />} actions={<TopbarNoActions />}>
      <TabbedForm toolbar={<BottombarSaveOnly />}>
        <FormTab label='identity' >
        <TextInput source='name' />
        <TextInput disabled source='identity' label='Identity (email)' />
        {permissions && permissions.match(/^admin/) &&
        <AutocompleteInput source='status' choices={[
            { id: 'active', name: 'active' },
            { id: 'disabled', name: 'disabled' },
        ]} />}
        </FormTab>
        <FormTab label='contact info'>
            <ReferenceManyField reference='contact' target='uid' addLabel={false}>
                <Datagrid  rowClick='edit'>
                    <ChipField source='label' />
                    <ChipField source='type' />
                    <TextField source='info' />
                    <ChipField source='privacy' />
                    <BooleanField source='muted' />
                    <ChipField source='status' />
                    {((permissions && permissions.match(/^admin/)) ||
                      uid === props.id) &&
                    <EditButton />};
                </Datagrid>
            </ReferenceManyField>
            {((permissions && permissions.match(/^admin/)) ||
              uid === props.id) &&
             <CreateContactButton />}
        </FormTab>
        <FormTab label='profile'>
            <ReferenceManyField reference='profile' target='uid' addLabel={false}>
                <Datagrid  rowClick='edit'>
                    <ChipField source='item' />
                    <TextField source='value' />
                    {((permissions && permissions.match(/^admin/)) ||
                      uid === props.id) &&
                    <EditButton />};
                </Datagrid>
            </ReferenceManyField>
            {((permissions && permissions.match(/^admin/)) ||
              uid === props.id) &&
             <CreateProfileButton />}
        </FormTab>
        {isRegistered('picture') &&
        <FormTab label='Pictures'>
            <ReferenceManyField reference='album' target='uid' 
                    filter={{list_id: null}} addLabel={false}>
                <Datagrid  rowClick='show'>
                    <TextField source='name' label='Album' />
                    <ReferenceField label='Cover' source='cover_id'
                        reference='picture' link={false} >
                      <ImageField source='thumbnail50x50' />
                    </ReferenceField>
                    <ChipField source='privacy' />
                    <DateField source='created' />
                </Datagrid>
            </ReferenceManyField>
            <CreateAlbumButton />
        </FormTab>}
      </TabbedForm>
    </Edit>
  </span>
};

export const personList = props => (
    <List {...props} pagination={<ListPagination />} exporter={false}
          filters={<ListFilter />} bulkActionButtons={false}
          sort={{ field: 'name', order: 'ASC'}}>
      <Datagrid rowClick='show'>
        <TextField source='name' />
      </Datagrid>
    </List>
);

export const personShow = (props) => (
    <Show {...props} title={<MenuTitle />} actions={<TopbarActions />}>
      <TabbedShowLayout>
        <Tab label='identity'>
          <TextField source='name' />
          <ReferenceField source='location_id' reference='location'
               link='show' allowEmpty>
             <FunctionField render={record =>
                `${record.address}, ${record.city}`} />
          </ReferenceField>
        </Tab>
        <Tab label='contact info'>
          <ReferenceManyField reference='contact' target='uid' >
              <Datagrid>
                  <ChipField source='label' />
                  <ChipField source='type' />
                  <TextField source='info' />
                  <ChipField source='privacy' />
              </Datagrid>
          </ReferenceManyField>
        <CreateContactButton />
        </Tab>
        <Tab label='profile'>
          <ReferenceManyField reference='profile' target='uid' addLabel={false}>
              <Datagrid>
                  <ChipField source='item' />
                  <TextField source='value' />
              </Datagrid>
          </ReferenceManyField>
        </Tab>
        <Tab label='Pictures' >
            <ReferenceManyField reference='album' target='uid' 
                    filter={{list_id: null}} addLabel={false}>
                <Datagrid  rowClick='show'>
                    <TextField source='name' label='Album' />
                    <ReferenceField label='Cover' source='cover_id'
                        reference='picture' link={false} >
                      <ImageField source='thumbnail50x50' />
                    </ReferenceField>
                    <DateField source='created' />
                </Datagrid>
            </ReferenceManyField>
        </Tab>
      </TabbedShowLayout>
    </Show>
);

const CreateContactButton = ({ record, permissions }) => {
  var uid = sessionStorage.getItem('uid');
  if ((permissions && permissions.match(/^admin/)) ||
      ((record && uid === record.id) || (record && record.referrer_id === uid))) {
    return <Button component={Link} variant='contained'
        to={{
            pathname: '/contact/create',
            state: { record: { uid: record.id } },
        }}>
        Add
    </Button>
    }
  else {
      return <span></span>
  }
};

const CreateProfileButton = ({ record, permissions }) => {
  var uid = sessionStorage.getItem('uid');
  if ((permissions && permissions.match(/^admin/)) ||
      ((record && uid === record.id) || (record && record.referrer_id === uid))) {
    return <Button component={Link} variant='contained'
        to={{
            pathname: '/profile/create',
            state: { record: { uid: record.id } },
        }}>
        Add
    </Button>
    }
  else {
      return <span></span>
  }
};

const CreateAlbumButton = ({ record }) => {
    return <Button component={Link} variant='contained'
        to={{
            pathname: '/album/create',
            state: { record: { uid: record.id } },
        }}>
        Add
    </Button>
}

const ListFilter = (props) => (
    <Filter {...props}>
        <TextInput source='name' />
    </Filter>
);

export default personCreate;
