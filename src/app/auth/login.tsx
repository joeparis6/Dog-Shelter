import React, { useContext, useState } from 'react';
import { login } from '../api';
import { AuthContext } from '../contexts/auth.context';
import Button from '../components/Button';

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
      <div className="max-w-md mx-auto ">
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
        <Button onClick={handleLogin} label="Log In" />
      </div>
    </>
  );
};

export default Login;
