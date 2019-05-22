import './Header.scss';
import React, { Component } from 'react';
import Badge from 'react-bootstrap/Badge';
import Navbar from 'react-bootstrap/Navbar';
import NavLink from 'react-bootstrap/NavLink';
import withAuthInfo, { AuthInfoProps } from '../wrappers/withAuthInfo';
import { Link } from 'react-router-dom';

export const headerContainerStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  height: '100%'
};

export const headerSiblingStyle: React.CSSProperties = {
  flexGrow: 1,
  overflow: 'auto'
}

class Header extends Component<AuthInfoProps> {

  constructor(props: any) {
    super(props);
    this.state = {};
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

  render() {
    return <Navbar className='Header'>
      <NavLink title='Inicio' className='home-link' as={Link} to='/'>
        <h4 className='logo'>🍐➕🍎</h4>
        {this.account()}
      </NavLink>
      <NavLink title='Preferencias' className='to-end' as={Link} to='/settings'> ⚙️ </NavLink>
    </Navbar>;
  }

}

export default withAuthInfo(Header);
