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
import { withRouter, RouteComponentProps } from 'react-router';
import AccountsService from '../services/AccountsService';
import isLoggedInGuard from '../wrappers/isLoggedInGuard';
import withAuthInfo, { AuthInfoProps } from '../wrappers/withAuthInfo';
import AuthService from '../services/Auth';

interface State {
  id: string;
  name: string;
}

class CreateAccount extends Component<AuthInfoProps & RouteComponentProps, State> {

  constructor(props: any) {
    super(props);
    this.state = {
      id: '',
      name: ''
    };
  }

  validateForm() {
    const {
      id,
      name
    } = this.state;

    return id.length > 0 && name.length > 0;
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
      id,
      name
    } = this.state;

    try {
      const account = await AccountsService.postAccount({ id, name, owner_id: this.props.auth.userId });
      toast('Proyecto creado', { type: 'info' });
      await AuthService.setAccount(account.id);
      this.props.history.replace('/');
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
    const {
      id,
      name
    } = this.state;

    return <div className='container'>
      <h3>Nuevo proyecto</h3>

      <Form onSubmit={this.handleSubmit}>
        <FormGroup controlId='id'>
          <FormLabel>Identificador: usa un nombre corto, como un usuario</FormLabel>
          <FormControl
            value={id}
            onChange={this.handleChange('id')}
          />
        </FormGroup>
        <FormGroup controlId='name'>
          <FormLabel>Nombre: un nombre más descriptivo de tu proyecto</FormLabel>
          <FormControl
            value={name}
            onChange={this.handleChange('name')}
          />
        </FormGroup>

        <Button
          block
          disabled={!this.validateForm()}
          type='submit'
        >
          Crear proyecto
        </Button>

        <Button
          variant='secondary'
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

export default withRouter(withAuthInfo(isLoggedInGuard(CreateAccount)));
