import React, { Component } from 'react';
import Form from 'react-bootstrap/Form';
import FormGroup from 'react-bootstrap/FormGroup';
import FormLabel from 'react-bootstrap/FormLabel';
import FormControl from 'react-bootstrap/FormControl';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import ProductsService, { Product } from '../services/ProductsService';
import MovementsService, { Movement } from '../services/MovementsService';
import { AxiosResponse } from 'axios';
import { toast } from 'react-toastify';
import { STRINGS } from '../constants';
import { errorPGMessage } from '../services/Request';
import withAuthInfo, { AuthInfoProps } from '../wrappers/withAuthInfo';

interface State {
  sku: Product['sku'];
  description: Product['description'];
  initial_stock: Movement['quantity'];
}

interface Props {
  product?: Partial<State>;
  onSubmit: (err?: Error) => void;
  isFormValid: (isValid: boolean) => void;
  readOnly?: boolean;
}

class ProductForm extends Component<AuthInfoProps & Props, State> {

  constructor(props: ProductForm['props']) {
    super(props);

    const product = props.product || {};

    this.state = {
      sku: product.sku || '',
      description: product.description || '',
      initial_stock: product.initial_stock || 0
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
      } as State, () => {
        this.props.isFormValid(this.validateForm());
      });
    };
  }

  async handleSubmit(event: React.FormEvent) {
    event.stopPropagation();
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

        this.props.onSubmit();
      } catch (err) {
        this.props.onSubmit(err);
      } finally {
        toast('Producto creado', { type: 'info' });
      }

    } catch (err) {
      this.props.onSubmit(err);
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

    const {
      readOnly
    } = this.props;

    return <div>
      <Form onSubmit={this.handleSubmit.bind(this)}>
        <OverlayTrigger
          overlay={
            <Tooltip style={{pointerEvents: 'none'}} id='tooltip-sku'>
              Código identificador del producto
            </Tooltip>
          }
          trigger={['hover', 'focus']}
        >
          <FormGroup controlId='sku'>
            <FormLabel>SKU ❓</FormLabel>
            {
              sku.indexOf(' ') === -1
                ? null
                : <span style={{color: 'orange'}}>⚠️ (Tienes un espacio en el SKU)</span>

            }
            <FormControl
              readOnly={readOnly}
              value={sku}
              onChange={this.handleChange('sku')}
            />
          </FormGroup>
        </OverlayTrigger>

        <OverlayTrigger
          overlay={
            <Tooltip style={{pointerEvents: 'none'}} id='tooltip-description'>
              Descripción del producto, se usará para búsquedas e identificarlo fácilmente
            </Tooltip>
          }
          trigger={['hover', 'focus']}
        >
          <FormGroup controlId='product_description'>
            <FormLabel>Descripción ❓</FormLabel>
            <FormControl
              readOnly={readOnly}
              value={description}
              onChange={this.handleChange('description')}
            />
          </FormGroup>
        </OverlayTrigger>

        <FormGroup controlId='stock'>
          <FormLabel>Inventario inicial</FormLabel>
          <FormControl
            readOnly={readOnly}
            type='number'
            value={initial_stock + ''}
            onChange={this.handleChange('initial_stock')}
          />
        </FormGroup>
        {this.props.children}
      </Form>
    </div>;
  }

}

export default withAuthInfo(ProductForm);
