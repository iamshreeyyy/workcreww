// frontend/app/layout.js
import Link from 'next/link';
import NavBar from '@/components/NavBar';
import LogoutButton from '@/components/LogoutButton';
import './globals.css';

export const metadata = {
  title: 'Freelancer Payments Platform',
  description: 'Dashboard for managing milestones, disputes, work submissions, and payments.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Additional fonts or meta tags can be added here */}
      </head>
      <body className="bg-gray-100">
        <header className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4">
          <div className="container mx-auto flex items-center justify-between px-4">
            <h1 className="text-2xl font-bold">
              <Link href="/dashboard">Freelancer Payments Platform</Link>
            </h1>
            <div className="flex items-center space-x-4">
              <NavBar />
              <LogoutButton />
            </div>
          </div>
        </header>
        <main className="container mx-auto px-4 py-6">{children}</main>
        <footer className="text-center py-4 text-gray-500">
          © {new Date().getFullYear()} Freelancer Payments Platform
        </footer>
      </body>
    </html>
  );
}
