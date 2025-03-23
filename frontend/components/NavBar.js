'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function NavBar() {
  const [role, setRole] = useState('');

  useEffect(() => {
    // Function to update role from localStorage
    const updateRole = () => {
      const storedRole = localStorage.getItem('userRole') || '';
      setRole(storedRole);
    };

    // Update on mount
    updateRole();

    // Listen for storage changes (works in other tabs)
    window.addEventListener('storage', updateRole);

    return () => window.removeEventListener('storage', updateRole);
  }, []);

  return (
    <nav className="flex items-center space-x-4">
      <Link href="/" className="hover:underline">Home</Link>
      {role === 'employer' ? (
        <>
          <Link href="/employer/dashboard" className="hover:underline">Dashboard</Link>
          <Link href="/milestones" className="hover:underline">Milestones</Link>
          <Link href="/disputes" className="hover:underline">Disputes</Link>
          <Link href="/payment" className="hover:underline">Payment</Link>
        </>
      ) : role === 'freelancer' ? (
        <>
          <Link href="/freelancer/dashboard" className="hover:underline">Dashboard</Link>
          <Link href="/submissions" className="hover:underline">Submissions</Link>
          <Link href="/payment" className="hover:underline">Payment</Link>
        </>
      ) : (
        // Fallback if role is not set yet
        <Link href="/dashboard" className="hover:underline">Dashboard</Link>
      )}
      <Link href="/profile" className="hover:underline">Profile</Link>
    </nav>
  );
}
