import { createContext, useContext, ReactNode, useState } from 'react';

interface SessionContextType {
  user: any; // Replace 'any' with your user type
  setUser: (user: any) => void; // Replace 'any' with your user type
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const SessionProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any>(null); // Replace 'any' with your user type

  return (
    <SessionContext.Provider value={{ user, setUser }}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
};