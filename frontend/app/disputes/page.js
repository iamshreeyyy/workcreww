'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import ProtectedRoute from '@/components/ProtectedRoute';

function DisputesContent() {
  const [disputes, setDisputes] = useState([]);
  const [newDispute, setNewDispute] = useState({
    milestoneId: '',
    raisedBy: '',
    description: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Fetch disputes on mount
  useEffect(() => {
    axios
      .get('http://localhost:5000/api/disputes')
      .then((res) => {
        setDisputes(res.data.disputes);
        setLoading(false);
      })
      .catch(() => {
        setError('Error fetching disputes');
        setLoading(false);
      });
  }, []);

  const handleChange = (e) => {
    setNewDispute({ ...newDispute, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Basic validation: required fields
    if (!newDispute.milestoneId || !newDispute.raisedBy || !newDispute.description) {
      setError('Please fill in all required fields.');
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      await axios.post('http://localhost:5000/api/disputes', newDispute);
      // Refresh disputes list
      const res = await axios.get('http://localhost:5000/api/disputes');
      setDisputes(res.data.disputes);
      // Reset form
      setNewDispute({ milestoneId: '', raisedBy: '', description: '' });
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Failed to submit dispute');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-4">Disputes</h2>
      
      {error && <p className="text-red-500">{error}</p>}
      
      {/* Form to raise a new dispute */}
      <div className="bg-white shadow-md rounded-md p-8 w-full max-w-md">
        <h3 className="text-2xl font-semibold mb-4 text-gray-800">Raise a New Dispute</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-1">
              Milestone ID<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="milestoneId"
              value={newDispute.milestoneId}
              onChange={handleChange}
              placeholder="Enter milestone ID"
              className="w-full px-3 py-2 bg-gray-200 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-1">
              Raised By<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="raisedBy"
              value={newDispute.raisedBy}
              onChange={handleChange}
              placeholder="Enter your user ID"
              className="w-full px-3 py-2 bg-gray-200 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-1">
              Description<span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              value={newDispute.description}
              onChange={handleChange}
              placeholder="Describe the dispute..."
              rows="4"
              className="w-full px-3 py-2 bg-gray-200 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            ></textarea>
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
          >
            {submitting ? 'Submitting...' : 'Submit Dispute'}
          </button>
        </form>
      </div>

      {/* Disputes List */}
      <div>
        <h3 className="text-2xl font-bold text-gray-800 mb-4">Existing Disputes</h3>
        {loading ? (
          <p className="text-gray-600">Loading disputes...</p>
        ) : disputes.length === 0 ? (
          <p className="text-gray-500">No disputes found.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {disputes.map((d) => (
              <div
                key={d._id}
                className="bg-white p-6 rounded-md shadow hover:shadow-lg transition duration-200"
              >
                <p className="text-lg font-semibold text-gray-800">
                  Milestone: {d.milestoneId?.title || d.milestoneId}
                </p>
                <p className="text-gray-600 mt-2">{d.description}</p>
                <p className="text-gray-500 mt-2 text-sm">Status: {d.status}</p>
                {d.resolution && (
                  <p className="text-gray-500 mt-2 text-sm">Resolution: {d.resolution}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function DisputesPage() {
  return (
    <ProtectedRoute>
      {/* Container with same background as other pages */}
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white shadow-md rounded-md p-8 w-full max-w-6xl">
          <DisputesContent />
        </div>
      </div>
    </ProtectedRoute>
  );
}
