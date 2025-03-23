'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import ProtectedRoute from '@/components/ProtectedRoute';

function ReviewSubmissionsContent() {
  const [submissions, setSubmissions] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    // Fetch all submissions to review
    axios
      .get('http://localhost:5000/api/submissions')
      .then((res) => {
        setSubmissions(res.data.submissions);
        setLoading(false);
      })
      .catch(() => {
        setError('Error fetching submissions');
        setLoading(false);
      });
  }, []);

  const handleUpdate = async (submissionId, status) => {
    let feedback = '';
    if (status === 'rejected') {
      feedback = prompt('Enter feedback for rejection:');
      if (feedback === null) return; // Cancel update if prompt is cancelled
    }
    setUpdating(true);
    try {
      await axios.put(`http://localhost:5000/api/submissions/${submissionId}`, { status, feedback });
      // Refresh the submissions list after update
      const res = await axios.get('http://localhost:5000/api/submissions');
      setSubmissions(res.data.submissions);
    } catch (err) {
      setError('Error updating submission');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-4">Review Work Submissions</h2>
      {error && <p className="text-red-500">{error}</p>}
      {loading ? (
        <p className="text-gray-600">Loading submissions...</p>
      ) : submissions.length === 0 ? (
        <p className="text-gray-500">No submissions to review.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {submissions.map((sub) => (
            <div
              key={sub._id}
              className="bg-white p-6 rounded-md shadow hover:shadow-lg transition duration-200"
            >
              <p className="text-lg font-semibold text-gray-800">
                Milestone: {sub.milestoneId?.title || sub.milestoneId}
              </p>
              <p className="text-gray-600 mt-2">{sub.submissionDetails}</p>
              <p className="text-gray-500 mt-2 text-sm">Status: {sub.status}</p>
              {sub.feedback && (
                <p className="text-gray-500 mt-2 text-sm">Feedback: {sub.feedback}</p>
              )}
              <div className="mt-4 flex justify-between gap-2">
                <button
                  onClick={() => handleUpdate(sub._id, 'approved')}
                  disabled={updating || sub.status === 'approved'}
                  className="flex-1 bg-green-600 text-white py-2 rounded hover:bg-green-700 transition disabled:opacity-50"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleUpdate(sub._id, 'rejected')}
                  disabled={updating || sub.status === 'rejected'}
                  className="flex-1 bg-red-600 text-white py-2 rounded hover:bg-red-700 transition disabled:opacity-50"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ReviewSubmissionsPage() {
  return (
    <ProtectedRoute>
      {/* Using a container similar to your other pages */}
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white shadow-md rounded-md p-8 w-full max-w-6xl">
          <ReviewSubmissionsContent />
        </div>
      </div>
    </ProtectedRoute>
  );
}
