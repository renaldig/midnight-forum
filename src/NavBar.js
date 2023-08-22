import React from 'react';
import { Auth } from 'aws-amplify';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from './ThemeContext';
import { useAuth } from './AuthContext';  // 1. Import the useAuth hook

function NavBar() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();  // 2. Access the user and logout function

  // Modified to use logout from context
  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");  // Redirect to home after logout
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleLogin = () => {
    navigate("/login");  // Assuming you have a /login route for Amplify authentication
  };

  const handleSignUp = () => {
    navigate("/signup");  // Assuming you have a /signup route for Amplify authentication
  };

  return (
    <div className={`navbar ${theme}`}>
      <div className="nav-left">
        <Link to="/" className="mysterious-text">Midnight Forum</Link>
      </div>
      <div className="nav-right">
        {
          user  // Check if the user is authenticated using the user from context
            ? (
                <>
                  <button onClick={handleLogout}>Log Out</button>
                  <button onClick={toggleTheme}>
                    {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
                  </button>
                </>
              )
            : (
                <>
                  <button onClick={handleLogin}>Log In</button>
                  <button onClick={handleSignUp}>Sign Up</button>
                </>
              )
        }
      </div>
    </div>
  );
}

export default NavBar;
