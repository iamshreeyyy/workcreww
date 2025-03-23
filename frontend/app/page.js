// frontend/app/dashboard/page.js
'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Dashboard() {
  const [milestones, setMilestones] = useState([]);
  const [disputes, setDisputes] = useState([]);
  const [error, setError] = useState('');

  // Fetch recent milestones and disputes for an overview.
  useEffect(() => {
    // Example: fetch all milestones (filter by logged-in user in real implementation)
    axios.get('http://localhost:5000/api/milestones')
      .then(res => setMilestones(res.data.milestones))
      .catch(err => setError('Error fetching milestones'));

    // Example: fetch all disputes (filter by logged-in user in real implementation)
    axios.get('http://localhost:5000/api/disputes')
      .then(res => setDisputes(res.data.disputes))
      .catch(err => setError('Error fetching disputes'));
  }, []);

  return (
    <div>
      <h2>Dashboard</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      <section style={sectionStyle}>
        <h3>Recent Milestones</h3>
        {milestones.length === 0 ? (
          <p>No milestones found.</p>
        ) : (
          <ul>
            {milestones.slice(0, 5).map(milestone => (
              <li key={milestone._id}>
                <strong>{milestone.title}</strong> - Status: {milestone.status}
              </li>
            ))}
          </ul>
        )}
      </section>
      
      <section style={sectionStyle}>
        <h3>Recent Disputes</h3>
        {disputes.length === 0 ? (
          <p>No disputes found.</p>
        ) : (
          <ul>
            {disputes.slice(0, 5).map(dispute => (
              <li key={dispute._id}>
                Milestone: {dispute.milestoneId?.title || dispute.milestoneId} - Status: {dispute.status}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

const sectionStyle = {
  marginBottom: '2rem',
  padding: '1rem',
  border: '1px solid #ccc',
  borderRadius: '4px'
};
