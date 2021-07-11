import React, { useState } from 'react';
import Particles from 'react-particles-js';
import Navigation from './components/Navigation/Navigation';
//import Logo from './components/Logo/Logo';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';
import Dashboard from './components/Dashboard/Dashboard';
import './App.css';
import 'tachyons';

const particlesOptions = {
  particles: {
    number: {
      value: 80,
      density: {
        enable: true,
        value_area: 800
      }
    }
  }
}

const user = {
  user_id: '',
  account_id: '',
  first_name: '',
  last_name: '',
  email: '',
  password: '',
  start_time: '',
  end_time: '',
  expression_arr: []
};

function App() {

  const [route, setRoute] = useState('signin');
  const [isSigned, setIsSigned] = useState(false);
  const [newUser, setNewUser] = useState(user);

  function loadUser(data) {
    const User = {
      user_id: data._id,
      account_id: data.account_id,
      first_name: data.first_name,
      last_name: data.last_name,
      email: data.email,
      password: data.password,
      start_time: data.start_time,
      end_time: data.end_time,
      expression_arr: data.expression_arr
    }
    setNewUser(User);
  }

  function onRouteChange(route) {
    if (route === 'signout') {
      setIsSigned(false);
    } else if (route === 'home') {
      setIsSigned(true);
    }
    setRoute(route);
  }

  return (
    <div className="App">
      <Particles className='particles'
          params={particlesOptions}
      />
      <Navigation onRouteChange={onRouteChange} isSigned={isSigned} />

      {route === 'home' 
        ? <div>
            <Dashboard user={newUser} />  
            {/*<Logo />*/}
          </div>  
        : (
            route === 'signin'
            ? <Signin loadUser={loadUser} onRouteChange={onRouteChange} />
            : <Register loadUser={loadUser} onRouteChange={onRouteChange} />
          )
      }
    </div>
  );
}

export default App;