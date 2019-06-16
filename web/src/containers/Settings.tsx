import React, { Component } from 'react';
import Header, { headerContainerStyle, headerSiblingStyle } from '../components/Header';
import './Settings.scss';
import isLoggedInGuard from '../wrappers/isLoggedInGuard';
import { Link } from 'react-router-dom';
import Profile from './Profile';
import AuthService from '../services/Auth';
import withAuthInfo, { AuthInfoProps } from '../wrappers/withAuthInfo';
import Badge from 'react-bootstrap/Badge';
import * as Paths from '../Paths';

class Settings extends Component<AuthInfoProps, {}> {

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

          {
            this.props.auth.account
              ? <div>{this.props.auth.account!.name} <Badge variant='primary'>{this.props.auth.account!.id}</Badge></div>
              : null
          }

          <br/>
          <h4>Pendiente: Cuenta</h4> {/* TODO: Check it out */}
          <ul>
            <li>Modificar cuenta</li>
            <li>¿Eliminar cuenta?</li>
            <li><Link to={Paths.Invites()}>Invitar miembros a cuenta</Link></li>
            <li>Sacar miembros de cuenta</li>
            <li>Encuesta: llamarlo <i>cuenta</i>, <i>proyecto</i>, <i>inventario</i></li>
          </ul>
        </div>
      </div>
    </div>;
  }

}

export default withAuthInfo(isLoggedInGuard(Settings));
