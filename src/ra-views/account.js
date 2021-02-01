// created 5-apr-2019 by rich braun <docker@instantlinux.net>

import React from 'react';
import { AutocompleteInput, BooleanInput, ChipField, Create, Datagrid,
         DateField, Edit, FormTab, Link, List, ReferenceField,
         ReferenceManyField, SaveButton, Show, SimpleForm, TabbedForm,
         TextField, TextInput, Toolbar } from 'react-admin';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import { parse } from 'query-string';

import { MenuTitle } from '../lib/ra-custom';
import { validateEmail, validateName, validatePasswordOK,
         validateUsername } from '../lib/validate';

export const accountCreate = props => {
    const { forgot } = parse(props.location.search);
    const forgotbool = forgot === 'true';
    return (
    <Grid container direction={'column'} spacing={2}>
        {!forgotbool && <Grid item xl={6} md={6} sm={12} xs={12}>
        <Card>
          <CardContent>
          Follow these steps to invite guests to your event:<ul>
          <li>Create a username</li>
          <li>Confirm your email</li>
          <li>Create a password</li>
          <li>Add your location</li>
          <li>Fill out the event form</li>
          </ul>
          You can also return here if you ever forget your password.
          </CardContent>
        </Card>
      </Grid>}
      <Grid item xl={6} md={6} sm={12} xs={12}>
        <Create {...props} title='Account Registration' >
            <SimpleForm redirect='/confirmwait' toolbar={<RegisterToolbar />} >
            <RegisterForm forgot={forgotbool} />
          </SimpleForm>
        </Create>
      </Grid>
    </Grid>
)}

// TODO verify_password
// (value) => value === watch('new_password')
export const accountSecurity = ({permissions, ...props}) => {
  const uid = sessionStorage.getItem('uid')
  // console.log('auth=' + sessionStorage.getItem('auth'))
  return (
    <Edit {...props} title={<MenuUpdateTitle />} >
      <TabbedForm redirect='/welcome?buttons=login'>
        <FormTab label='password'>
            {permissions && (String(permissions).match(/user|pwchange/)) &&
             <TextInput source='old_password' type='password' />}
            <TextInput source='new_password' type='password'
                validate={validatePasswordOK} />
            <TextInput source='verify_password' type='password'
                validate={validatePasswordOK} />
            {(permissions && !String(permissions).match(/user|pwchange/)) &&
             <TextInput disabled source='reset_token' 
                defaultValue={sessionStorage.getItem('reset_token')} />}
        </FormTab>
        {permissions && String(permissions).match(/user/) &&
        <FormTab label='API keys' toolbar={null}>
          <ReferenceManyField reference='apikey' target='uid'
                              addLabel={false}>
              <Datagrid rowClick='edit'>
                  <TextField source='name' />
                  <TextField source='prefix' />
                  <DateField source='expires' />
                  <ChipField source='status' />
              </Datagrid>
          </ReferenceManyField>
          <CreateAPIkeyButton uid={uid} />
        </FormTab>}
      </TabbedForm>
    </Edit>
  );
};

export const accountShow = props => (
    <Show {...props} title={<MenuTitle />}>
        <SimpleForm>
            <ReferenceField label='Person' source='uid' reference='person'>
               <TextField source='name' />
            </ReferenceField>
            <TextField source='name' label='Username'/>
            <TextField source='reminders' />
            <DateField source='last_login' showTime />
        </SimpleForm>
    </Show>
);

// TODO the grants tab doesn't work yet
export const accountEdit = props => (
    <Edit {...props} title={<MenuTitle />}>
      <TabbedForm>
        <FormTab label='account'>
            <TextInput source='name' label='Username'
                     validate={validateUsername} />
            <ReferenceField source='uid' reference='person'
                     label='Personal details and contact info' >
               <TextField source='name' />
            </ReferenceField>
            <BooleanInput source='password_must_change' />
            <AutocompleteInput source='reminders' choices={[
                { id: 'always', name: 'always' },
                { id: 'more', name: 'more' },
                { id: 'fewer', name: 'fewer' },
                { id: 'never', name: 'never' },
            ]} />
            <AutocompleteInput source='status' choices={[
                { id: 'active', name: 'active' },
                { id: 'disabled', name: 'disabled' },
            ]} />
        </FormTab>
        <FormTab label='Grants'>
            <ReferenceManyField reference='grant' target='uid'
                    filter={{uid: 'x-23450001'}} addLabel={false}>
                <Datagrid rowClick='edit'>
                    <TextField source='name' />
                    <TextField source='value' />
                </Datagrid>
            </ReferenceManyField>
        </FormTab>
      </TabbedForm>
    </Edit>
);

export const accountList = props => (
    <List {...props}>
        <Datagrid rowClick='show'>
            <TextField source='name' />
            <ReferenceField source='uid' label='User' reference='person'>
               <TextField source='name' />
            </ReferenceField>
            <DateField source='last_login' showTime />
            <ChipField source='status' />
        </Datagrid>
    </List>
);

const MenuUpdateTitle = ({ record }) => {
    return <span>Password Update - {record.username}</span>
};

class RegisterForm extends React.Component {
  constructor(props, context) { 
     super(props, context);
     this.state = { forgot: props.forgot };
  };
  render() {
    return (<div>
      <BooleanInput source='forgot_password' onChange={
        (e) => this.setState(prevState => ({forgot: !prevState.forgot}))}
        defaultValue={this.state.forgot} />
      <TextInput source='identity' label='Email Address' fullWidth
        validate={validateEmail} /><br />
      {this.state.forgot ||
      <TextInput source='name' label='Your Full Name' fullWidth
        validate={validateName} />}<br />
      {this.state.forgot ||
      <TextInput source='username' label='Unique Username' fullWidth
        validate={validateUsername} />}
    </div>);
  }
}

const RegisterToolbar = props => <Toolbar {...props} >
      <SaveButton label="submit" submitOnEnter={true} />
</Toolbar>

// TODO this function (almost verbatim from the CreateEdit reference)
//   throws warning about forwardRef:
// Failed prop type: Invalid prop `component` supplied to
// `ForwardRef(ButtonBase)`. Expected an element type that can hold a ref.
const CreateAPIkeyButton = ({ uid }) => (
    <Button component={Link} variant='contained'
        to={{
            pathname: '/apikey/create',
            state: { record: { uid: uid } },
        }}>
        Add
    </Button>
);

export default accountCreate;
