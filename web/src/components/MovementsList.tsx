import './MovementsList.scss';
import React, { Component } from 'react';
import withAuthInfo, { AuthInfoProps } from '../wrappers/withAuthInfo';
import MovementsService, { Movement } from '../services/MovementsService';
import isUndefined from 'lodash/isUndefined';
import Table from 'react-bootstrap/Table';
import formatd from 'date-fns/format';
import * as Paths from '../Paths';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { DATE_LOCALE, DATE_FORMAT } from '../constants';
import isEmpty from 'lodash/isEmpty';

interface Props {
  product?: string;
  limit?: number;
}

interface State {
  movements: Movement[] | undefined;
}

class MovementsList extends Component<AuthInfoProps & RouteComponentProps & Props, State> {

  constructor(props: any) {
    super(props);
    this.state = {
      movements: undefined,
    };
  }

  async componentDidMount() {
    const {
      limit,
      product
    } = this.props;

    if (product) {
      const movements = await MovementsService.fetchMovementsForProduct(product, limit);
      this.setState({ movements });
    } else {
      const movements = await MovementsService.fetchAllMovements(limit);
      this.setState({ movements });
    }
  }

  renderMovement(movement: Movement) {
    const negative = movement.quantity < 0;
    const icon = negative ? <span style={{ color: 'red' }}>↓</span> : <span style={{ color: 'green' }}>↑</span>;

    return <tr>
      <td>{icon} {Math.abs(movement.quantity)}</td>
      <td
        onClick={event => {
          event.stopPropagation();
          this.props.history.push(Paths.ProductDetails(movement.product.sku, movement.product.description));
        }}
      >
        {movement.product.sku}
      </td>
      <td>{movement.user.username}</td>
      <td>{formatd(new Date(movement.created_at), DATE_FORMAT, { locale: DATE_LOCALE })}</td>
    </tr>;
  }

  renderMovementsRows() {
    const {
      movements
    } = this.state;

    if (isUndefined(movements)) {
      return <tr>
        <td colSpan={4}>
          Cargando...
        </td>
      </tr>;
    }

    if (isEmpty(movements)) {
      return <tr>
        <td colSpan={4}>
          No hay movimientos que mostrar
        </td>
      </tr>;
    }

    return movements.map(this.renderMovement.bind(this));
  }

  render() {
    return <div className='MovementsList'>
      <Table>
        <thead>
          <tr>
            <th scope='col'>Cantidad</th>
            <th scope='col'>Producto</th>
            <th scope='col'>Autor</th>
            <th scope='col'>Fecha</th>
          </tr>
        </thead>
        <tbody>
          {this.renderMovementsRows()}
        </tbody>
      </Table>
    </div>;
  }

}

export default withRouter(withAuthInfo(MovementsList));
