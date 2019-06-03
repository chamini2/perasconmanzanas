import React, { Component } from 'react';
import isLoggedInGuard from '../wrappers/isLoggedInGuard';
import MovementsList from '../components/MovementsList';
import Header, { headerContainerStyle, headerSiblingStyle } from '../components/Header';
import hasAccountGuard from '../wrappers/hasAccountGuard';

class MovementsIndex extends Component<{}, {}> {

  constructor(props: any) {
    super(props);
    this.state = {};
  }

  render() {
    return <div style={headerContainerStyle} className='MovementsIndex container'>
      <Header />

      <div style={headerSiblingStyle}>
        <h2>Movimientos</h2>
        <MovementsList />
      </div>
    </div>;
  }

}

export default hasAccountGuard(isLoggedInGuard(MovementsIndex));
