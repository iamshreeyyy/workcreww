'use client';
import { useRouter } from 'next/navigation';

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = () => {
    // Remove token and userRole from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    // Use router.replace to navigate to the login page
    router.replace('/login');
    // Alternatively, as a fallback:
    // window.location.href = '/login';
  };

  return (
    <button onClick={handleLogout} style={buttonStyle}>
      Logout
    </button>
  );
}

const buttonStyle = {
  background: 'transparent',
  border: 'none',
  color: '#fff',
  fontSize: '1rem',
  cursor: 'pointer',
};
 