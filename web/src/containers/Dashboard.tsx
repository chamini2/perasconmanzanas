import './Dashboard.scss';
import React, { Component } from 'react';
import Header, { headerSiblingStyle, headerContainerStyle } from '../components/Header';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';
import MovementsList from '../components/MovementsList';

class Dashboard extends Component {

  render() {
    return <div style={headerContainerStyle} className='Dashboard container'>
      <Header />

      <div style={headerSiblingStyle} className='inner'>
        <Button
          as={Link}
          to='/movements/new'
        >
          Agregar un movimiento
        </Button>

        <Button
          as={Link}
          to='/products'
        >
          Ver productos
        </Button>

        <h4>Movimientos recientes</h4>
        <MovementsList limit={5} />
        <Link to='/movements'>Ver todos los movimientos</Link>
      </div>
    </div>;
  }

}

export default Dashboard;
