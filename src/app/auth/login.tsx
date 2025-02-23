import React, { useContext, useState } from 'react';
import { login } from '../api';
import { AuthContext } from '../contexts/auth.context';
import Button from '../components/Button';
import TextInput from '../components/TextInput';

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
      if (loginResult.ok && setIsAuthorized) {
        setIsAuthorized(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className=" grid place-items-center">
      <div className="max-w-xl bg-green-900 flex-column">
        <TextInput
          value={loginInfo?.name ?? ''}
          label="Name"
          onChange={(nameInput) => setLoginInfo({ ...loginInfo, name: nameInput })}
        />
        <TextInput
          value={loginInfo?.email ?? ''}
          label="Email"
          onChange={(emailInput) => setLoginInfo({ ...loginInfo, name: emailInput })}
        />
        <Button onClick={handleLogin} label="Log In" />
      </div>
    </div>
  );
};

export default Login;
