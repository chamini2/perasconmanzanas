import React, { Component } from 'react';
import Header, { headerContainerStyle, headerSiblingStyle } from '../components/Header';
import './Settings.scss';
import isLoggedInGuard from '../wrappers/isLoggedInGuard';
import { Link } from 'react-router-dom';
import Profile from './Profile';
import AuthService from '../services/Auth';

class Settings extends Component<any, {}> {

  constructor(props: {}) {
    super(props);
    this.state = {};
  }

  render() {
    return <div style={headerContainerStyle} className='Settings container'>
      <Header />
      <div style={headerSiblingStyle} className='grid'>
        <div className='profile'>
          <div className='inner-header'>
            <h3>Perfil</h3>
            <Link
              to='#'
              onClick={function(event) {
                event.stopPropagation();
                AuthService.logout();
              }}
            >
            Cerrar sesión
            </Link>
          </div>
          <Profile />
        </div>
        <div className='account'>
          <div className='inner-header'>
            <h3>Cuenta</h3>
            <Link to='/accounts'>Seleccionar cuenta</Link>
          </div>
          <h4>Pendiente</h4> {/* TODO: Check it out */}
          <ul>
            <li>Modificar cuenta</li>
            <li>¿Eliminar cuenta?</li>
            <li>Invitar miembros a cuenta</li>
            <li>Sacar miembros de cuenta</li>
            <li>Encuesta: llamarlo <i>cuenta</i>, <i>proyecto</i>, <i>inventario</i></li>
          </ul>
        </div>
      </div>
    </div>;
  }

}

export default isLoggedInGuard(Settings);
