import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const features = [
  {
    icon: '🔐',
    title: 'Secure Authentication',
    text: 'JWT-based login with role-based access. Admin and user roles with protected routes.',
  },
  {
    icon: '📋',
    title: 'Full Employee CRUD',
    text: 'Add, view, edit, and delete employee records with real-time validation.',
  },
  {
    icon: '🔍',
    title: 'Search & Filter',
    text: 'Search by name, email, or position. Filter by department and sort by salary or hire date.',
  },
  {
    icon: '📊',
    title: 'Admin Dashboard',
    text: 'Aggregate stats: total headcount, average salary, highest-paid, and department breakdown.',
  },
];

export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <>
      <section className="home-hero">
        <div className="home-hero-content">
          <h1 className="home-title">
            <span>Employee</span> Management<br />System
          </h1>
          <p className="home-description">
            A full-stack MERN platform for managing your workforce. Admin-controlled CRUD,
            JWT authentication, role-based access, and a real-time stats dashboard.
          </p>
          <div className="home-cta">
            {user ? (
              <button className="btn btn-primary btn-lg" onClick={() => navigate('/employees')}>
                Go to Employees
              </button>
            ) : (
              <>
                <Link to="/login" className="btn btn-primary btn-lg">
                  Sign In
                </Link>
                <Link to="/register" className="btn btn-outline btn-lg">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>

        <div className="home-features">
          {features.map((f) => (
            <div className="feature-card" key={f.title}>
              <div className="feature-icon">{f.icon}</div>
              <p className="feature-title">{f.title}</p>
              <p className="feature-text">{f.text}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
