'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';

function FreelancerDashboardContent() {
  const [milestones, setMilestones] = useState([]);
  const [disputes, setDisputes] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    // Optionally verify user role
    const storedRole = localStorage.getItem('userRole');
    if (storedRole !== 'freelancer') {
      setError('Unauthorized: Not a freelancer.');
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
      { id: 1, message: 'Payment of $50 processed successfully.' },
      { id: 2, message: 'Milestone "Content Review" due tomorrow.' },
    ]);
  }, []);

  if (error === 'Unauthorized: Not a freelancer.') {
    return <p className="text-red-600 text-center mt-8">{error}</p>;
  }

  const totalMilestones = milestones.length;
  const totalDisputes = disputes.length;
  const totalNotifications = notifications.length;

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-extrabold text-gray-800 mb-4">Freelancer Dashboard</h2>
      {error && error !== 'Unauthorized: Not a freelancer.' && (
        <p className="text-red-600 text-center">{error}</p>
      )}

      {/* Summary Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="p-6 bg-white">
          <span className="text-4xl font-bold text-blue-600">{totalMilestones}</span>
          <span className="mt-2 text-gray-600 block">Active Milestones</span>
        </div>
        <div className="p-6 bg-white">
          <span className="text-4xl font-bold text-green-600">{totalDisputes}</span>
          <span className="mt-2 text-gray-600 block">Disputes Involved</span>
        </div>
        <div className="p-6 bg-white">
          <span className="text-4xl font-bold text-indigo-600">{totalNotifications}</span>
          <span className="mt-2 text-gray-600 block">Notifications</span>
        </div>
      </div>

      {/* Work Submissions Section */}
      <section className="p-6 bg-white mt-8">
        <h3 className="text-xl font-bold text-gray-700 mb-2">Work Submissions</h3>
        <Link href="/submissions">
          <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition">
            Submit Work
          </button>
        </Link>
      </section>
    </div>
  );
}

export default function FreelancerDashboardPage() {
  return (
    <ProtectedRoute>
      {/* Updated background container matching Login page */}
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white shadow-md rounded-md p-8 w-full max-w-4xl">
          <FreelancerDashboardContent />
        </div>
      </div>
    </ProtectedRoute>
  );
}
