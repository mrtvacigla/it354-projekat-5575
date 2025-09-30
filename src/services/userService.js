const API_URL = 'http://localhost:3000';

export const userService = {
  getAll: async () => {
    const response = await fetch(`${API_URL}/users`);
    const data = await response.json();
    return data;
  },

  delete: async (id) => {
    await fetch(`${API_URL}/users/${id}`, {
      method: 'DELETE'
    });
  }
};