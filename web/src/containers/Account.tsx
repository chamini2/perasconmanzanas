import React, { Component } from 'react';
import withAuthInfo, { AuthInfoProps } from '../wrappers/withAuthInfo';
import Badge from 'react-bootstrap/Badge';
import { Link } from 'react-router-dom';
import * as Paths from '../Paths';
import UsersService, { User } from '../services/UsersService';
import hasAccountGuard from '../wrappers/hasAccountGuard';
import isLoggedInGuard from '../wrappers/isLoggedInGuard';
import isUndefined from 'lodash/isUndefined';
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button';
import ListGroupItem from 'react-bootstrap/ListGroupItem';

interface State {
  members?: User[];
}

class Account extends Component<AuthInfoProps, State> {

  constructor(props: any) {
    super(props);
    this.state = {};
  }

  async componentDidMount() {
    if (this.props.auth.accountId) {
      const res = await UsersService.fetchAccountUsers(this.props.auth.accountId!);
      this.setState({ members: res.data });
    }
  }

  renderMember(user: User) {
    return <ListGroupItem
      key={user.id}
      active={this.props.auth.userId === user.id}
    >
      {user.full_name}
      <Badge>{user.email}</Badge>
    </ListGroupItem>;
  }

  render() {
    const {
      members
    } = this.state;

    return <div className='Account'>
      {
        this.props.auth.account
          ? <div>{this.props.auth.account!.name} <Badge variant='primary'>{this.props.auth.account!.id}</Badge></div>
          : null
      }

      <h3>Miembros</h3>
      <ListGroup>
          {
            isUndefined(members)
              ? <ListGroupItem>Cargando...</ListGroupItem>
              : members.map(this.renderMember.bind(this))
          }
      </ListGroup>

      <Button as={Link} to={Paths.Invites()}>Invitaciones</Button>

      <br/>
      <h4>Pendiente: Cuenta</h4> {/* TODO: HERE */}
      <ul>
        <li>Modificar cuenta</li>
        <li>¿Eliminar cuenta?</li>
        <li>Sacar miembros de cuenta</li>
        <li>Encuesta: llamarlo <i>cuenta</i>, <i>proyecto</i>, <i>inventario</i></li>
      </ul>
    </div>;
  }

}

export default withAuthInfo<{}>(hasAccountGuard(isLoggedInGuard(Account)));
