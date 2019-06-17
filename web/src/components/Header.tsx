import './Header.scss';
import React, { Component } from 'react';
import Badge from 'react-bootstrap/Badge';
import Navbar from 'react-bootstrap/Navbar';
import NavLink from 'react-bootstrap/NavLink';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import withAuthInfo, { AuthInfoProps } from '../wrappers/withAuthInfo';
import { Link } from 'react-router-dom';
import * as Paths from '../Paths';
import { CONTACT_EMAIL, CONTACT_TWITTER } from '../constants';

export const headerContainerStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  height: '100%'
};

export const headerSiblingStyle: React.CSSProperties = {
  flexGrow: 1,
  overflow: 'auto'
}

interface State {
  showContactModal: boolean;
}

class Header extends Component<AuthInfoProps, State> {

  constructor(props: any) {
    super(props);
    this.state = {
      showContactModal: false,
    };
  }

  account() {
    if (!this.props.auth.account) {
      return null;
    }

    return <Badge
      style={{ marginLeft: '0.5rem' }}
      variant='primary'
    >
      {this.props.auth.account.id}
    </Badge>;
  }

  showContactModal() {
    this.setState({ showContactModal: true });
  }

  hideContactModal() {
    this.setState({ showContactModal: false });
  }

  render() {
    const {
      showContactModal
    } = this.state;

    return <Navbar className='Header'>
      <NavLink title='Inicio' className='home-link' as={Link} to={Paths.Home()}>
        <h4 className='logo'>🍐➕🍎</h4>
        {this.account()}
      </NavLink>

      <div className='separator'></div>

      <Button hidden variant='outline-warning' title='Contáctame' className='to-end' onClick={this.showContactModal.bind(this)}> ✉️ </Button>
      <Button variant='outline-dark' title='Preferencias' className='to-end' as={Link} to={Paths.Settings()}> ⚙️ </Button>

      <Modal className='Modal-Header-contact' show={showContactModal} onHide={this.hideContactModal.bind(this)}>
        <Modal.Header closeButton> Contáctame </Modal.Header>
        <Modal.Body>
          <h4>¿Preguntas, dudas?</h4>
          Contáctame por
          <ul>
            <li> Correo electrónico a <a target='_blank' rel='noopener noreferrer' href={'mailto:' + CONTACT_EMAIL + '?subject=perasconmanzanas%3A%20Ayuda'}>{CONTACT_EMAIL}</a> </li>
            <li> Twitter a <a target='_blank' rel='noopener noreferrer' href={'//twitter.com/' + CONTACT_TWITTER}>@{CONTACT_TWITTER}</a> </li>
          </ul>
        </Modal.Body>
      </Modal>
    </Navbar>;
  }

}

export default withAuthInfo<{}>(Header);
