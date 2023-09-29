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
import SignIn from './SignIn'; // Import your SignIn component
import SignUp from './SignUp'; // Import your SignUp component
// ... other components ...
import './index.css'

Amplify.configure(config);

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>  {/* Add the AuthProvider here */}
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
    document.documentElement.className = theme; // Add this line

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
        {/* Route for homepage */}
        <Route path="/" element={user ? <ThreadList isAuthenticated={!!user} theme={theme} /> : <ThreadList isAuthenticated={false} theme={theme} />} />

        {/* Route for login */}
        <Route path="/login" element={<SignIn />} />

        {/* Route for sign up */}
        <Route path="/signup" element={<SignUp />} />

        {/* Route for thread detail (only if authenticated) */}
        {user && <Route path="/threads/:id" element={<ThreadDetail theme={theme} />} />}

        {/* Default 404 route */}
        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </>
  );
}

export default App;
