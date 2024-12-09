import React, { useState } from 'react';
import { registerToDB } from '../../../controllers/setUser.ts';
import styles from './Register.module.scss';
import { useUser } from '../../../contexts/UserContext.tsx';

const Register: React.FC = () => {
    const { updateUser } = useUser();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const data = await registerToDB({ firstName, lastName, email, password });
        console.log(data);
        updateUser(data.user);
        if (data) {
            window.location.href = '/login';
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.nav}>
                <a href="/login">Login</a>
                <div className={styles.nav_item}>Register</div>
            </div>

            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="firstName">First Name:</label>
                    <input
                        type="text"
                        id="firstName"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="lastName">Last Name:</label>
                    <input
                        type="text"
                        id="lastName"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Register</button>
            </form>
        </div>
    );
};

export default Register;