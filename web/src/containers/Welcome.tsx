import './Welcome.scss';
import React, { Component } from 'react';
import Login from '../components/Login';
import Signup from '../components/Signup';
import RecoverPassword from '../components/RecoverPassword';
import { isNotLoggedInGuard } from '../wrappers/isLoggedInGuard';

class Welcome extends Component {

  render() {
    return <div className='Welcome container'>
      <div className='grid'>
        <div className='content'>
          <div>
            perasconmanzanas.com es una plataforma para <wbr/>
            llevar el control de tu inventario <i>fácilmente</i>. <br/>
            <br/>
            🍐➕🍎, todo suma.
          </div>
          {/* TODO: create and upload video */}
          <div className='demo'>
            <iframe
              hidden
              width='100%'
              height='100%'
              src='https://www.youtube-nocookie.com/embed/7ooW3hp7og4'
              allow='accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture'
              frameBorder='0'
              allowFullScreen
            ></iframe>
          </div>
        </div>
        <div className='auth'>
          <Login />
          <RecoverPassword />
          <div className='separator-line'></div>
          <Signup />
        </div>
      </div>
    </div>;
  }

}

export default isNotLoggedInGuard(Welcome);
