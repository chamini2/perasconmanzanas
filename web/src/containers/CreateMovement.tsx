import './CreateMovement.scss';
import React, { Component } from 'react';
import isLoggedInGuard from '../wrappers/isLoggedInGuard';
import withAuthInfo, { AuthInfoProps } from '../wrappers/withAuthInfo';
import ProductsService, { Product, ProductView } from '../services/ProductsService';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import FormGroup from 'react-bootstrap/FormGroup';
import FormLabel from 'react-bootstrap/FormLabel';
import { errorPGMessage } from '../services/Request';
import { AxiosResponse } from 'axios';
import { RouteComponentProps } from 'react-router';
import { toast } from 'react-toastify';
import { STRINGS } from '../constants';
import Button from 'react-bootstrap/Button';
import Select from 'react-select';
import { ValueType } from 'react-select/lib/types';
import isUndefined from 'lodash/isUndefined';
import MovementsService from '../services/MovementsService';
import hasAccountGuard from '../wrappers/hasAccountGuard';
import Paths from '../Paths';
import querystring from 'query-string';

interface State {
  product_sku: Product['sku'] | undefined;
  default_sku?: Product['sku'];
  products?: ProductView[];
  product?: ProductView;
  quantity: number;
  positive: boolean;
  description: string;
  options?: {
    value: string;
    label: string;
  }[];
}

class CreateMovement extends Component<AuthInfoProps & RouteComponentProps, State> {

  constructor(props: any) {
    super(props);

    const queryParams = querystring.parse(this.props.location.search);
    this.state = {
      quantity: 1,
      positive: false,
      description: '',
      product_sku: undefined,
      default_sku: queryParams.sku && typeof queryParams.sku === 'string' ? queryParams.sku : undefined
    };
  }

  async componentDidMount() {
    const products = await ProductsService.fetchAllProducts();
    const options = products.map(product => ({ value: product.sku, label: `${product.description} - ${product.sku}` }))

    this.setState({ products, options });
  }

  componentDidUpdate(_prevProps: CreateMovement['props'], prevState: State) {
    const {
      product_sku,
      products
    } = this.state;
    if (products && prevState.product_sku !== product_sku && !isUndefined(product_sku)) {
      const product = products.find(prod => prod.sku === product_sku);
      if (product) {
        this.setState({ product });
      }
    }
  }

  validateForm() {
    const {
      product_sku,
      quantity,
      description
    } = this.state;

    return !!product_sku && quantity > 0 && description.length > 0;
  }

  handleSelectChange(key: keyof State, defaultValue: string): Select['props']['onChange'] {
    return (event: ValueType<{ label: string, value: string }>) => {
      if (!event) {
        this.setState({
          [key]: defaultValue
        } as unknown as State);

        return;
      }

      this.setState({
        [key]: (event as { label: string, value: string }).value
      } as unknown as State);
    };
  }

  handleInput(key: keyof State, value: any): FormControl['props']['onInput'] {
    return event => {
      event.preventDefault();

      this.setState({
        [key]: value === undefined ? (event as any).target.value : value
      } as State);
    };
  }

  handleChange(key: keyof State, value?: any): FormControl['props']['onChange'] {
    return event => {
      event.preventDefault();

      this.setState({
        [key]: value === undefined ? (event as any).target.value : value
      } as State);
    };
  }

  handleSubmit: Form['props']['onSubmit'] = async event => {
    event.preventDefault();

    const {
      product_sku,
      quantity,
      description,
      positive
    } = this.state;

    try {
      await MovementsService.postMovement({
        product_sku,
        quantity: quantity * (positive ? 1 : -1),
        description,
        account_id: this.props.auth.accountId,
        user_id: this.props.auth.userId
      });
      toast('Movimiento agregado', { type: 'info' });
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
    const {
      default_sku,
      product,
      quantity,
      description,
      positive,
      options
    } = this.state;

    if (options && options.length == 0) {
      return <div className='CreateMovement container'>
        <h3>Nuevo movimiento</h3>

        <div>Antes de crear un movimiento debes crear un producto a asociar.</div>

        <Button href={Paths.CreateProduct()}>Nuevo producto</Button>
        <Button
          variant='secondary'
          block
          onClick={(event: React.MouseEvent) => {
            event.stopPropagation();
            console.log(this.props.history.length);
            this.props.history.goBack();
          }}
        >
          Cancelar
        </Button>
      </div>;
    }

    return <div className='CreateMovement container'>
      <h3>Nuevo movimiento</h3>

      <Form onSubmit={this.handleSubmit}>
        <FormGroup controlId='sku'>
          <FormLabel>Producto</FormLabel>
          <Select
            options={options}
            autoFocus
            defaultInputValue={default_sku}
            defaultMenuIsOpen
            isLoading={isUndefined(options)}
            isSearchable
            onChange={this.handleSelectChange('product_sku', '')}
          />
        </FormGroup>

        <FormGroup id='positive'>
          <div>
            <FormControl
              onInput={this.handleInput('positive', false)}
              id='positive_false'
              type='radio'
              name='positive'
              defaultChecked={!positive}
            />
            <FormLabel htmlFor='positive_false'>Salida</FormLabel>
          </div>

          <div>
            <FormControl
              onInput={this.handleInput('positive', true)}
              id='positive_true'
              type='radio'
              name='positive'
              defaultChecked={positive}
            />
            <FormLabel htmlFor='positive_true'>Entrada</FormLabel>
          </div>
        </FormGroup>

        <FormGroup controlId='quantity'>
          <FormLabel>Cantidad: Mayor o igual a 1 {product ? `(hay ${product.stock})` : null}</FormLabel>
          <FormControl
            value={quantity + ''}
            onChange={this.handleChange('quantity')}
            type='number'
            min={1}
          />
        </FormGroup>

        <FormGroup controlId='movement_description'>
          <FormLabel>Descripción: una descripción del movimiento (e.g. Compra de Luis Pérez lp@email.com)</FormLabel>
          <FormControl
            value={description}
            onChange={this.handleChange('description')}
          />
        </FormGroup>

        <Button
          block
          disabled={!this.validateForm()}
          type='submit'
        >
          Crear movimiento
        </Button>

        <Button
          variant='secondary'
          block
          onClick={(event: React.MouseEvent) => {
            event.stopPropagation();
            console.log(this.props.history.length);
            this.props.history.goBack();
          }}
        >
          Cancelar
        </Button>
      </Form>
    </div>;
  }

}

export default hasAccountGuard(withAuthInfo(isLoggedInGuard(CreateMovement)));
