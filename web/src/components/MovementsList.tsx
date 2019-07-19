import './MovementsList.scss';
import React, { Component } from 'react';
import MovementsService, { Movement } from '../services/MovementsService';
import isUndefined from 'lodash/isUndefined';
import Table from 'react-bootstrap/Table';
import Accordion from 'react-bootstrap/Accordion'
import Paths from '../Paths';
import { Link, RouteComponentProps, withRouter } from 'react-router-dom';
import isEmpty from 'lodash/isEmpty';
import { timestampDateFormat } from '../helpers';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';

interface Props {
  product?: string;
  limit?: number;
  link?: boolean;
}

interface State {
  movements: Movement[] | undefined;
}

class MovementsList extends Component<Props & RouteComponentProps, State> {

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

    const {
      link = true
    } = this.props;

    const descriptionId = 'description-' + movement.id;
    return <tr
      key={movement.id}
      onClick={(event) => {
        event.stopPropagation();
        this.props.history.push(Paths.MovementDetails(movement.id, movement.description));
      }}
      style={{ cursor: 'pointer' }}
      title={movement.description}
    >
      <td>{icon} {Math.abs(movement.quantity)}</td>
      <td title={movement.product.description} style={{ width: '45%'}}>
        <div style={{ display: 'flex' }}>
          {
            link
              ? <Link
                  onClick={(event) => { event.stopPropagation(); }}
                  to={Paths.ProductDetails(movement.product.sku, movement.product.description)}
                >
                  {movement.product.sku}
                </Link>
              : movement.product.sku
          }
          <OverlayTrigger
            overlay={
              <Tooltip
                style={{pointerEvents: 'none'}}
                id={'tooltip-movement-'+descriptionId}
              >
                <>{movement.description}</>
              </Tooltip>
            }
            trigger={['click', 'hover']}
          >
            <span onClick={(event) => { event.stopPropagation(); }} style={{ marginLeft: 'auto' }}>❓</span>
          </OverlayTrigger>

          <OverlayTrigger
            overlay={
              <Tooltip
                style={{pointerEvents: 'none'}}
                id={'tooltip-product-'+descriptionId}
              >
                <>{movement.product.description}</>
              </Tooltip>
            }
            trigger={['click', 'hover']}
          >
            <span onClick={(event) => { event.stopPropagation(); }}>🔍</span>
          </OverlayTrigger>
        </div>
      </td>
      <td>{movement.user.username}</td>
      <td>{timestampDateFormat(movement.created_at)}</td>
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
      <Table hover variant='sm'>
        <thead>
          <tr>
            <th scope='col'>#</th>
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

export default withRouter(MovementsList);
