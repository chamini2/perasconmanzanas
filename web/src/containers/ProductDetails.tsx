import React, { Component } from 'react';
import isLoggedInGuard from '../wrappers/isLoggedInGuard';
import withAuthInfo, { AuthInfoProps } from '../wrappers/withAuthInfo';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import ProductsService, { Product } from '../services/ProductsService';
import isEmpty from 'lodash/isEmpty';
import * as Paths from '../Paths';
import { toast } from 'react-toastify';
import MovementsList from '../components/MovementsList';
import Header, { headerSiblingStyle, headerContainerStyle } from '../components/Header';
import { timestampDateFormat } from '../helpers';
import hasAccountGuard from '../wrappers/hasAccountGuard';

interface RouteParams {
  sku: string;
}

class ProductDetails extends Component<AuthInfoProps & RouteComponentProps<RouteParams>, Product | {}> {

  constructor(props: any) {
    super(props);
    this.state = {};
  }

  async componentDidMount() {
    const product = await ProductsService.fetchProduct(this.props.match.params['sku']);
    if (product) {
      this.props.history.replace(Paths.ProductDetails(product.sku, product.description));
      this.setState(product);
    } else {
      toast('Producto no encontrado', { type: 'error' });
      this.props.history.replace('/products');
    }
  }

  render() {
    if (isEmpty(this.state)) {
      return <h3>Cargando producto...</h3>;
    }

    const product = this.state as Product;

    return <div style={headerContainerStyle} className='ProductDetails container'>
      <Header/>

      <div style={headerSiblingStyle}>
        <h3>{product.sku}</h3>
        <h4>{product.description}</h4>
        <h6>En el sistema desde el {timestampDateFormat(product.created_at)}</h6>

        <MovementsList product={product.sku} />
      </div>
    </div>;
  }

}

export default withRouter(withAuthInfo(hasAccountGuard(isLoggedInGuard(ProductDetails))));
