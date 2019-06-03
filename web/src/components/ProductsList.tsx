import './ProductsList.scss';
import React, { Component } from 'react';
import withAuthInfo, { AuthInfoProps } from '../wrappers/withAuthInfo';
import isUndefined from 'lodash/isUndefined';
import Table from 'react-bootstrap/Table';
import * as Paths from '../Paths';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import ProductsService, { Product } from '../services/ProductsService';
import { timestampTimestampFormat } from '../helpers';

interface State {
  products: Product[] | undefined;
}

class ProductsList extends Component<AuthInfoProps & RouteComponentProps, State> {

  constructor(props: any) {
    super(props);
    this.state = {
      products: undefined,
    };
  }

  async componentDidMount() {
    const products = await ProductsService.fetchAllProducts();
    this.setState({ products });
  }

  renderProduct(product: Product) {
    return <tr
      onClick={event => {
        event.stopPropagation();
        this.props.history.push(Paths.ProductDetails(product.sku, product.description));
      }}
    >
      <td>{product.sku}</td>
      <td>{product.description}</td>
      <td>{timestampTimestampFormat(product.created_at)}</td>
    </tr>;
  }

  render() {
    const {
      products
    } = this.state;

    if (isUndefined(products)) {
      return 'Cargando...';
    }

    return <div className='ProductsList'>
      <Table>
        <thead>
          <tr>
            <th scope='col'>SKU</th>
            <th scope='col'>Descripción</th>
            <th scope='col'>Fecha</th>
          </tr>
        </thead>
        <tbody>
          {products.map(this.renderProduct.bind(this))}
        </tbody>
      </Table>
    </div>;
  }

}

export default withRouter(withAuthInfo(ProductsList));
