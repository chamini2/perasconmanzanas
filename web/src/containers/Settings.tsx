import React, { Component } from 'react';
import Header, { headerContainerStyle, headerSiblingStyle } from '../components/Header';
import './Settings.scss';
import isLoggedInGuard from '../wrappers/isLoggedInGuard';
import { Link } from 'react-router-dom';
import Profile from './Profile';
import AuthService from '../services/Auth';
import Account from './Account';

class Settings extends Component {

  constructor(props: any) {
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
              to='/'
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

          <Account />
        </div>
      </div>
    </div>;
  }

}

export default isLoggedInGuard(Settings);
