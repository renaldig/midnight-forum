import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';
import { Amplify, Auth } from 'aws-amplify';
import config from './aws-exports';
import { withAuthenticator } from '@aws-amplify/ui-react';
import ThreadDetail from './ThreadDetail';
import NavBar from './NavBar';
import ThreadList from './ThreadList';
import CreateThread from './CreateThread';
import { ThemeProvider, useTheme } from './ThemeContext';
import { AuthProvider } from './AuthContext';
import { useAuth } from './AuthContext';
import SignIn from './SignIn';
import SignUp from './SignUp';
import './index.css'

Amplify.configure(config);

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

function AppContent() {
  const { theme } = useTheme();
  const { user, setUser } = useAuth();

  React.useEffect(() => {
    document.body.className = theme;
    document.documentElement.className = theme;

    // Check if user is authenticated
    Auth.currentAuthenticatedUser()
      .then(currentUser => setUser(currentUser))
      .catch(err => setUser(null));
  }, [theme, setUser]);

  return (
    <>
      <NavBar />
      {user && (
        <nav>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <CreateThread />
          </div>
        </nav>
      )}
      <Routes>
        <Route path="/" element={user ? <ThreadList isAuthenticated={!!user} theme={theme} /> : <ThreadList isAuthenticated={false} theme={theme} />} />
        <Route path="/login" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        {user && <Route path="/threads/:id" element={<ThreadDetail theme={theme} />} />}
        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </>
  );
}

export default App;
