import React from 'react';
import { useState, useEffect } from 'react';
import { useAuth } from '../components/AuthContext';
import { expenseService } from '../services/expenseService';
import { categoryService } from '../services/categoryService';
import PieChart from '../charts/PieChart';
import BarChart from '../charts/BarChart';

export default function Dashboard() {
  const { currentUser } = useAuth();
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [expensesData, categoriesData] = await Promise.all([
        expenseService.getByUserId(currentUser.id),
        categoryService.getAll()
      ]);
      setExpenses(expensesData);
      setCategories(categoriesData);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  }

  const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  const pieData = categories.map(cat => {
    const categoryTotal = expenses
      .filter(exp => exp.category === cat.name)
      .reduce((sum, exp) => sum + exp.amount, 0);
    
    return {
      label: cat.name,
      value: categoryTotal,
      color: cat.color
    };
  }).filter(item => item.value > 0);

  const getLast7Days = () => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      days.push(date.toISOString().split('T')[0]);
    }
    return days;
  };

  const last7Days = getLast7Days();
  const barData = last7Days.map(day => {
    const dayTotal = expenses
      .filter(exp => exp.date === day)
      .reduce((sum, exp) => sum + exp.amount, 0);
    
    return {
      label: new Date(day).toLocaleDateString('en-US', { weekday: 'short' }),
      value: dayTotal
    };
  });

 
  
  if (loading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">
          Welcome, {currentUser.name}!
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-gray-600 text-sm font-semibold">Total Spent</h3>
            <p className="text-3xl font-bold text-blue-600">
              ${totalSpent.toFixed(2)}
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-gray-600 text-sm font-semibold">Total Expenses</h3>
            <p className="text-3xl font-bold text-green-600">
              {expenses.length}
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-gray-600 text-sm font-semibold">Categories</h3>
            <p className="text-3xl font-bold text-purple-600">
              {pieData.length}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">Spending by Category</h2>
            {pieData.length > 0 ? (
              <PieChart data={pieData} width={400} height={400} />
            ) : (
              <p className="text-gray-500 text-center py-8">No expenses yet</p>
            )}
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">Last 7 Days</h2>
            <BarChart data={barData} width={500} height={300} />
          </div>

        </div>

        <div className="bg-white p-6 rounded-lg shadow mt-6">
          <h2 className="text-xl font-bold mb-4">Recent Expenses</h2>
          {expenses.length > 0 ? (
            <div className="space-y-2">
              {expenses.slice(-5).reverse().map(expense => (
                <div key={expense.id} className="flex justify-between items-center border-b pb-2">
                  <div>
                    <p className="font-semibold">{expense.description}</p>
                    <p className="text-sm text-gray-600">
                      {expense.category} • {expense.date}
                    </p>
                  </div>
                  <p className="text-lg font-bold">${expense.amount.toFixed(2)}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No expenses yet</p>
          )}
        </div>
      </div>
    </div>
  );
}