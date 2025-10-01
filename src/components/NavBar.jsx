import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';

export default function Navbar() {
  const { currentUser, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <nav className="bg-blue-600 text-white shadow-md">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/dashboard" className="text-2xl font-bold">
          Finance Tracker
        </Link>

        <div className="flex items-center gap-6">
          {currentUser && (
            <>
              <Link
                to="/dashboard"
                className="text-blue-100 hover:text-white transition"
              >
                Dashboard
              </Link>
              <Link
                to="/expenses"
                className="text-blue-100 hover:text-white transition"
              >
                My Expenses
              </Link>
              
              {isAdmin && (
                <Link
                  to="/admin"
                  className="text-blue-100 hover:text-white transition"
                >
                  Admin Panel
                </Link>
              )}

              <span className="font-semibold text-white">
                {currentUser.name}
              </span>

              <button
                onClick={handleLogout}
                className="bg-red-500 px-4 py-2 rounded-lg hover:bg-red-600 transition"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}