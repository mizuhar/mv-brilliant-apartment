import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase.js';
import styles from './AdminLogin.module.css';

export default function AdminLogin({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      if (onLoginSuccess) onLoginSuccess();
    } catch (err) {
  console.error("Firebase Auth Full Error:", err);
  console.log("Error Code:", err.code);
  console.log("Error Message:", err.message);
  setError('Невалиден имейл или парола!');
}
  };

  return (
    <div className={styles.loginContainer}>
      <form onSubmit={handleLogin} className={styles.loginCard}>
        <h2>Администраторски Вход</h2>
        {error && <p className={styles.error}>{error}</p>}
        
        <div className={styles.inputGroup}>
          <label>Имейл</label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
        </div>

        <div className={styles.inputGroup}>
          <label>Парола</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
        </div>

        <button type="submit" className={styles.loginBtn}>Вход</button>
      </form>
    </div>
  );
}