import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../utils/api';

function formatSalary(n) {
  if (!n && n !== 0) return '—';
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);
}

function formatDateRelative(d) {
  if (!d) return '—';
  const diff = Math.floor((Date.now() - new Date(d)) / (1000 * 60 * 60 * 24));
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Yesterday';
  if (diff < 30) return `${diff} days ago`;
  if (diff < 365) return `${Math.floor(diff / 30)} months ago`;
  return `${Math.floor(diff / 365)} years ago`;
}

export default function AdminStats() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/api/employees/stats/summary')
      .then(({ data }) => setStats(data.data))
      .catch((err) => {
        toast.error(err.response?.data?.message || 'Failed to load stats');
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="page-loading">
        <div className="spinner" />
      </div>
    );
  }

  if (!stats) return null;

  const maxCount =
    stats.departmentBreakdown.length > 0
      ? Math.max(...stats.departmentBreakdown.map((d) => d.count))
      : 1;

  return (
    <div className="page-wrapper">
      <div className="page-title-row">
        <h1 className="page-title">Admin Dashboard</h1>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <p className="stat-card-label">Total Employees</p>
          <p className="stat-card-value">{stats.totalEmployees}</p>
          <p className="stat-card-sub">across all departments</p>
        </div>

        <div className="stat-card">
          <p className="stat-card-label">Average Salary</p>
          <p className="stat-card-value">{formatSalary(stats.averageSalary)}</p>
          <p className="stat-card-sub">company-wide average</p>
        </div>

        <div className="stat-card">
          <p className="stat-card-label">Highest Paid</p>
          <p className="stat-card-value" style={{ fontSize: '1.25rem', marginTop: 4 }}>
            {stats.highestPaid?.name || '—'}
          </p>
          <p className="stat-card-sub">
            {stats.highestPaid ? formatSalary(stats.highestPaid.salary) : '—'}
          </p>
        </div>

        <div className="stat-card">
          <p className="stat-card-label">Newest Hire</p>
          <p className="stat-card-value" style={{ fontSize: '1.25rem', marginTop: 4 }}>
            {stats.newestHire?.name || '—'}
          </p>
          <p className="stat-card-sub">
            {stats.newestHire ? formatDateRelative(stats.newestHire.hireDate) : '—'}
          </p>
        </div>
      </div>

      {stats.departmentBreakdown.length > 0 && (
        <div className="dept-breakdown-card">
          <h2 className="dept-section-title">Department Breakdown</h2>
          <div className="dept-list">
            {stats.departmentBreakdown.map((dept) => (
              <div className="dept-list-item" key={dept.department}>
                <span className="dept-list-name">{dept.department}</span>
                <div className="dept-bar-track">
                  <div
                    className="dept-bar-fill"
                    style={{ width: `${(dept.count / maxCount) * 100}%` }}
                  />
                </div>
                <span className="dept-list-count">{dept.count}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
