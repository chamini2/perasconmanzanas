import React, { Component } from 'react';
import Header, { headerContainerStyle, headerSiblingStyle } from '../components/Header';
import './Settings.scss';
import isLoggedInGuard from '../wrappers/isLoggedInGuard';
import { Link } from 'react-router-dom';
import Profile from './Profile';
import AuthService from '../services/Auth';
import Account from './Account';
import Card from 'react-bootstrap/Card';
import Collapse from 'react-bootstrap/Collapse';

interface State {
  profileCollapse: 'edit' | 'password';
}

class Settings extends Component<{}, State> {

  constructor(props: any) {
    super(props);
    this.state = {
      profileCollapse: 'edit'
    };
  }

  render() {
    const {
      profileCollapse
    } = this.state;

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

          <h4 onClick={() => this.setState({ profileCollapse: 'edit' })}>Editar perfil {profileCollapse === 'edit' ? '▽' : '▷'}</h4>
          <Collapse in={profileCollapse === 'edit'}>
            <div>
              <Profile />
            </div>
          </Collapse>
          <h4 onClick={() => this.setState({ profileCollapse: 'password' })}>Cambiar contraseña {profileCollapse === 'password' ? '▽' : '▷'}</h4>
          <Collapse in={profileCollapse === 'password'}>
            Pendiente: Cambiar contraseña {/* TODO: HERE*/}
          </Collapse>
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
