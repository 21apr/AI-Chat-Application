import React, { useState } from 'react';
import { loginToDB } from '../../../controllers/userLogin.ts';
import styles from './Register.module.scss';
import { useUser } from '../../../contexts/UserContext.tsx';

const Login: React.FC = () => {
    const { updateUser } = useUser();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const data = await loginToDB({ email, password });
        console.log(data);
        updateUser(data.user);
        if (data) {
            window.location.href = '/';
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.nav}>
                <div className={styles.nav_item}>
                    Login
                </div>

                <a href="/register">Register</a>

            </div>

            <form onSubmit={handleSubmit}>
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
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default Login;