import React, { Component } from 'react';
import Badge from 'react-bootstrap/Badge';
import Navbar from 'react-bootstrap/Navbar';
import NavItem from 'react-bootstrap/NavItem';
import NavLink from 'react-bootstrap/NavLink';
import './Header.css';
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

export class Header extends Component<AuthInfoProps> {

  constructor(props: any) {
    super(props);
    this.state = {};
  }

  account() {
    if (!this.props.auth.account) {
      return null;
    }

    return <NavItem> <Badge variant='primary'> {this.props.auth.account.name} </Badge> </NavItem>;
  }

  render() {
    return <Navbar className='Header'>
      {this.account()}
      <NavLink as={Link} to='/settings' > ⚙️ </NavLink>
    </Navbar>;
  }

}

export default withAuthInfo(Header);
