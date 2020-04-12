// created 22-apr-2019 by rich braun <docker@instantlinux.net>

import React from 'react';
import { AutocompleteInput, AutocompleteArrayInput, ChipField, Create,
	 Datagrid, Edit, Filter, List,
	 ReferenceArrayInput, ReferenceInput, ReferenceArrayField,
	 RichTextField, SelectInput, Show, SimpleForm, SimpleShowLayout,
	 SingleFieldList, TextField, TextInput } from 'react-admin';
import RichTextInput from 'ra-input-rich-text';
import { parse } from 'query-string';

import { privacyChoices, toolbarOpts } from '../lib/constants';
import { MenuTitle, TopbarActions } from '../lib/ra-custom';
import { validateNameShort } from '../lib/validate';

export const listCreate = props => {
    const { uid: uid_string } = parse(props.location.state);
    const uid = uid_string || '';
    const redirect = uid ? `/person/${uid}/show/lists` : 'show';

    return (
      <Create {...props}>
        <SimpleForm redirect={redirect} >
          <TextInput source='name' label='List'
	      validate={validateNameShort} />
          <RichTextInput source='description' toolbar={toolbarOpts} />
          <AutocompleteInput source='privacy' choices={privacyChoices}
              defaultValue='secret' />
          <ReferenceInput source='category_id' reference='category' >
            <SelectInput optionText='name' />
          </ReferenceInput>
          <ReferenceArrayInput label='Members' source='members'
                  sort={{ field: 'name', order: 'ASC' }}
                  reference='person' perPage={40} >
              <AutocompleteArrayInput optionText='name' />
          </ReferenceArrayInput>
          <TextInput disabled source='status' defaultValue='active' />  
        </SimpleForm>
      </Create>
    );
};

export const listEdit = props => (
    <Edit {...props} title={<MenuTitle />}>
        <SimpleForm>
            <TextInput source='name' label='List'
                validate={validateNameShort} />
            <RichTextInput source='description' toolbar={toolbarOpts} />
            <AutocompleteInput source='privacy' choices={privacyChoices} />
            <ReferenceInput source='category_id' reference='category' >
                <SelectInput optionText='name' />
            </ReferenceInput>
            <ReferenceArrayInput label='Members' source='members'
                    sort={{ field: 'name', order: 'ASC' }}
                    reference='person' optionText='name' perPage={40} >
                <AutocompleteArrayInput />
            </ReferenceArrayInput>
            <TextInput disabled source='status' />
        </SimpleForm>
    </Edit>
);

export const listList = props => (
    <List {...props} exporter={false} filters={<ListFilter />}
          bulkActionButtons={false}
          sort={{ field: 'name', order: 'ASC'}}>
      <Datagrid rowClick='show'>
        <TextField source='name' />
        <ChipField source='privacy' />
        <ChipField source='owner' sortable={false} />
        <ChipField source='category' sortable={false} />
      </Datagrid>
    </List>
);

export const listShow = props => (
    <Show {...props} title={<MenuTitle />} actions={<TopbarActions />}>
      <SimpleShowLayout>
        <TextField source='name' label='List' />
        <RichTextField source='description' />
        <ChipField source='privacy' />
        <ChipField source='category' />
	<ReferenceArrayField source='members' reference='person'
              perPage={40} >
          <SingleFieldList linkType='show'>
            <ChipField source='name' label='Members' />
          </SingleFieldList>
	</ReferenceArrayField>
      </SimpleShowLayout>
    </Show>
);

const ListFilter = (props) => (
    <Filter {...props}>
        <ReferenceInput source='category_id' reference='category'>
          <SelectInput optionText='name' />
        </ReferenceInput>
        <AutocompleteInput source='privacy' choices={privacyChoices} />
    </Filter>
);

export default listCreate;
