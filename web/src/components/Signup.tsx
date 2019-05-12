import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import FormGroup from 'react-bootstrap/FormGroup';
import FormLabel from 'react-bootstrap/FormLabel';
import AuthService from '../services/Auth';
import { AxiosResponse } from 'axios';
import { toast } from 'react-toastify';
import { STRINGS } from '../constants';

interface State {
  email: string;
  username: string;
  full_name: string;
  password: string;
}

const MIN_PASSWORD_LENGTH = 6;

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
    return this.state.email.length > 0 &&
      this.state.username.length > 0 &&
      this.state.full_name.length > 0 &&
      this.state.password.length >= MIN_PASSWORD_LENGTH;
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

    try {
      await AuthService.signup(this.state.username, this.state.email, this.state.full_name, this.state.password);
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
    return <div className='Signup'>
      <Form onSubmit={this.handleSubmit}>
        <FormGroup controlId='name'>
          <FormLabel>Nombre</FormLabel>
            <FormControl
              value={this.state.full_name}
              onChange={this.handleChange('full_name')}
            />
        </FormGroup>
        <FormGroup controlId='email'>
          <FormLabel>Email</FormLabel>
          <FormControl
            type='email'
            value={this.state.email}
            onChange={this.handleChange('email')}
          />
        </FormGroup>
        <FormGroup controlId='username'>
          <FormLabel>Usuario</FormLabel>
          <FormControl
            value={this.state.username}
            onChange={this.handleChange('username')}
          />
        </FormGroup>
        <FormGroup controlId='password'>
          <FormLabel>Contraseña ({MIN_PASSWORD_LENGTH} caracteres o más)</FormLabel>
          <FormControl
            type='password'
            value={this.state.password}
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
