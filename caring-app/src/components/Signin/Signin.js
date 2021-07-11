import React, { useState } from 'react';

function Signin({ onRouteChange, loadUser }) {

  const [signEmail, setEmail] = useState('');
  const [signPassword, setPassword] = useState('');


  function onEmailChange(event) {
    setEmail(event.target.value);
  }

  function onPasswordChange(event) {
    setPassword(event.target.value);
  }  

  function onSubmit() {
    fetch('http://localhost:5050/signin', {
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        email: signEmail,
        password: signPassword
      })
    })
      .then(response => response.json())
      .then(user => {
        console.log(user);
        if (user._id) {
          loadUser(user);
          onRouteChange('home');
        }
      })
  }

  return (
    <div>
      <article className="br3 ba b--black-10 mv4 w-100 w-50-m w-25-l mw6 shadow-5 center">
        <main className="pa4 black-80">
          <div className="measure">
            <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
              <legend className="f1 fw6 ph0 mh0">Sign In</legend>
              <div className="mt3">
                <label className="db fw6 lh-copy f6" htmlFor="email-address">Email</label>
                <input
                  onChange={onEmailChange}
                  className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100"
                  type="email"
                  name="email-address"
                  id="email-address"
                />
              </div>
              <div className="mv3">
                <label className="db fw6 lh-copy f6" htmlFor="password">Password</label>
                <input
                  onChange={onPasswordChange}
                  className="b pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100"
                  type="password"
                  name="password"
                  id="password"
                />
              </div>
            </fieldset>
            <div className="">
              <input
                onClick={onSubmit}
                className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib"
                type="submit"
                value="Sign in"
              />
            </div>
            <div className="lh-copy mt3">
              <p onClick={() => onRouteChange('register')} className="f6 link dim black db pointer">Register</p>
            </div>
          </div>
        </main>
      </article>
      <p>NOTE:  Please Sign In with same Eamil and Password used in Face Detection App to check the analyzed emotion data.</p>
      <p>If you are not registered in Face Detection App and just want to check the dashboard use</p>
      <p>Email: shubham@mail.com and Password: Caring</p>
    </div>
  );
}

export default Signin;