import React, { Component, MouseEvent } from 'react';
import Button from 'react-bootstrap/Button'
import Auth from '../services/Auth';
import './Header.css';
import withAuthInfo, { AuthInfoProps } from '../wrappers/withAuthInfo';

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

  logoutButton() {
    return <Button
        className='btn-secondary'
        onClick={function(event: MouseEvent) {
          event.stopPropagation();
          Auth.logout();
        }}
      >
      Cerrar sesión
      </Button>;
  }

  account() {
    if (!this.props.auth.account) {
      return null;
    }

    return <span> {this.props.auth.account.name} </span>;
  }

  render() {
    return <div className="Header">
      {this.account()}
      {this.logoutButton()}
    </div>;
  }

}

export default withAuthInfo(Header);
