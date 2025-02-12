import React, { useContext, useState } from 'react';
import { login } from '../api';
import { AuthContext } from '../contexts/auth.context';

type Login = {
  name: string;
  email: string;
};

const Login = () => {
  const { setIsAuthorized } = useContext(AuthContext);

  const [loginInfo, setLoginInfo] = useState<Login>({ name: '', email: '' });

  const handleLogin = async () => {
    try {
      const loginResult = await login(loginInfo);
      if (loginResult.ok) {
        setIsAuthorized(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div>
        <h1>Login</h1>
        <label htmlFor="name">Name</label>
        <input
          type="text"
          id="name"
          name="name"
          onChange={(e) => setLoginInfo({ ...loginInfo, name: e.target.value })}
        />
        <label htmlFor="email">Email:</label>
        <input
          type="text"
          id="email"
          name="email"
          onChange={(e) => setLoginInfo({ ...loginInfo, email: e.target.value })}
        />
      </div>
      <button onClick={handleLogin}>Log In</button>
      <></>
    </>
  );
};

export default Login;
