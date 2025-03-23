'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';

function SubmissionsContent() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    milestoneId: '',
    submissionDetails: '',
  });
  const [submissions, setSubmissions] = useState([]);
  const [error, setError] = useState('');
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [loadingSubmissions, setLoadingSubmissions] = useState(true);

  // Fetch user's submissions on mount (if using a freelancer's ID from localStorage, add it here)
  useEffect(() => {
    // Optionally, if you have a freelancer id, you can include it as a query parameter.
    axios
      .get('http://localhost:5000/api/submissions')
      .then((res) => {
        setSubmissions(res.data.submissions);
        setLoadingSubmissions(false);
      })
      .catch(() => {
        setError('Error fetching submissions');
        setLoadingSubmissions(false);
      });
  }, []);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Basic validation
    if (!formData.milestoneId || !formData.submissionDetails) {
      setError('Please fill in all required fields.');
      return;
    }
    setError('');
    setLoadingSubmit(true);
    try {
      await axios.post('http://localhost:5000/api/submissions', formData);
      // Optionally, refresh the submissions list after submission
      const res = await axios.get('http://localhost:5000/api/submissions');
      setSubmissions(res.data.submissions);
      setFormData({ milestoneId: '', submissionDetails: '' });
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Failed to submit work');
    } finally {
      setLoadingSubmit(false);
    }
  };

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-4">Work Submissions</h2>
      {error && <p className="text-red-500">{error}</p>}

      {/* Submission Form */}
      <div className="bg-white shadow-md rounded-md p-8 w-full max-w-md">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">Submit Your Work</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-1">
              Milestone ID<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="milestoneId"
              value={formData.milestoneId}
              onChange={handleChange}
              placeholder="Enter milestone ID"
              className="w-full px-3 py-2 bg-gray-200 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-1">
              Submission Details<span className="text-red-500">*</span>
            </label>
            <textarea
              name="submissionDetails"
              value={formData.submissionDetails}
              onChange={handleChange}
              placeholder="Provide details of your work..."
              rows="4"
              className="w-full px-3 py-2 bg-gray-200 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            ></textarea>
          </div>
          <button
            type="submit"
            disabled={loadingSubmit}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loadingSubmit ? 'Submitting...' : 'Submit Work'}
          </button>
        </form>
      </div>

      {/* Submissions List */}
      <div>
        <h3 className="text-2xl font-bold text-gray-800 mb-4">Your Submissions</h3>
        {loadingSubmissions ? (
          <p className="text-gray-600">Loading submissions...</p>
        ) : submissions.length === 0 ? (
          <p className="text-gray-500">No submissions found.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {submissions.map((submission) => (
              <div key={submission._id} className="bg-white p-6 rounded-md shadow hover:shadow-lg transition duration-200">
                <p className="text-lg font-semibold text-gray-800">Milestone: {submission.milestoneId?.title || submission.milestoneId}</p>
                <p className="text-gray-600 mt-2">{submission.submissionDetails}</p>
                <p className="text-gray-500 mt-2 text-sm">Status: {submission.status}</p>
                {submission.feedback && (
                  <p className="text-gray-500 mt-2 text-sm">Feedback: {submission.feedback}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function SubmissionsPage() {
  return (
    <ProtectedRoute>
      {/* Using a background container similar to Login page */}
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white shadow-md rounded-md p-8 w-full max-w-6xl">
          <SubmissionsContent />
        </div>
      </div>
    </ProtectedRoute>
  );
}
