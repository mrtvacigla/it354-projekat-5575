const API_URL = 'http://localhost:3000';

export const expenseService = {
  getByUserId: async (userId) => {
    const response = await fetch(`${API_URL}/expenses?userId=${userId}`);
    const data = await response.json();
    return data;
  },

  getAll: async () => {
    const response = await fetch(`${API_URL}/expenses`);
    const data = await response.json();
    return data;
  },

  getById: async (id) => {
    const response = await fetch(`${API_URL}/expenses/${id}`);
    const data = await response.json();
    return data;
  },

  create: async (expense) => {
    const response = await fetch(`${API_URL}/expenses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(expense)
    });
    const data = await response.json();
    return data;
  },

  update: async (id, expense) => {
    const response = await fetch(`${API_URL}/expenses/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(expense)
    });
    const data = await response.json();
    return data;
  },

  delete: async (id) => {
    await fetch(`${API_URL}/expenses/${id}`, {
      method: 'DELETE'
    });
  }
};