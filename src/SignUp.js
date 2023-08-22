import React, { useState } from 'react';
import { Auth } from 'aws-amplify';
import { useNavigate } from 'react-router-dom';

function SignUp() {
    const [formData, setFormData] = useState({ username: '', email: '', password: '' });
    const [confirmationCode, setConfirmationCode] = useState('');
    const [isConfirmationVisible, setIsConfirmationVisible] = useState(false);
    const navigate = useNavigate();

    const signUp = async () => {
        try {
            await Auth.signUp({
                username: formData.email,
                password: formData.password,
                attributes: {
                    name: formData.username,
                    email: formData.email
                }
            });
            setIsConfirmationVisible(true);
        } catch (error) {
            console.log('error signing up:', error);
        }
    }

    const confirmSignUp = async () => {
        try {
            await Auth.confirmSignUp(formData.email, confirmationCode);
            navigate('/login');
        } catch (error) {
            console.log('error confirming sign up:', error);
        }
    }

    if (isConfirmationVisible) {
        return (
            <div>
                <p>Check your email for the confirmation code and input it below:</p>
                <input
                    onChange={e => setConfirmationCode(e.target.value)}
                    placeholder="Confirmation Code"
                    value={confirmationCode}
                />
                <button onClick={confirmSignUp}>Confirm</button>
            </div>
        );
    } else {
        return (
            <div>
                <input
                    onChange={e => setFormData({ ...formData, username: e.target.value })}
                    placeholder="Username"
                    value={formData.username}
                />
                <input
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    placeholder="Email"
                    value={formData.email}
                />
                <input
                    type="password"
                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Password"
                    value={formData.password}
                />
                <button onClick={signUp}>Sign Up</button>
            </div>
        );
    }
}

export default SignUp;
