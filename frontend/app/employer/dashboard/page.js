'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';

function EmployerDashboardContent() {
  const [milestones, setMilestones] = useState([]);
  const [disputes, setDisputes] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    // Optionally verify user role here if you want an extra check
    const storedRole = localStorage.getItem('userRole');
    if (storedRole !== 'employer') {
      setError('Unauthorized: Not an employer.');
      return;
    }

    // Fetch milestones
    axios.get('http://localhost:5000/api/milestones')
      .then((res) => setMilestones(res.data.milestones))
      .catch(() => setError('Error fetching milestones'));

    // Fetch disputes
    axios.get('http://localhost:5000/api/disputes')
      .then((res) => setDisputes(res.data.disputes))
      .catch(() => setError('Error fetching disputes'));

    // Simulate notifications
    setNotifications([
      { id: 1, message: 'Milestone "Design Homepage" approved.' },
      { id: 2, message: 'New dispute raised for milestone "Build API".' },
    ]);
  }, []);

  if (error === 'Unauthorized: Not an employer.') {
    return <p className="text-red-600 text-center mt-8">{error}</p>;
  }

  const totalMilestones = milestones.length;
  const totalDisputes = disputes.length;
  const totalNotifications = notifications.length;

  return (
    <div className="mt-6 mx-4">
      <h2 className="text-3xl font-extrabold text-gray-800 mb-4">Employer Dashboard</h2>
      {error && error !== 'Unauthorized: Not an employer.' && (
        <p className="text-red-600 text-center">{error}</p>
      )}

      {/* Example summary cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="p-6 bg-white">
          <span className="text-4xl font-bold text-blue-600">{totalMilestones}</span>
          <span className="mt-2 text-gray-600 block">Total Milestones</span>
        </div>
        <div className="p-6 bg-white">
          <span className="text-4xl font-bold text-green-600">{totalDisputes}</span>
          <span className="mt-2 text-gray-600 block">Total Disputes</span>
        </div>
        <div className="p-6 bg-white">
          <span className="text-4xl font-bold text-indigo-600">{totalNotifications}</span>
          <span className="mt-2 text-gray-600 block">Notifications</span>
        </div>
      </div>

      {/* Milestones and Disputes sections, upcoming tasks, etc. */}
      <section className="p-6 bg-white mt-8">
        <h3 className="text-xl font-bold text-gray-700 mb-2">Manage Your Projects</h3>
        <Link href="/milestones" className="bg-blue-600 text-white px-4 py-2 hover:bg-blue-700 transition">
          Create / Manage Milestones
        </Link>
      </section>
    </div>
  );
}

export default function EmployerDashboardPage() {
  return (
    <ProtectedRoute>
      <div>
        <EmployerDashboardContent />
      </div>
    </ProtectedRoute>
  );
}
