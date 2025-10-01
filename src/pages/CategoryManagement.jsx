import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { categoryService } from '../services/categoryService';

export default function CategoryManagement() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    color: '#3b82f6',
    budgetLimit: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    loadCategories();
  }, []);

  async function loadCategories() {
    try {
      const data = await categoryService.getAll();
      setCategories(data);
    } catch (error) {
      console.error('Failed to load categories:', error);
    } finally {
      setLoading(false);
    }
  }

  function handleEdit(category) {
    setEditingId(category.id);
    setFormData({
      name: category.name,
      color: category.color,
      budgetLimit: category.budgetLimit.toString()
    });
    setShowForm(true);
  }

  function handleCancel() {
    setShowForm(false);
    setEditingId(null);
    setFormData({ name: '', color: '#3b82f6', budgetLimit: '' });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const categoryData = {
      name: formData.name,
      color: formData.color,
      budgetLimit: parseFloat(formData.budgetLimit)
    };

    try {
      if (editingId) {
        await categoryService.update(editingId, categoryData);
      } else {
        await categoryService.create(categoryData);
      }
      loadCategories();
      handleCancel();
    } catch (error) {
      console.error('Failed to save category:', error);
    }
  }

  async function handleDelete(id) {
    if (window.confirm('Are you sure? This will affect existing expenses!')) {
      try {
        await categoryService.delete(id);
        setCategories(categories.filter(cat => cat.id !== id));
      } catch (error) {
        console.error('Failed to delete category:', error);
      }
    }
  }

  if (loading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/admin')}
              className="text-blue-600 hover:underline"
            >
              ← Back to Admin
            </button>
            <h1 className="text-3xl font-bold">Category Management</h1>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            + Add Category
          </button>
        </div>

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
              <h2 className="text-2xl font-bold mb-4">
                {editingId ? 'Edit Category' : 'Add Category'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block font-semibold mb-1">Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">Color</label>
                  <input
                    type="color"
                    value={formData.color}
                    onChange={(e) => setFormData({...formData, color: e.target.value})}
                    className="w-full h-12 border rounded"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">Budget Limit ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.budgetLimit}
                    onChange={(e) => setFormData({...formData, budgetLimit: e.target.value})}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  >
                    {editingId ? 'Update' : 'Create'}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold">Color</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Name</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Budget Limit</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map(category => (
                <tr key={category.id} className="border-t">
                  <td className="px-6 py-4">
                    <div
                      className="w-8 h-8 rounded"
                      style={{ backgroundColor: category.color }}
                    ></div>
                  </td>
                  <td className="px-6 py-4 font-semibold">{category.name}</td>
                  <td className="px-6 py-4">${category.budgetLimit.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(category)}
                        className="text-blue-600 hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(category.id)}
                        className="text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}