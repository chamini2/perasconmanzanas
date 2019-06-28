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
import Badge from 'react-bootstrap/Badge';

interface RouteParams {
  sku: string;
}

interface State {
  old_sku: Product['sku'];
  sku: Product['sku'];
  description: Product['description'];
}

class EditProduct extends Component<RouteComponentProps<RouteParams> & AuthInfoProps, State> {

  constructor(props: any) {
    super(props);
    const old_sku = decodeURIComponent(props.match.params['sku']);
    this.state = {
      old_sku,
      sku: old_sku,
      description: '',
    };
  }

  async componentDidMount() {
    const product = await ProductsService.fetchProduct(this.state.old_sku);
    if (product) {
      this.setState({ description: product.description });
    } else {
      toast('Producto no encontrado', { type: 'error' });
      this.props.history.goBack();
    }
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

      this.setState({ [key]: (event as any).target.value } as State);
    };
  }

  handleSubmit: Form['props']['onSubmit'] = async event => {
    event.preventDefault();

    const {
      old_sku,
      sku,
      description
    } = this.state;

    try {
      await ProductsService.patchProduct(old_sku, { sku: sku, description: description });
      toast('Producto guardado', { type: 'info' });
      this.props.history.push(Paths.ProductDetails(sku, description));
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
      old_sku,
      sku,
      description
    } = this.state;

    return <div className='container'>
      <h3>Editar producto <code>{old_sku}</code></h3>

      {
        this.props.auth.role !== 'web_admin'
          ? <><Badge variant='warning'>Debes ser administrador de la cuenta</Badge> <br/> <br/></>
          : null
      }

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

        <Button
          block
          disabled={!this.validateForm()}
          type='submit'
        >
          Guardar
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

export default withRouter(withAuthInfo(hasAccountGuard(isLoggedInGuard(EditProduct))));
