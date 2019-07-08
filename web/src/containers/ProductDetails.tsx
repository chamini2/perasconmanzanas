import React, { Component } from 'react';
import isLoggedInGuard from '../wrappers/isLoggedInGuard';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import ProductsService, { ProductView } from '../services/ProductsService';
import isUndefined from 'lodash/isUndefined';
import Paths from '../Paths';
import { toast } from 'react-toastify';
import MovementsList from '../components/MovementsList';
import Header, { headerSiblingStyle, headerContainerStyle } from '../components/Header';
import { timestampDateFormat } from '../helpers';
import hasAccountGuard from '../wrappers/hasAccountGuard';
import { AxiosResponse } from 'axios';
import { errorPGMessage } from '../services/Request';
import { STRINGS } from '../constants';

interface RouteParams {
  sku: string;
}

interface State {
  product?: ProductView;
}

class ProductDetails extends Component<RouteComponentProps<RouteParams>, State> {

  constructor(props: any) {
    super(props);
    this.state = {};
  }

  async componentDidMount() {
    const product = await ProductsService.fetchProduct(decodeURIComponent(this.props.match.params['sku']));
    if (product) {
      this.props.history.replace(Paths.ProductDetails(product.sku, product.description));
      this.setState({ product });
    } else {
      toast('Producto no encontrado', { type: 'error' });
      this.props.history.goBack();
    }
  }

  async deleteProduct(event: React.MouseEvent) {
    event.stopPropagation();

    if (isUndefined(this.state.product)) {
      return;
    }

    const { product } = this.state;

    if (!window.confirm(`¿Seguro que quieres eliminar el producto ${product.sku}?\n\nAntes debes eliminar los movimientos asociades\n\n${STRINGS.MUST_BE_ADMIN}`)) {
      return;
    }

    try {
      await ProductsService.deleteProduct(product.sku);
      toast('Producto eliminado', { type: 'info' });

      this.props.history.push(Paths.ProductsIndex());
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
    if (isUndefined(this.state.product)) {
      return <h3>Cargando...</h3>;
    }

    const { product } = this.state;

    return <div style={headerContainerStyle} className='ProductDetails container'>
      <Header/>

      <div style={headerSiblingStyle}>
        <h3>{product.sku}</h3>
        <h4>{product.description}</h4>
        <h4>Cantidad: {product.stock}</h4>
        <h6>En el sistema desde el {timestampDateFormat(product.created_at)}</h6>

        <MovementsList product={product.sku} link={false}/>
        <Button href={Paths.CreateMovement(product.sku)}>
          Agregar un movimiento
        </Button>
        <Button variant='warning' href={Paths.EditProduct(product.sku)} style={{marginLeft: '20px'}}>
          Editar
        </Button>
        <Button variant='danger' onClick={this.deleteProduct.bind(this)} style={{marginLeft: '20px'}}>
          Eliminar
        </Button>
      </div>
    </div>;
  }

}

export default withRouter(hasAccountGuard(isLoggedInGuard(ProductDetails)));
