import './ProductsList.scss';
import React, { Component } from 'react';
import isUndefined from 'lodash/isUndefined';
import Table from 'react-bootstrap/Table';
import Paths from '../Paths';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import ProductsService, { ProductView } from '../services/ProductsService';

interface State {
  products: ProductView[] | undefined;
}

class ProductsList extends Component<RouteComponentProps, State> {

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

  renderProduct(product: ProductView) {
    return <tr
      key={product.sku}
      onClick={event => {
        event.stopPropagation();
        this.props.history.push(Paths.ProductDetails(product.sku, product.description));
      }}
      style={{ cursor: 'pointer' }}
    >
      <td>{product.sku}</td>
      <td>{product.description}</td>
      <td>{product.stock}</td>
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
      <Table variant='sm' hover>
        <thead>
          <tr>
            <th scope='col'>SKU</th>
            <th scope='col'>Descripción</th>
            <th scope='col'>Cantidad</th>
          </tr>
        </thead>
        <tbody>
          {products.map(this.renderProduct.bind(this))}
        </tbody>
      </Table>
    </div>;
  }

}

export default withRouter(ProductsList);
