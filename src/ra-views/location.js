// created 25-mar-2019 by rich braun <docker@instantlinux.net>

import React from 'react';
import { AutocompleteInput, ChipField, Create, Datagrid, Edit, Filter, List,
         ReferenceInput, SelectInput, Show, SimpleForm, SimpleShowLayout,
         TextField, TextInput } from 'react-admin';

import { privacyChoices } from '../lib/constants';
import { LocationMap } from '../lib/mapbox';
import { TopbarActions } from '../lib/ra-custom';
import { validateCountry,
         validateNameShort } from '../lib/validate';

export const locationCreate = props => (
    <Create {...props}>
      <SimpleForm redirect='show'>
        <TextInput source='name' label='Venue Name' />
        <TextInput source='address' />
        <TextInput source='city' validate={validateNameShort} />
        <TextInput source='state' />
        <TextInput source='postalcode' />
        <TextInput source='country' defaultValue='US' validate={validateCountry} />
        <TextInput source='neighborhood' />
        <AutocompleteInput source='privacy' choices={privacyChoices}
            defaultValue='invitee' />
        <ReferenceInput source='category_id' reference='category' >
            <SelectInput optionText='name' />
        </ReferenceInput>
        <TextInput disabled source='status' defaultValue='active' />
      </SimpleForm>
    </Create>
);

export const locationEdit = props => (
    <Edit {...props} title={<MenuTitle />}>
      <SimpleForm>
        <TextInput source='name' label='Venue Name' />
        <TextInput source='address' />
        <TextInput source='city' />
        <TextInput source='state' />
        <TextInput source='postalcode' />
        <TextInput source='country' />
        <TextInput source='neighborhood' />
        <AutocompleteInput source='privacy' choices={privacyChoices} />
        <ReferenceInput source='category_id' reference='category'>
            <SelectInput optionText='name' />
        </ReferenceInput>
        <AutocompleteInput source='status' choices={[
            { id: 'active', name: 'active' },
            { id: 'disabled', name: 'disabled' },
        ]} />
      </SimpleForm>
    </Edit>
);

const Aside = ({record}) => (
    <LocationMap {...record} />
);

export const locationShow = props => (
    <Show {...props} aside={<Aside />} title={<MenuTitle />}
          actions={<TopbarActions />}>
      <SimpleShowLayout>
        <TextField source='name' label='Venue Name' emptyText=' ' />
        <TextField source='address' emptyText=' ' />
        <TextField source='city' emptyText=' ' />
        <TextField source='state' emptyText=' ' />
        <TextField source='country' emptyText=' ' />
        <TextField source='postalcode' emptyText=' ' />
        <TextField source='neighborhood' emptyText=' ' />
        <ChipField source='privacy' />
        <ChipField source='category' />
      </SimpleShowLayout>
    </Show>
);

export const locationList = props => (
    <List {...props} exporter={false} filters={<ListFilter />}
          bulkActionButtons={false}>
      <Datagrid rowClick='show'>
        <TextField source='name' label='Venue Name' emptyText=' ' />
        <TextField source='address' emptyText=' ' />
        <TextField source='city' emptyText=' ' />
        <TextField source='state' emptyText=' ' />
        <TextField source='postalcode' emptyText=' ' />
        <ChipField source='owner' sortable={false} />
        <ChipField source='category' sortable={false} />
      </Datagrid>
    </List>
);

const MenuTitle = ({ record }) => {
    return <span>{record.name ? record.name : record.address
                 }</span>;
};

const ListFilter = (props) => (
    <Filter {...props}>
        <ReferenceInput source='category_id' reference='category'>
          <SelectInput optionText='name' />
        </ReferenceInput>
        <ReferenceInput source='uid' reference='person'>
          <SelectInput optionText='name' />
        </ReferenceInput>
    </Filter>
);

export default locationCreate;
