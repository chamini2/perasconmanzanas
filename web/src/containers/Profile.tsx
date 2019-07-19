import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import FormGroup from 'react-bootstrap/FormGroup';
import FormLabel from 'react-bootstrap/FormLabel';
import UsersService, { User } from '../services/UsersService';
import { toast } from 'react-toastify';
import { AxiosResponse } from 'axios';
import { STRINGS } from '../constants';
import { errorPGMessage } from '../services/Request';
import isEqual from 'lodash/isEqual';
import isLoggedInGuard from '../wrappers/isLoggedInGuard';
import { timestampDateFormat } from '../helpers';
import withAuthInfo, { AuthInfoProps } from '../wrappers/withAuthInfo';

interface State {
  email: User['email'];
  username: User['username'];
  full_name: User['full_name'];
  user?: User;
}

class Profile extends Component<AuthInfoProps, State> {

  constructor(props: any) {
    super(props);
    this.state = {
      email: '',
      username: '',
      full_name: ''
    };
  }

  async componentDidMount() {
    const user = this.props.auth.user!;

    this.setState({
      user,
      email: user.email,
      username: user.username,
      full_name: user.full_name
    });
  }

  validateForm() {
    const {
      user,
      email,
      username,
      full_name
    } = this.state;

    return !isEqual(user!.email, email) ||
      !isEqual(user!.username, username) ||
      !isEqual(user!.full_name, full_name);
  }

  handleSubmit: Form['props']['onSubmit'] = async event => {
    event.preventDefault();

    const {
      user,
      email,
      username,
      full_name
    } = this.state;

    try {
      const patched = await UsersService.patchUser(user!.id, { email, username, full_name });
      this.setState({
        user: patched,
        email: patched.email,
        username: patched.username,
        full_name: patched.full_name
      });
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

  handleChange(key: keyof State): FormControl['props']['onChange'] {
    return event => {
      event.preventDefault();

      this.setState({
        [key]: (event as any).target.value
      } as State);
    };
  }


  render() {
    const {
      user,
      email,
      username,
      full_name
    } = this.state;

    if (!user) {
      return null;
    }

    return <div className='Profile'>
      <Form onSubmit={this.handleSubmit}>
        <FormGroup controlId='name'>
          <FormLabel>Nombre</FormLabel>
          <FormControl
            value={full_name}
            onChange={this.handleChange('full_name')}
          />
        </FormGroup>
        <FormGroup controlId='username'>
          <FormLabel>Usuario</FormLabel>
          <FormControl
            value={username}
            onChange={this.handleChange('username')}
          />
        </FormGroup>
        <FormGroup controlId='email'>
          <FormLabel>Email</FormLabel>
          <FormControl
            type='email'
            value={email}
            onChange={this.handleChange('email')}
          />
        </FormGroup>
        <FormGroup hidden controlId='id'>
          <FormLabel>ID</FormLabel>
          <FormControl
            value={user.id.toString()}
            readOnly
          />
        </FormGroup>
        <FormGroup controlId='created_at'>
          <FormLabel>Miembro desde</FormLabel>
          <FormControl
            readOnly
            value={timestampDateFormat(user.created_at)}
          />
        </FormGroup>
        <Button
          block
          disabled={!this.validateForm()}
          type='submit'
        >
          Guardar
        </Button>
      </Form>
    </div>;
  }

}

export default withAuthInfo<{}>(isLoggedInGuard(Profile));
