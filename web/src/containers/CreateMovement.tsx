import './CreateMovement.scss';
import React, { Component } from 'react';
import isLoggedInGuard from '../wrappers/isLoggedInGuard';
import withAuthInfo, { AuthInfoProps } from '../wrappers/withAuthInfo';
import ProductsService, { Product } from '../services/ProductsService';
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
import { Link } from 'react-router-dom';
import Paths from '../Paths';
import querystring from 'query-string';

interface State {
  product_sku: Product['sku'] | undefined;
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
    this.state = {
      product_sku: undefined,
      quantity: 1,
      positive: false,
      description: ''
    };
  }

  async componentDidMount() {
    const products = await ProductsService.fetchAllProducts();
    const options = products.map(product => ({ value: product.sku, label: `${product.description} - ${product.sku}` }))
    this.setState({ options });
  }

  validateForm() {
    const {
      product_sku,
      quantity,
      description
    } = this.state;

    console.log(this.state);

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
      quantity,
      description,
      positive,
      options
    } = this.state;

    if (options && options.length == 0) {
      return <div className='CreateMovement container'>
        <h3>Nuevo movimiento</h3>

        <div>Antes de crear un movimiento debes crear un producto a asociar.</div>

        <Button as={Link} to={Paths.CreateProduct()}>Nuevo producto</Button>
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
            autoFocus
            isLoading={isUndefined(options)}
            isSearchable
            options={options}
            defaultMenuIsOpen
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
          <FormLabel>Cantidad: Mayor o igual a 1</FormLabel>
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
