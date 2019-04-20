import './Login.css';
import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import FormGroup from 'react-bootstrap/FormGroup';
import FormLabel from 'react-bootstrap/FormLabel';
import Auth from '../services/Auth';
import { AxiosResponse } from 'axios';
import { Redirect } from 'react-router-dom';
import { toast } from 'react-toastify';

interface State {
  identifier: string;
  password: string;
  redirect: boolean;
}

export default class Login extends Component<any, State> {

  constructor(props: any) {
    super(props);

    this.state = {
      identifier: '',
      password: '',
      redirect: Auth.isLoggedIn(),
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
      await Auth.login(this.state.identifier, this.state.password);
      this.setState({ redirect: true });
    } catch (err) {
      if (err.response) {
        const errResponse = err.response as AxiosResponse<string>;
        toast('Request error: ' + errResponse.data, { type: 'error' });
      } else {
        console.error(err);
        toast('Unknown error, let the developers know', { type: 'error' });
      }
    }
  }

  render() {
    if (this.state.redirect) {
      return <Redirect to='/' />;
    }

    return (
      <div className='Login'>
        <form onSubmit={this.handleSubmit}>
          <FormGroup controlId='identifier'>
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
        </form>
      </div>
    );
  }
}
