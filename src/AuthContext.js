import React from 'react';
import { Auth } from 'aws-amplify';

const AuthContext = React.createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = React.useState(null);

  // Check if user is authenticated
  React.useEffect(() => {
    Auth.currentAuthenticatedUser()
      .then(currentUser => setUser(currentUser))
      .catch(err => setUser(null));
  }, []);

  // Add the logout function
  const logout = async () => {
    try {
      await Auth.signOut();
      setUser(null);
    } catch (error) {
      console.error('Error signing out: ', error);
    }
  };

  return (
    // Provide the logout function as well
    <AuthContext.Provider value={{ user, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return React.useContext(AuthContext);
}
