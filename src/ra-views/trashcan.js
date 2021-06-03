// created 24-may-2021 by rich braun <docker@instantlinux.net>

import React from 'react';
import { AutocompleteInput, ChipField, Datagrid, Edit, Filter, FunctionField,
         List, ReferenceField, ReferenceInput, SelectInput, SimpleForm,
         TextField, TextInput } from 'react-admin';
import Moment from 'react-moment';

export const trashcanEdit = props => (
    <Edit {...props}>
      <SimpleForm>
        <TextInput source='resource' disabled />
        <TextInput source='name' disabled />
        <AutocompleteInput source='status' choices={[
            { id: 'active', name: 'active' },
            { id: 'disabled', name: 'disabled' },
        ]} />
        <ReferenceField source='uid' reference='person' label='Owner'>
          <ChipField source='name' />
        </ReferenceField>
      </SimpleForm>
    </Edit>
);

export const trashcanList = props => (
    <List {...props} bulkActionButtons={false} filters={<TrashFilter />}
            filterDefaultValues={{ resource: 'list' }}>
        <Datagrid rowClick='edit'>
            <TextField source='resource' />
            <TextField source='name' />
            <FunctionField source='created' render={record =>
                <Moment fromNow>{record.created}</Moment>} />}
            <FunctionField source='modified' render={record =>
                record.modified &&
                <Moment fromNow>{record.modified}</Moment>} />}
        </Datagrid>
    </List>
);

const TrashFilter = (props) => {
    var resources = [];
    Object.keys(JSON.parse(sessionStorage.getItem('resource_endpoints'))
               ).forEach(function(resource) {
        ['auth', 'grant', 'metric', 'scope', 'settings',
         'trashcan', 'tz'].includes(resource) ||
        resources.push({id: resource, name: resource})
    })
    return <Filter {...props}>
        <SelectInput source='resource' choices={ resources }
            allowEmpty={false} alwaysOn />
        <ReferenceInput source='uid' reference='person' label='Person'>
          <SelectInput optionText='name' />
        </ReferenceInput>
    </Filter>
};

export default trashcanList;
