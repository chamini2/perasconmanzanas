import React, { Component } from 'react';
import isLoggedInGuard from '../wrappers/isLoggedInGuard';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import ProductsService, { ProductView } from '../services/ProductsService';
import isUndefined from 'lodash/isUndefined';
import Paths from '../Paths';
import { toast } from 'react-toastify';
import MovementsList from '../components/MovementsList';
import Header, { headerSiblingStyle, headerContainerStyle } from '../components/Header';
import { timestampDateFormat } from '../helpers';
import hasAccountGuard from '../wrappers/hasAccountGuard';
import { AxiosResponse } from 'axios';
import { errorPGMessage } from '../services/Request';
import { STRINGS } from '../constants';
import MovementsService, { Movement } from '../services/MovementsService';

interface RouteParams {
  id: string;
}

interface State {
  movement?: Movement;
}

class MovementDetails extends Component<RouteComponentProps<RouteParams>, State> {

  constructor(props: any) {
    super(props);
    this.state = {};
  }

  async componentDidMount() {
    const movement = await MovementsService.fetchMovement(decodeURIComponent(this.props.match.params['id']));
    if (movement) {
      this.props.history.replace(Paths.MovementDetails(movement.id, movement.description));
      this.setState({ movement });
    } else {
      toast('Producto no encontrado', { type: 'error' });
      this.props.history.goBack();
    }
  }

  async delete(event: React.MouseEvent) {
    event.stopPropagation();

    if (isUndefined(this.state.movement)) {
      return;
    }

    const { movement } = this.state;

    if (!window.confirm(`¿Seguro que quieres eliminar el movimiento ${movement.id}?\n\n${STRINGS.MUST_BE_ADMIN}`)) {
      return;
    }

    try {
      await MovementsService.deleteMovement(movement.id);
      toast('Movimiento eliminado', { type: 'info' });

      this.props.history.push(Paths.MovementsIndex());
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

  render() {
    if (isUndefined(this.state.movement)) {
      return <h3>Cargando...</h3>;
    }

    const { movement } = this.state;

    return <div style={headerContainerStyle} className='MovementDetails container'>
      <Header/>

      <div style={headerSiblingStyle}>
        <h3>{movement.id}</h3>
        <h4>{movement.description}</h4>
        <h4>Cantidad: {movement.quantity}</h4>
        <h6>En el sistema desde el {timestampDateFormat(movement.created_at)}</h6>

        <Button variant='danger' onClick={this.delete.bind(this)} style={{marginLeft: '20px'}}>
          Eliminar
        </Button>
      </div>
    </div>;
  }

}

export default withRouter(hasAccountGuard(isLoggedInGuard(MovementDetails)));
