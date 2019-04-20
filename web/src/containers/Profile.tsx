import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import FormGroup from 'react-bootstrap/FormGroup';
import FormLabel from 'react-bootstrap/FormLabel';
import AccountSelector from './AccountSelector';
import Header, { headerContainerStyle, headerSiblingStyle } from '../components/Header';
import Auth from '../services/Auth';
import { Redirect } from 'react-router';
import UsersService, { User } from '../services/UsersService';
import { toast } from 'react-toastify';
import { AxiosResponse } from 'axios';
import { STRINGS, DATE_LOCALE } from '../constants';
import { errorPGMessage } from '../services/Request';
import formatd from 'date-fns/format';
import isEqual from 'lodash/isEqual';
import './Profile.scss';

interface State {
  user?: User;
  edited?: User;
}

export default class Profile extends Component<any, State> {

  constructor(props: {}) {
    super(props);
    this.state = {};
  }

  async componentDidMount() {
    const userId = Auth.getUser()!;
    const user = await UsersService.fetchUser(userId);
    this.setState({ user, edited: user });
  }

  editedUserForm() {
    return !isEqual(this.state.user, this.state.edited);
  }

  handleUserSubmit: Form['props']['onSubmit'] = async event => {
    event.preventDefault();

    try {
      const patched = await UsersService.patchUser(this.state.user!.id, this.state.edited!);
      console.log(patched);
      this.setState({ user: patched, edited: patched });
      toast('Profile updated', { type: 'info' });
    } catch (err) {
      console.error(err);
      if (err.response) {
        const errResponse = err.response as AxiosResponse<string>;
        toast('Error en petición: ' + errorPGMessage(errResponse), { type: 'error' });
      } else {
        toast(STRINGS.UNKNOWN_ERROR, { type: 'error' });
      }
    }
  }

  handleUserChange(key: keyof User): FormControl['props']['onChange'] {
    return event => {
      event.preventDefault();

      this.setState({
        edited: {
          ...this.state.edited,
          [key]: (event as any).target.value
        } as State['edited']
      });
    };
  }


  render() {
    if (!Auth.isLoggedIn()) {
      return <Redirect to="/" />;
    }

    if (!this.state.edited) {
      return null;
    }

    return <div style={headerContainerStyle} className="Profile container">
      <Header />
      <div style={headerSiblingStyle} className="grid">
        <div className="user">
          <Form onSubmit={this.handleUserSubmit}>
            <FormGroup controlId='username'>
              <FormLabel>Usuario</FormLabel>
              <FormControl
                value={this.state.edited.username}
                onChange={this.handleUserChange('username')}
              />
            </FormGroup>
            <FormGroup controlId='email'>
              <FormLabel>Email</FormLabel>
              <FormControl
                type='email'
                value={this.state.edited.email}
                onChange={this.handleUserChange('email')}
              />
            </FormGroup>
            <FormGroup controlId='full_name'>
              <FormLabel>Nombre</FormLabel>
              <FormControl
                value={this.state.edited.full_name}
                onChange={this.handleUserChange('full_name')}
              />
            </FormGroup>
            <FormGroup controlId='id'>
              <FormLabel>ID</FormLabel>
              <FormControl
                value={this.state.edited.id.toString()}
                readOnly
                onChange={this.handleUserChange('id')}
              />
            </FormGroup>
            <FormGroup controlId='created_at'>
              <FormLabel>Miembro desde</FormLabel>
              <FormControl
                readOnly
                value={formatd(new Date(this.state.edited.created_at), "dd 'de' MMMM 'del' yyyy", { locale: DATE_LOCALE })}
              />
            </FormGroup>
            <Button
              block
              disabled={!this.editedUserForm()}
              type='submit'
            >
              Guardar cambios
            </Button>
          </Form>
        </div>
        <div className="selector">
          <AccountSelector />
        </div>
      </div>
    </div>;
  }

}
