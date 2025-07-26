import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_URL = 'http://localhost:3000/users'; // Your backend URL

function App() {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({ name: '', email: '', age: '' });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(API_URL);
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.age) return;

    if (editingId) { // Update user
      await axios.put(`${API_URL}/${editingId}`, formData);
    } else { // Create user
      await axios.post(API_URL, formData);
    }
    
    resetForm();
    fetchUsers();
  };
  
  const handleEdit = (user) => {
    setFormData({ name: user.name, email: user.email, age: user.age });
    setEditingId(user.id);
  };

  const handleDelete = async (id) => {
    await axios.delete(`${API_URL}/${id}`);
    fetchUsers();
  };

  const resetForm = () => {
    setFormData({ name: '', email: '', age: '' });
    setEditingId(null);
  };

  return (
    <div className="App">
      <h1>User Management System</h1>

      <form onSubmit={handleSubmit} className="user-form">
        <input name="name" value={formData.name} onChange={handleInputChange} placeholder="Name" required />
        <input name="email" type="email" value={formData.email} onChange={handleInputChange} placeholder="Email" required />
        <input name="age" type="number" value={formData.age} onChange={handleInputChange} placeholder="Age" required />
        <button type="submit">{editingId ? 'Update User' : 'Add User'}</button>
        {editingId && <button type="button" onClick={resetForm}>Cancel</button>}
      </form>

      <table className="user-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Age</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.age}</td>
              <td>
                <button className="edit" onClick={() => handleEdit(user)}>Edit</button>
                <button className="delete" onClick={() => handleDelete(user.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;