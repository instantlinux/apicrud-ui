// created 22-apr-2019 by rich braun <docker@instantlinux.net>

import React from 'react';
import { ChipField, Create, Datagrid, DateField, Edit, FormTab, FunctionField,
         List, RadioButtonGroupInput, ReferenceField,  RichTextField, Show,
         SimpleShowLayout, TabbedForm, TextField,
         TextInput } from 'react-admin';
// import { Link } from 'react-router-dom';
// import Button from '@material-ui/core/Button';
import RichTextInput from 'ra-input-rich-text';
import moment from 'moment';

import { privacyChoices, toolbarOpts } from '../lib/constants';
import { MenuTitle, TopbarActions } from '../lib/ra-custom';
import { validateRequired128String,
         validateRequired4096String } from '../lib/validate';

function redirect(props) {
    const { list_id } = (typeof props.location.state !== 'undefined' 
                          && props.location.state.record);
    console.log('redirect list_id=' + list_id);
    return list_id ? `/list/${list_id}/show` : 'show';
}

export const messageCreate = ({permissions, ...props}) => (
    // TODO figure out how to create / display album
    <Create {...props}>
      <TabbedForm redirect={redirect(props)} >
        <FormTab label='Message'>
          <TextInput source='subject'
              validate={validateRequired128String} />
          <RichTextInput source='content' toolbar={toolbarOpts}
              validate={validateRequired4096String} />
          <TextInput disabled source='privacy' defaultValue='invitee' />
        </FormTab>
      {/*
        <FormTab label='Pictures'>
            <ReferenceManyField reference='album' target='uid' 
                    filter={{list_id: null, list_id: null}} addLabel={false}>
                <Datagrid  rowClick='edit'>
                    <TextField source='name' label='Album' />
                    <ChipField source='privacy' />
                    <DateField source='created' />
                </Datagrid>
            </ReferenceManyField>
            <CreateAlbumButton />
        </FormTab>
       */}
      </TabbedForm>
    </Create>
);

export const messageEdit = props => (
    <Edit {...props}>
      <TabbedForm redirect={redirect(props)} >
        <FormTab label='Message'>
          <TextInput source='subject'
              validate={validateRequired128String} />
          <RichTextInput source='content' toolbar={toolbarOpts}
              validate={validateRequired4096String} />
          <RadioButtonGroupInput source='privacy' choices={privacyChoices} />
        </FormTab>
      {/*
        <FormTab label='Pictures'>
        </FormTab>
       */}
      </TabbedForm>
    </Edit>
);

export const messageList = props => (
    <List {...props} exporter={false}>
      <Datagrid rowClick='show' expand={<MessageView />} >
        <ReferenceField label='Sender' source='sender_id' reference='person'>
          <TextField source='name' />
        </ReferenceField>
        <TextField source='subject' />
        <DateField source='created' label='Date' showTime />
        <ChipField source='privacy' />
      </Datagrid>
    </List>
);

export const messageShow = props => (
    <Show {...props} title={<MenuTitle />} actions={<TopbarActions />}>
      <SimpleShowLayout>
        <ReferenceField label='Sender' source='sender_id' reference='person'>
          <ChipField source='name' />
        </ReferenceField>
        <FunctionField label='Header' render={record =>
          `${record.subject} - ${moment(record.created).fromNow()}`} />
        <RichTextField source='content' />
      </SimpleShowLayout>
    </Show>
);

const MessageView =  ({ id, record, resource }) => (
    <div dangerouslySetInnerHTML={{ __html: record.content }} />
);

// const CreateAlbumButton = ({ ...props }) => {
//     const uid = sessionStorage.getItem('uid')
//     const album = (Math.random() + 1).toString(36).substring(2, 10)
//     return <Button component={Link} variant='contained'
//         to={{
//             pathname: '/album/create',
//             state: { record: { uid: uid, name: `msg-${album}` } },
//         }}>
//         Add
//     </Button>
// }

export default messageCreate;
