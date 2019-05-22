import React, { Component } from 'react';
import isLoggedInGuard from '../wrappers/isLoggedInGuard';
import withAuthInfo, { AuthInfoProps } from '../wrappers/withAuthInfo';
import Form from 'react-bootstrap/Form';
import FormGroup from 'react-bootstrap/FormGroup';
import FormLabel from 'react-bootstrap/FormLabel';
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { toast } from 'react-toastify';
import { errorPGMessage } from '../services/Request';
import { STRINGS } from '../constants';
import { AxiosResponse } from 'axios';
import ProductsService from '../services/ProductsService';

interface State {
  sku: string;
  description: string;
}

class CreateProduct extends Component<RouteComponentProps & AuthInfoProps, State> {

  constructor(props: any) {
    super(props);
    this.state = {
      sku: '',
      description: ''
    };
  }

  validateForm() {
    return this.state.sku.length > 0 && this.state.description.length > 0;
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
      await ProductsService.postProduct({ ...this.state, account_id: this.props.auth.accountId });
      toast('Producto creado', { type: 'info' });
      this.props.history.push('/products');
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
      <h3>Nuevo producto</h3>

      <Form onSubmit={this.handleSubmit}>
        <FormGroup controlId='sku'>
          <FormLabel>SKU: identificador del producto</FormLabel>
          <FormControl
            value={this.state.sku}
            onChange={this.handleChange('sku')}
          />
        </FormGroup>
        <FormGroup controlId='product_description'>
          <FormLabel>Descripción: una descripción del producto, se usará para búsquedas e identificarlo fácilmente</FormLabel>
          <FormControl
            value={this.state.description}
            onChange={this.handleChange('description')}
          />
        </FormGroup>

        <Button
          block
          disabled={!this.validateForm()}
          type='submit'
        >
          Crear producto
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

export default withRouter(withAuthInfo(isLoggedInGuard(CreateProduct)));
