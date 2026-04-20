import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate('/');
  };

  const close = () => setMenuOpen(false);
  const firstName = user?.name?.split(' ')[0] || 'User';

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand" onClick={close}>
          EMS
        </Link>

        <button
          className="navbar-hamburger"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          <span />
          <span />
          <span />
        </button>

        <ul className={`navbar-nav${menuOpen ? ' open' : ''}`}>
          {!user ? (
            <>
              <li>
                <NavLink to="/" end onClick={close}>
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink to="/login" onClick={close}>
                  Sign In
                </NavLink>
              </li>
              <li>
                <NavLink to="/register" onClick={close}>
                  Sign Up
                </NavLink>
              </li>
            </>
          ) : (
            <>
              <li>
                <NavLink to="/employees" onClick={close}>
                  Employees
                </NavLink>
              </li>
              {user.role === 'admin' && (
                <>
                  <li>
                    <NavLink to="/admin/stats" onClick={close}>
                      Stats
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/employees/new" onClick={close}>
                      Add Employee
                    </NavLink>
                  </li>
                </>
              )}
              <li>
                <span className="navbar-user">Hi, {firstName}</span>
              </li>
              <li>
                <button className="nav-btn nav-logout" onClick={handleLogout}>
                  Logout
                </button>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}
