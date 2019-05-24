import './ProductsIndex.scss';
import React, { Component } from 'react';
import isLoggedInGuard from '../wrappers/isLoggedInGuard';
import Header, { headerContainerStyle, headerSiblingStyle } from '../components/Header';
import { Link } from 'react-router-dom';
import ProductsService, { Product } from '../services/ProductsService';
import ListGroup from 'react-bootstrap/ListGroup';
import ListGroupItem from 'react-bootstrap/ListGroupItem';
import formatd from 'date-fns/format';
import { TIMESTAMP_FORMAT, DATE_LOCALE } from '../constants';
import * as Paths from '../Paths';

interface State {
  products?: Product[];
}

class ProductsIndex extends Component<{}, State> {

  constructor(props: any) {
    super(props);
    this.state = {
      products: undefined
    };
  }

  async componentDidMount() {
    const result = await ProductsService.fetchAllProducts();
    this.setState({ products: result.data });
  }

  renderProduct(product: Product) {
    return <ListGroupItem
      as={Link}
      to={Paths.ProductDetails(product.sku, product.description)}
    >
      <div>{product.sku}</div>
      <div>{product.description}</div>
      <div>{formatd(new Date(product.created_at), TIMESTAMP_FORMAT, { locale: DATE_LOCALE })}</div>
    </ListGroupItem>;
  }

  render() {
    const { products } = this.state;
    return <div style={headerContainerStyle} className='ProductsIndex container'>
      <Header />

      <div style={headerSiblingStyle}>
        <div className='inner-header'>
          <h3>Productos</h3>
          <Link
            to='/products/new'
          >
            Nuevo producto
          </Link>
        </div>

        {/* TODO: Use <AgGridReact> */}
        <ListGroup>
        { products ? products.map(this.renderProduct) : 'Cargando productos...' }
        </ListGroup>

        {/* TODO: Check it out */}
        <h4>Pendiente: ProductIndex</h4>
        <ul>
          <li>Diseñar</li>
          <li>Diseñar diferencias entre móvil y escritorio</li>
          <li>Agregar información de <i>stock</i></li>
          <li>Modificar producto</li>
          <li>¿Eliminar producto?</li>
        </ul>
      </div>
    </div>;
  }

}

export default isLoggedInGuard(ProductsIndex);
