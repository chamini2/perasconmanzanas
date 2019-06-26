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
import ProductsService, { Product } from '../services/ProductsService';
import hasAccountGuard from '../wrappers/hasAccountGuard';
import MovementsService, { Movement } from '../services/MovementsService';
import Paths from '../Paths';

interface State {
  sku: Product['sku'];
  description: Product['description'];
  initial_stock: Movement['quantity'];
}

class CreateProduct extends Component<RouteComponentProps & AuthInfoProps, State> {

  constructor(props: any) {
    super(props);
    this.state = {
      sku: '',
      description: '',
      initial_stock: 0
    };
  }

  validateForm() {
    const {
      sku,
      description
    } = this.state;

    return sku.length > 0 && description.length > 0;
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
      sku,
      description,
      initial_stock
    } = this.state;

    try {
      await ProductsService.postProduct({ sku, description, account_id: this.props.auth.accountId });
      try {
        if (initial_stock != 0) {
          await MovementsService.postMovement({
            product_sku: sku,
            quantity: initial_stock,
            description: 'Inventario inicial',
            account_id: this.props.auth.accountId,
            user_id: this.props.auth.userId
          });
        }

        this.props.history.goBack();
      } catch (err) {
        this.props.history.push(Paths.CreateMovement(sku));
      } finally {
        toast('Producto creado', { type: 'info' });
      }

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
      sku,
      description,
      initial_stock
    } = this.state;

    return <div className='container'>
      <h3>Nuevo producto</h3>

      <Form onSubmit={this.handleSubmit}>
        <FormGroup controlId='sku'>
          <FormLabel>SKU: identificador del producto</FormLabel>
          {
            sku.indexOf(' ') === -1
              ? null
              : <span className='warning' style={{color: 'orange'}}> (Tienes un espacio en el SKU)</span>
          }
          <FormControl
            value={sku}
            onChange={this.handleChange('sku')}
          />
        </FormGroup>
        <FormGroup controlId='product_description'>
          <FormLabel>Descripción: una descripción del producto, se usará para búsquedas e identificarlo fácilmente</FormLabel>
          <FormControl
            value={description}
            onChange={this.handleChange('description')}
          />
        </FormGroup>
        <FormGroup controlId='stock'>
          <FormLabel>Inventario inicial</FormLabel>
          <FormControl
            type='number'
            value={initial_stock + ''}
            onChange={this.handleChange('initial_stock')}
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

export default withRouter(withAuthInfo(hasAccountGuard(isLoggedInGuard(CreateProduct))));
