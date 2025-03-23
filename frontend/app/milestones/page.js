'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';

function MilestonesContent() {
  const [milestones, setMilestones] = useState([]);
  const [filteredMilestones, setFilteredMilestones] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch milestones on mount
  useEffect(() => {
    axios
      .get('http://localhost:5000/api/milestones')
      .then((res) => {
        setMilestones(res.data.milestones);
        setFilteredMilestones(res.data.milestones);
        setLoading(false);
      })
      .catch(() => {
        setError('Error fetching milestones');
        setLoading(false);
      });
  }, []);

  // Filter milestones based on search term
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredMilestones(milestones);
    } else {
      const filtered = milestones.filter((m) =>
        m.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredMilestones(filtered);
    }
  }, [searchTerm, milestones]);

  // Handler for Delete action
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/milestones/${id}`);
      const updated = milestones.filter((m) => m._id !== id);
      setMilestones(updated);
      setFilteredMilestones(updated);
    } catch (err) {
      setError('Failed to delete milestone');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600 text-lg">Loading milestones...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header with Search and Create Button */}
      <div className="flex flex-col sm:flex-row items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-800">Milestones</h2>
        <div className="flex items-center space-x-4 mt-4 sm:mt-0">
          <input
            type="text"
            placeholder="Search milestones..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Link href="/milestones/create">
            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
              Create Milestone
            </button>
          </Link>
        </div>
      </div>

      {error && <p className="text-red-600">{error}</p>}

      {filteredMilestones.length === 0 ? (
        <p className="text-gray-500">No milestones available.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {filteredMilestones.map((m) => (
            <div
              key={m._id}
              className="bg-white p-6 rounded-lg hover:shadow-lg transition duration-200"
            >
              <h3 className="text-xl font-semibold text-gray-800">{m.title}</h3>
              <p className="text-gray-600 mt-2">
                Status: <span className="font-medium">{m.status}</span>
              </p>
              <p className="text-gray-600 mt-1">Amount: ${m.amount}</p>
              {m.dueDate && (
                <p className="text-gray-600 mt-1">
                  Due: {new Date(m.dueDate).toLocaleDateString()}
                </p>
              )}
              <div className="mt-4 flex space-x-2">
                <Link href={`/milestones?id=${m._id}`}>
                  <button className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">
                    View Details
                  </button>
                </Link>
                <Link href={`/milestones/edit?id=${m._id}`}>
                  <button className="flex-1 bg-green-600 text-white py-2 rounded hover:bg-green-700 transition">
                    Edit
                  </button>
                </Link>
                <button
                  onClick={() => handleDelete(m._id)}
                  className="flex-1 bg-red-600 text-white py-2 rounded hover:bg-red-700 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function MilestonesPage() {
  return (
    <ProtectedRoute>
      {/* Container with same background as Login page */}
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white shadow-md rounded-md p-8 w-full max-w-6xl">
          <MilestonesContent />
        </div>
      </div>
    </ProtectedRoute>
  );
}
