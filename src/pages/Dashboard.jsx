import React from 'react';
import { useState, useEffect } from 'react';
import { useAuth } from '../components/AuthContext';
import { expenseService } from '../services/expenseService';
import PieChart from '../charts/PieChart';
import BarChart from '../charts/BarChart';

export default function Dashboard() {
  const { currentUser } = useAuth();
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [expensesData] = await Promise.all([
        expenseService.getByUserId(currentUser.id)
      ]);
      setExpenses(expensesData);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  }

  const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0);

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
        <h1 className="text-3xl font-bold mb-6 text-black">
          Welcome, {currentUser.name}!
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
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

        </div>


        <div className="">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">Last 7 Days</h2>
            <BarChart data={barData} width={500} height={300} />
          </div>
        </div>

        
      </div>
    </div>
  );
}