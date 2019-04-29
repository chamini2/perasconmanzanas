import React, { Component } from 'react';
import Login from '../components/Login';
import './Welcome.scss';

export default class Welcome extends Component {

  render() {
    return <div className='Welcome container'>
      <div className='grid'>
        <div className='content'>
          <div>
            perasconmanzanas.com es una plataforma para <wbr/>
            llevar el control de tu inventario <i>fácilmente</i>. <br/>
            <br/>
            🍐 ≠ 🍎, lleva la cuenta como es.
          </div>
          {/* TODO: create and upload video */}
          <div hidden={true}>
            <iframe
              style={{
                width: '100%',
                height: '100%'
              }}
            >
            </iframe>
          </div>
        </div>
        <div className='login'>
          <Login />
        </div>
      </div>
    </div>;
  }

}
