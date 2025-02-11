import React, { useContext } from 'react';
import { AuthContext } from '../contexts/auth.context';
import Login from '../auth/login';
import DogIndex from './dogIndex';

const AppHome = () => {
  const { isAuthorized } = useContext(AuthContext);
  return <>{isAuthorized ? <DogIndex /> : <Login />}</>;
};

export default AppHome;
