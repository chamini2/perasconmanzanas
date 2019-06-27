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
import ChangePassword from './ChangePassword';
import withAuthInfo, { AuthInfoProps } from '../wrappers/withAuthInfo';
import Button from 'react-bootstrap/Button';
import Paths from '../Paths';

interface State {
  profileCollapse: 'edit' | 'password';
}

class Settings extends Component<AuthInfoProps, State> {

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

          <Accordion defaultActiveKey='edit'>
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
                  <ChangePassword />
                </Card.Body>
              </Accordion.Collapse>
            </Card>
          </Accordion>
        </div>

        {
          this.props.auth.account
            ? <div className='account'>
                <div className='inner-header'>
                  <h3>Proyecto</h3>
                  <Link to={Paths.AccountSelector()}>Seleccionar proyecto</Link>
                </div>

                <Account />

              </div>
            : <div className='account'>
                <Button href={Paths.AccountSelector()} style={{display: 'block'}}>Seleccionar proyecto</Button>
              </div>
        }
      </div>
    </div>;
  }

}

export default withAuthInfo<{}>(isLoggedInGuard(Settings));
