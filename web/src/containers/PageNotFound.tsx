import React, { Component } from 'react';
import { Link, withRouter, RouteComponentProps } from 'react-router-dom';

class PageNotFound extends Component<RouteComponentProps> {

  constructor(props: any) {
    super(props);
    this.state = {};
  }

  render() {
    return <div className='container'>
      <h2>404 ‒ Esta página no existe</h2>

      <h4>
        Sigue al <Link to='/'>inicio</Link> o <a href='#' onClick={() => this.props.history.goBack()}>vuelve</a> de donde navegaste.
      </h4>
    </div>
  }

}

export default withRouter(PageNotFound);
