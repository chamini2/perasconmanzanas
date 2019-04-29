import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import FormGroup from 'react-bootstrap/FormGroup';
import FormLabel from 'react-bootstrap/FormLabel';
import { toast } from 'react-toastify';
import { STRINGS } from '../constants';
import { errorPGMessage } from '../services/Request';
import { AxiosResponse } from 'axios';
import { withRouter, RouterProps } from 'react-router';
import AccountsService from '../services/AccountsService';
import isLoggedInGuard from '../wrappers/isLoggedInGuard';
import withAuthInfo, { AuthInfoProps } from '../wrappers/withAuthInfo';

interface State {
  id: string;
  name: string;
}

export class CreateAccount extends Component<RouterProps & AuthInfoProps, State> {

  constructor(props: any) {
    super(props);
    this.state = {
      id: '',
      name: ''
    };
  }

  validateForm() {
    return this.state.id.length > 0 && this.state.name.length > 0;
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
      await AccountsService.postAccount({ ...this.state, owner_id: this.props.auth.userId });
      toast('Cuenta creada', { type: 'info' });
      this.props.history.goBack();
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

  render() {
    return <div className='container'>
      <h3>Información de cuenta nueva</h3>

      <Form onSubmit={this.handleSubmit}>
        <FormGroup controlId='id'>
          <FormLabel>Identificador: usa un nombre corto, como un usuario</FormLabel>
          <FormControl
            value={this.state.id}
            onChange={this.handleChange('id')}
          />
        </FormGroup>
        <FormGroup controlId='name'>
          <FormLabel>Nombre: un nombre más descriptivo de tu cuenta</FormLabel>
          <FormControl
            value={this.state.name}
            onChange={this.handleChange('name')}
          />
        </FormGroup>

        <Button
          block
          disabled={!this.validateForm()}
          type='submit'
        >
          Crear cuenta
        </Button>

        <Button
          className='btn-secondary'
          block
          onClick={(event: React.MouseEvent) => {
            event.stopPropagation();
            this.props.history.goBack();
          }}
        >
          Cancelar
        </Button>
      </Form>
    </div>;
  }

}

export default withRouter(isLoggedInGuard(withAuthInfo(CreateAccount)));
