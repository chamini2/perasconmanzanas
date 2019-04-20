import React, { Component } from 'react';
import Login from '../components/Login';
import './Welcome.scss';

export default class Welcome extends Component {

  render() {
    return <div className="container">
      <div className="grid">
        <div className="content">
          <div>
            perasconmanzanas.com es una plataforma para <br/>
            llevar el control de tu inventario <i>fácilmente</i>. <br/>
            <br/>
            🍐 ≠ 🍎, lleva la cuenta como es.
          </div>
          <div>
            <iframe
              style={{
                width: '100%',
                height: '100%'
              }}
            >
            </iframe>
          </div>
        </div>
        <div className="login">
          <Login />
        </div>
      </div>
    </div>;
  }

}
