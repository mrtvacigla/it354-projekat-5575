import React from 'react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { userService } from '../services/userService';
import { expenseService } from '../services/expenseService';
import { categoryService } from '../services/categoryService';

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [usersData, expensesData, categoriesData] = await Promise.all([
        userService.getAll(),
        expenseService.getAll(),
        categoryService.getAll()
      ]);
      setUsers(usersData);
      setExpenses(expensesData);
      setCategories(categoriesData);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  }

  const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  if (loading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-gray-600 text-sm font-semibold">Total Users</h3>
            <p className="text-3xl font-bold text-blue-600">{users.length}</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-gray-600 text-sm font-semibold">Total Expenses</h3>
            <p className="text-3xl font-bold text-green-600">{expenses.length}</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-gray-600 text-sm font-semibold">Total Spent</h3>
            <p className="text-3xl font-bold text-purple-600">${totalSpent.toFixed(2)}</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-gray-600 text-sm font-semibold">Categories</h3>
            <p className="text-3xl font-bold text-orange-600">{categories.length}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link
            to="/admin/users"
            className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition"
          >
            <h2 className="text-xl font-bold mb-2">👥 Manage Users</h2>
            <p className="text-gray-600">View and delete user accounts</p>
          </Link>

          <Link
            to="/admin/categories"
            className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition"
          >
            <h2 className="text-xl font-bold mb-2">📁 Manage Categories</h2>
            <p className="text-gray-600">Add, edit, and delete expense categories</p>
          </Link>
        </div>

        <div className="bg-white p-6 rounded-lg shadow mt-8">
          <h2 className="text-xl font-bold mb-4">Recent Expenses (All Users)</h2>
          <div className="space-y-2">
            {expenses.slice(-10).reverse().map(expense => {
              const user = users.find(u => u.id === expense.userId);
              return (
                <div key={expense.id} className="flex justify-between items-center border-b pb-2">
                  <div>
                    <p className="font-semibold">{expense.description}</p>
                    <p className="text-sm text-gray-600">
                      {user?.name || 'Unknown'} • {expense.category} • {expense.date}
                    </p>
                  </div>
                  <p className="text-lg font-bold">${expense.amount.toFixed(2)}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}