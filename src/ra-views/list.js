// created 22-apr-2019 by rich braun <docker@instantlinux.net>

import React from 'react';
import { AutocompleteInput, AutocompleteArrayInput, ChipField, Create,
         Datagrid, Edit, EditButton, Filter, FunctionField, List, ReferenceArrayField,
         ReferenceArrayInput, ReferenceField, ReferenceInput,
         ReferenceManyField, RichTextField, SelectInput, Show,
         ShowController, ShowView, SimpleForm, SingleFieldList, Tab,
         TabbedShowLayout, TextField, TextInput } from 'react-admin';
import Button from '@material-ui/core/Button';
import RichTextInput from 'ra-input-rich-text';
import Moment from 'react-moment';
import { Link } from 'react-router-dom';
import { parse } from 'query-string';

import { privacyChoices, toolbarOpts } from '../lib/constants';
import { MenuTitle, TopbarNoActions } from '../lib/ra-custom';
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
              defaultValue='invitee' />
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
            <RichTextInput source='description' label='Description'
                toolbar={toolbarOpts} />
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

export const ListShowTabs = ({record, ...props}) => (
    <Show {...props} title={<MenuTitle />} actions={<TopbarNoActions />}>
      <TabbedShowLayout>
        <Tab label='discussion'>
            <ReferenceManyField reference='message' target='list_id'
                    addLabel={false} fullWidth perPage={20}
                    sort={{ field: 'created', order: 'DESC'}} >
                <Datagrid rowClick='show' expand={<MessageDisplay />} >
                    <ReferenceField source='sender_id' reference='person'
                            sortBy='created' link='show' >
                        <TextField source='name' />
                    </ReferenceField>
                    <TextField source='subject' />
                    <FunctionField source='created' render={record =>
                        <Moment fromNow>{record.created}</Moment>} />}
                </Datagrid>
            </ReferenceManyField>
            {record.rbac && record.rbac.includes('i') &&
                 <CreateMessageButton />}
        </Tab>
        <Tab label='members'>
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
            <EditButton />
        </Tab>
      </TabbedShowLayout>
    </Show>
);

export const listShow = props => {
    return <ShowController {...props}>
	{controllerProps =>
	 <ShowView actions={null} title=' ' {...props} {...controllerProps}>
	     <ListShowTabs {...props} />
	 </ShowView>}
    </ShowController>
};

const CreateMessageButton = ({ record }) => {
    return <Button component={Link} variant='contained'
	to={{
	    pathname: '/message/create',
	    state: { record: { list_id: record.id } },
	}}>
	Post
    </Button>
};

const MessageDisplay = ({ id, record, resource }) => (
    <div dangerouslySetInnerHTML={{ __html: record.content }} />
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
