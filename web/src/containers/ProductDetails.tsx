import React, { Component } from 'react';
import isLoggedInGuard from '../wrappers/isLoggedInGuard';
import { withRouter, RouteComponentProps, Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import ProductsService, { ProductView } from '../services/ProductsService';
import isUndefined from 'lodash/isUndefined';
import Paths from '../Paths';
import { toast } from 'react-toastify';
import MovementsList from '../components/MovementsList';
import Header, { headerSiblingStyle, headerContainerStyle } from '../components/Header';
import { timestampDateFormat } from '../helpers';
import hasAccountGuard from '../wrappers/hasAccountGuard';

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
    const product = await ProductsService.fetchProduct(this.props.match.params['sku']);
    if (product) {
      this.props.history.replace(Paths.ProductDetails(product.sku, product.description));
      this.setState({ product });
    } else {
      toast('Producto no encontrado', { type: 'error' });
      this.props.history.replace('/products');
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

        <MovementsList product={product.sku} />
        <Button
          as={Link}
          to={Paths.CreateMovement(product.sku)}
        >
          Agregar un movimiento
        </Button>
      </div>
    </div>;
  }

}

export default withRouter(hasAccountGuard(isLoggedInGuard(ProductDetails)));
