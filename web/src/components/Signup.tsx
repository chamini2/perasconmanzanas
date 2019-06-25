import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import FormGroup from 'react-bootstrap/FormGroup';
import FormLabel from 'react-bootstrap/FormLabel';
import AuthService from '../services/Auth';
import { AxiosResponse } from 'axios';
import { toast } from 'react-toastify';
import { STRINGS, MIN_PASSWORD_LENGTH } from '../constants';

interface State {
  email: string;
  username: string;
  full_name: string;
  password: string;
}

class Signup extends Component<any, State> {

  constructor(props: any) {
    super(props);

    this.state = {
      email: '',
      username: '',
      full_name: '',
      password: '',
    };
  }

  validateForm() {
    const {
      email,
      username,
      full_name,
      password
    } = this.state;

    return email.length > 0 &&
      username.length > 0 &&
      full_name.length > 0 &&
      password.length >= MIN_PASSWORD_LENGTH;
  }

  handleChange(key: keyof State): FormControl['props']['onChange'] {
    return event => {
      event.preventDefault();

      this.setState({
        [key]: (event as any).target.value
      } as State);
    };
  }

  handleSubmit: Form['props']['onSubmit'] = async event => {
    event.preventDefault();

    const {
      email,
      username,
      full_name,
      password
    } = this.state;

    try {
      await AuthService.signup(username, email, full_name, password);
      toast('¡Bienvenido!', { type: 'success' });
    } catch (err) {
      console.error(err);
      if (err.response) {
        const errResponse = err.response as AxiosResponse<string>;
        toast('Error en petición: ' + errResponse.data, { type: 'error' });
      } else {
        toast(STRINGS.UNKNOWN_ERROR, { type: 'error' });
      }
    }
  }

  render() {
    const {
      email,
      username,
      full_name,
      password
    } = this.state;

    return <div className='Signup'>
      <Form onSubmit={this.handleSubmit}>
        <FormGroup controlId='name'>
          <FormLabel>Nombre</FormLabel>
            <FormControl
              value={full_name}
              onChange={this.handleChange('full_name')}
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
        <FormGroup controlId='username'>
          <FormLabel>Usuario</FormLabel>
          <FormControl
            value={username}
            autoCorrect='off'
            autoCapitalize='none'
            onChange={this.handleChange('username')}
          />
        </FormGroup>
        <FormGroup controlId='password'>
          <FormLabel>Contraseña ({MIN_PASSWORD_LENGTH} caracteres o más)</FormLabel>
          <FormControl
            type='password'
            value={password}
            onChange={this.handleChange('password')}
          />
        </FormGroup>
        <Button
          block
          disabled={!this.validateForm()}
          type='submit'
        >
          Registrarse
        </Button>
      </Form>
    </div>;
  }

}

export default Signup;
