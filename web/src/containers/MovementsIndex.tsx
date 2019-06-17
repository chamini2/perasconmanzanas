import './MovementsIndex.scss';
import React, { Component } from 'react';
import isLoggedInGuard from '../wrappers/isLoggedInGuard';
import MovementsList from '../components/MovementsList';
import Header, { headerContainerStyle, headerSiblingStyle } from '../components/Header';
import hasAccountGuard from '../wrappers/hasAccountGuard';
import { Link } from 'react-router-dom';

class MovementsIndex extends Component<{}, {}> {

  constructor(props: any) {
    super(props);
    this.state = {};
  }

  render() {
    return <div style={headerContainerStyle} className='MovementsIndex container'>
      <Header />

      <div style={headerSiblingStyle}>
        <div className='inner-header'>
          <h3>Movimientos</h3>
          <Link
            to='/movements/new'
          >
            Nuevo movimiento
          </Link>
        </div>

        <MovementsList />
      </div>
    </div>;
  }

}

export default hasAccountGuard(isLoggedInGuard(MovementsIndex));
