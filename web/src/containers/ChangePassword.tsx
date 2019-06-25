import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import FormGroup from 'react-bootstrap/FormGroup';
import FormLabel from 'react-bootstrap/FormLabel';
import AuthService from '../services/Auth';
import { toast } from 'react-toastify';
import { AxiosResponse } from 'axios';
import { STRINGS, MIN_PASSWORD_LENGTH } from '../constants';
import { errorPGMessage } from '../services/Request';
import isEqual from 'lodash/isEqual';
import isLoggedInGuard from '../wrappers/isLoggedInGuard';
import { timestampDateFormat } from '../helpers';

interface State {
  old_password: string;
  new_password: string;
}

class ChangePassword extends Component<{}, State> {

  constructor(props: any) {
    super(props);
    this.state = {
      old_password: '',
      new_password: '',
    };
  }

  validateForm() {
    const {
      old_password,
      new_password
    } = this.state;

    return old_password.length > 0 && new_password.length >= MIN_PASSWORD_LENGTH;
  }

  handleSubmit: Form['props']['onSubmit'] = async event => {
    event.preventDefault();

    const {
      new_password,
      old_password,
    } = this.state;

    try {
      await AuthService.changePassword(old_password, new_password);

      this.setState({
        new_password: '',
        old_password: ''
      });

      toast('Contraseña cambiada', { type: 'info' });
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
      new_password,
      old_password,
    } = this.state;

    return <div className='ChangePassword'>
      <Form onSubmit={this.handleSubmit}>
        <FormGroup>
          <FormLabel>Anterior</FormLabel>
          <FormControl
            type='password'
            value={old_password}
            onChange={this.handleChange('old_password')}
          />
        </FormGroup>
        <FormGroup>
          <FormLabel>Nueva ({MIN_PASSWORD_LENGTH} caracteres o más)</FormLabel>
          <FormControl
            type='password'
            value={new_password}
            onChange={this.handleChange('new_password')}
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

export default isLoggedInGuard(ChangePassword);
