import './Dashboard.scss';
import React, { Component } from 'react';
import Header, { headerSiblingStyle, headerContainerStyle } from '../components/Header';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';
import MovementsList from '../components/MovementsList';
import hasAccountGuard from '../wrappers/hasAccountGuard';
import Paths from '../Paths';

class Dashboard extends Component {

  render() {
    return <div style={headerContainerStyle} className='Dashboard container'>
      <Header />

      <div style={headerSiblingStyle} className='inner'>
        <Button href={Paths.CreateMovement()}>
          Agregar un movimiento
        </Button>

        <Button href={Paths.ProductsIndex()} >
          Productos
        </Button>

        <h4>Movimientos recientes</h4>
        <MovementsList limit={5} />
        <Link to='/movements'>Ver todos los movimientos</Link>
      </div>
    </div>;
  }

}

export default hasAccountGuard(Dashboard);
