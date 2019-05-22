import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import FormGroup from 'react-bootstrap/FormGroup';
import FormLabel from 'react-bootstrap/FormLabel';
import AuthService from '../services/Auth';
import UsersService, { User } from '../services/UsersService';
import { toast } from 'react-toastify';
import { AxiosResponse } from 'axios';
import { STRINGS, DATE_LOCALE } from '../constants';
import { errorPGMessage } from '../services/Request';
import formatd from 'date-fns/format';
import isEqual from 'lodash/isEqual';
import './Profile.scss';
import isLoggedInGuard from '../wrappers/isLoggedInGuard';
import { Link } from 'react-router-dom';

interface State {
  user?: User;
  edited?: User;
}

class Profile extends Component<any, State> {

  constructor(props: {}) {
    super(props);
    this.state = {};
  }

  async componentDidMount() {
    const userId = AuthService.getUser()!;
    const user = await UsersService.fetchUser(userId);
    this.setState({ user, edited: user });
  }

  editedForm() {
    return !isEqual(this.state.user, this.state.edited);
  }

  handleSubmit: Form['props']['onSubmit'] = async event => {
    event.preventDefault();

    try {
      const patched = await UsersService.patchUser(this.state.user!.id, this.state.edited!);
      this.setState({ user: patched, edited: patched });
      toast('Perfil guardado', { type: 'info' });
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

  handleChange(key: keyof User): FormControl['props']['onChange'] {
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
    if (!this.state.edited) {
      return null;
    }

    return <div className='Profile'>
      <Form onSubmit={this.handleSubmit}>
        <FormGroup controlId='name'>
          <FormLabel>Nombre</FormLabel>
          <FormControl
            value={this.state.edited.full_name}
            onChange={this.handleChange('full_name')}
          />
        </FormGroup>
        <FormGroup controlId='username'>
          <FormLabel>Usuario</FormLabel>
          <FormControl
            value={this.state.edited.username}
            onChange={this.handleChange('username')}
          />
        </FormGroup>
        <FormGroup controlId='email'>
          <FormLabel>Email</FormLabel>
          <FormControl
            type='email'
            value={this.state.edited.email}
            onChange={this.handleChange('email')}
          />
        </FormGroup>
        <FormGroup controlId='id' className='one-liner'>
          <FormLabel>ID</FormLabel>
          <FormControl
            value={this.state.edited.id.toString()}
            readOnly
            onChange={this.handleChange('id')}
          />
        </FormGroup>
        <FormGroup controlId='created_at' className='one-liner'>
          <FormLabel>
            Miembro desde
          </FormLabel>
          <FormControl
            readOnly
            value={formatd(new Date(this.state.edited.created_at), "dd 'de' MMMM 'del' yyyy", { locale: DATE_LOCALE })}
          />
        </FormGroup>
        <Button
          block
          disabled={!this.editedForm()}
          type='submit'
        >
          Guardar
        </Button>
      </Form>
    </div>;
  }

}

export default isLoggedInGuard(Profile);
