import React, { Component } from 'react';
import Header, { headerContainerStyle, headerSiblingStyle } from '../components/Header';
import './Settings.scss';
import isLoggedInGuard from '../wrappers/isLoggedInGuard';
import { Link } from 'react-router-dom';
import Profile from './Profile';
import AuthService from '../services/Auth';
import Account from './Account';
import Card from 'react-bootstrap/Card';
import Accordion from 'react-bootstrap/Accordion';

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

          <Accordion>
            <Card>
              <Accordion.Toggle as={Card.Header} eventKey='edit'> Editar perfil </Accordion.Toggle>
              <Accordion.Collapse eventKey='edit'>
                <Card.Body>
                  <Profile />
                </Card.Body>
              </Accordion.Collapse>
            </Card>
            <Card>
              <Accordion.Toggle as={Card.Header} eventKey='password'> Cambiar contraseña </Accordion.Toggle>
              <Accordion.Collapse eventKey='password'>
                <Card.Body>
                  Pendiente: Cambiar contraseña {/* TODO: HERE*/}
                </Card.Body>
              </Accordion.Collapse>
            </Card>
          </Accordion>
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
