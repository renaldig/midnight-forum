import React, { useState } from 'react';
import { Auth } from 'aws-amplify';
import { useAuth } from './AuthContext';  // Import the useAuth hook

function SignIn() {
    const [formData, setFormData] = useState({email: '', password: ''});
    const { setUser } = useAuth();  // Get the setUser function from the context

    const signIn = async () => {
        try {
            const user = await Auth.signIn(formData.email, formData.password);
            console.log(user);
            setUser(user);  // Update the user in the context after a successful sign-in

            // Redirect to root and cause a full page refresh
            window.location.href = "/";
        } catch (error) {
            console.log('error signing in', error);
        }
    }

    return (
        <div>
            <input onChange={e => setFormData({ ...formData, email: e.target.value })} placeholder="Email" />
            <input type="password" onChange={e => setFormData({ ...formData, password: e.target.value })} placeholder="Password" />
            <button onClick={signIn}>Sign In</button>
        </div>
    );
}

export default SignIn;
