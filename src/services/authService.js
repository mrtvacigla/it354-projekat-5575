const API_URL = 'http://localhost:3000';

export const authService = {

  login: async (email, password) => {

    const response = await fetch(`${API_URL}/users`);
    const users = await response.json(); 
    
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
      return user;
    }
    
    throw new Error('Pogrešan email ili lozinka');
  },

  register: async (email, password, name) => {
    const newUser = {
      email: email,
      password: password,
      name: name,
      role: 'user'
    };
    
    const response = await fetch(`${API_URL}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newUser)
    });
    
    const data = await response.json();
    return data;
  },

  logout: () => {
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    const userString = localStorage.getItem('user');
    if (userString) {
      return JSON.parse(userString);
    }
    return null;
  }
};