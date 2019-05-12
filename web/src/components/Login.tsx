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
  identifier: string;
  password: string;
}

class Login extends Component<any, State> {

  constructor(props: any) {
    super(props);

    this.state = {
      identifier: '',
      password: '',
    };
  }

  validateForm() {
    return this.state.identifier.length > 0 && this.state.password.length > 0;
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
      await AuthService.login(this.state.identifier, this.state.password);
      toast('Bienvenido!', { type: 'success' });
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
    return <div className='Login'>
      <Form onSubmit={this.handleSubmit}>
        <FormGroup controlId='email'>
          <FormLabel>Email o Usuario</FormLabel>
          <FormControl
            autoFocus
            value={this.state.identifier}
            onChange={this.handleChange('identifier')}
          />
        </FormGroup>
        <FormGroup controlId='password'>
          <FormLabel>Contraseña</FormLabel>
          <FormControl
            value={this.state.password}
            onChange={this.handleChange('password')}
            type='password'
          />
        </FormGroup>
        <Button
          block
          disabled={!this.validateForm()}
          type='submit'
        >
          Iniciar sesión
        </Button>
      </Form>
    </div>;
  }
}

export default Login;
