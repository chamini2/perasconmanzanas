import React, { Component } from 'react';
import withAuthInfo, { AuthInfoProps } from '../wrappers/withAuthInfo';

export interface MovementsListProps {
  products?: string[];
  limit?: number;
}

// TODO: complete
class MovementsList extends Component<AuthInfoProps & MovementsListProps> {

  constructor(props: any) {
    super(props);
    this.state = {};
  }

  render() {
    return <div className='MovementsList container'>
      Pendiente: MovementsList
      {this.props.products && this.props.products.map(id =>
        <div>{id}</div>
      )}
    </div>;
  }

}

export default withAuthInfo<MovementsListProps>(MovementsList);
