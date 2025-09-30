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
    <nav className="bg-blue-600 text-white shadow-lg rounded-xl ">
      <div className="container mx-auto px-4 py-4  flex justify-between items-center">
        <Link to="/dashboard" className="text-2xl font-bold pr-20">
          Finance Tracker - Jova Paunovic 5575
        </Link>

        <div className="flex gap-4 items-center">
          {currentUser && (
            <>
              <Link to="/dashboard" className="hover:text-blue-200">
                Dashboard
              </Link>
              <Link to="/expenses" className="hover:text-blue-200">
                My Expenses
              </Link>
              
              {isAdmin && (
                <Link to="/admin" className="hover:text-blue-200">
                  Admin Panel
                </Link>
              )}

              <span className="text-blue-200">
                {currentUser.name}
              </span>

              <button
                onClick={handleLogout}
                className="bg-red-500 px-4 py-2 rounded hover:bg-red-600"
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