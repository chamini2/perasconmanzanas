import './ProductsIndex.scss';
import React, { Component } from 'react';
import isLoggedInGuard from '../wrappers/isLoggedInGuard';
import Header, { headerContainerStyle, headerSiblingStyle } from '../components/Header';
import { Link } from 'react-router-dom';
import ProductsList from '../components/ProductsList';
import hasAccountGuard from '../wrappers/hasAccountGuard';

class ProductsIndex extends Component<{}, {}> {

  constructor(props: any) {
    super(props);
    this.state = {};
  }

  render() {
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

        <ProductsList />
      </div>
    </div>;
  }

}

export default hasAccountGuard(isLoggedInGuard(ProductsIndex));
