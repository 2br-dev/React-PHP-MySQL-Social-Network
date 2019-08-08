import React, { useState } from 'react';
import Login from './Login';

export default function LoginContainer(){
  let [whichForm, setWhichform] = useState(false);
  const changeForm = () => {
    setWhichform(!whichForm);
  }
  return(
      <Login
          onClick={changeForm}
          whichForm={whichForm}
      />
  )
}