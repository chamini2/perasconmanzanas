import React, { Component } from 'react';
import withAuthInfo, { AuthInfoProps } from '../wrappers/withAuthInfo';
import Badge from 'react-bootstrap/Badge';
import Paths from '../Paths';
import UsersService, { User } from '../services/UsersService';
import isLoggedInGuard from '../wrappers/isLoggedInGuard';
import isUndefined from 'lodash/isUndefined';
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button';
import ListGroupItem from 'react-bootstrap/ListGroupItem';
import { Account as AccountType } from '../services/AccountsService';
import MembersService from '../services/MemebersService';
import { toast } from 'react-toastify';
import { STRINGS } from '../constants';
import { errorPGMessage } from '../services/Request';
import { AxiosResponse } from 'axios';

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

  removeMember(userId: User['id'], accountId: AccountType['id']) {
    return async (event: React.MouseEvent) => {
      event.stopPropagation();

      if (!window.confirm('¿Seguro que quieres sacar al miembro?')) {
        return;
      }

      try {
        await MembersService.removeMember(userId, accountId);
        toast('Miembro sacado', { type: 'info' });

        this.setState({ members: undefined });
        this.componentDidMount();
      } catch (err) {
        console.error(err);
        if (err.response) {
          const errResponse = err.response as AxiosResponse<string>;
          toast('Error en petición: ' + errorPGMessage(errResponse), { type: 'error' });
        } else {
          toast(STRINGS.UNKNOWN_ERROR, { type: 'error' });
        }
      }
    }
  }

  renderMember(user: User) {
    return <ListGroupItem
      key={user.id}
    >
      {user.full_name}
      <Badge>{user.email}</Badge>
      {
        this.props.auth.userId === user.id
          ? <Badge variant='primary'>Tú</Badge>
          : null
      }
      {
        this.props.auth.account!.owner_id === user.id
          ? <Badge variant='light'>Dueño</Badge>
          : null
      }
      <div style={{ float: 'right' }}>
        {
          this.props.auth.role === 'web_admin' && this.props.auth.account!.owner_id !== user.id
            ? <Button variant='danger' size='sm' onClick={this.removeMember(user.id, this.props.auth.accountId!).bind(this)}>Sacar</Button>
            : null
        }
      </div>
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

      <br/>
      <h5>Miembros</h5>
      <ListGroup>
          {
            isUndefined(members)
              ? <ListGroupItem>Cargando...</ListGroupItem>
              : members.map(this.renderMember.bind(this))
          }
      </ListGroup>

      <br/>
      <Button href={Paths.Invites()}>Invitaciones</Button>

      <br/>
      <br/>
      <h5>Pendiente: Proyecto</h5> {/* TODO: HERE */}
      <ul>
        <li>Agregar/quitar administradores</li>
        <li>Modificar proyecto</li>
        <li>¿Eliminar proyecto?</li>
      </ul>
    </div>;
  }

}

export default withAuthInfo<{}>(isLoggedInGuard(Account));
