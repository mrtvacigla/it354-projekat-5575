import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

export default function Navbar() {
  const { currentUser, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <nav className="bg-blue-600 text-white shadow-lg rounded-xl">
      <div className="container mx-auto px-4 py-4  flex justify-between items-center">
        <Link to="/dashboard" className="text-2xl text-white font-bold pr-20 hover:text-white hover:underline">
          Finance Tracker - Jova Paunovic 5575
        </Link>

        <div className="flex gap-4 items-center">
          {currentUser && (
            <>
              {!isAdmin && (
                <Link to="/dashboard" className="hover:text-white hover:underline text-white">
                Dashboard
              </Link>
              )}
              
              <Link to="/expenses" className="hover:underline hover:text-white text-white ">
                My Expenses
              </Link>
              
              {isAdmin && (
                <Link to="/admin" className="hover:text-white hover:underline text-white ">
                  Admin Panel
                </Link>
              )}

              <span className="text-white">
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