import { createContext, Dispatch, ReactNode, SetStateAction, useState } from 'react';

type Props = {
  children: ReactNode;
};

type AuthContextType = {
  isAuthorized: boolean;
  setIsAuthorized?: Dispatch<SetStateAction<boolean>>;
};

export const AuthContext = createContext<AuthContextType>({ isAuthorized: false });

export const AuthProvider = (props: Props) => {
  const { children } = props;
  const [isAuthorized, setIsAuthorized] = useState<boolean>(false);

  return <AuthContext.Provider value={{ isAuthorized, setIsAuthorized }}>{children}</AuthContext.Provider>;
};
