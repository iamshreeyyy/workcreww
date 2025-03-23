'use client';

import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function Register() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'freelancer', // Default role is freelancer; employer option is labeled "Client"
  });
  const [error, setError] = useState('');

  // Update form data on input change
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // Handle registration submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send registration data to the backend
      const res = await axios.post('http://localhost:5000/api/auth/register', formData);
      
      // Store the received token in localStorage
      localStorage.setItem('token', res.data.token);
      // Also store the user role for later role-based redirection
      localStorage.setItem('userRole', res.data.user.role);
      
      // Redirect to the appropriate dashboard based on role
      if (res.data.user.role === 'employer') {
        router.push('/employer/dashboard');
      } else {
        router.push('/freelancer/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '400px', margin: '0 auto' }}>
      <h1>Register</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <input type="text" name="username" placeholder="Username" value={formData.username} onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
        <select name="role" value={formData.role} onChange={handleChange}>
          <option value="freelancer">Freelancer</option>
          <option value="employer">Employer</option>
        </select>
        <button type="submit">Register</button>
      </form>
    </div>
  );
}