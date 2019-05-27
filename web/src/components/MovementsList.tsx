import React, { Component } from 'react';
import withAuthInfo, { AuthInfoProps } from '../wrappers/withAuthInfo';
import MovementsService, { Movement } from '../services/MovementsService';
import ListGroup from 'react-bootstrap/ListGroup';
import isUndefined from 'lodash/isUndefined';
import ListGroupItem from 'react-bootstrap/ListGroupItem';
import formatd from 'date-fns/format';
import { TIMESTAMP_FORMAT, DATE_LOCALE } from '../constants';

interface Props {
  product?: string;
  limit?: number;
}

interface State {
  movements: Movement[] | undefined;
}

class MovementsList extends Component<AuthInfoProps & Props, State> {

  constructor(props: any) {
    super(props);
    this.state = {
      movements: undefined
    };
  }

  async componentDidMount() {
    if (this.props.product) {
      const movements = await MovementsService.fetchMovementsForProduct(this.props.product);
      this.setState({ movements });
    } else {
      const movements = await MovementsService.fetchAllMovements();
      this.setState({ movements });
    }
  }

  renderMovement(movement: Movement) {
    return <ListGroupItem
      key={movement.id}
    >
      {movement.quantity} {movement.product.description} ({movement.product.sku})<br/>
      movidos por {movement.user.full_name}<br/>
      {formatd(new Date(movement.created_at), TIMESTAMP_FORMAT, { locale: DATE_LOCALE })}
    </ListGroupItem>;
  }

  render() {
    const {
      movements
    } = this.state;

    if (isUndefined(movements)) {
      return 'Cargando...';
    }

    return <div className='MovementsList container'>
      <ListGroup>
        {movements.map(this.renderMovement)}
      </ListGroup>
    </div>;
  }

}

export default withAuthInfo<Props>(MovementsList);
