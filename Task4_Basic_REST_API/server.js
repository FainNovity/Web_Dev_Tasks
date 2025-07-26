const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());

// In-memory "database"
// For now taking static data as database is in next task.
let users = [
    { id: 1, name: 'John Doe', email: 'john@example.com', age: 30 },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', age: 25 }
];
let nextId = 3;

// --- CRUD Operations ---

// CREATE a new user
app.post('/users', (req, res) => {
    const { name, email, age } = req.body;
    if (!name || !email || !age) {
        return res.status(400).json({ message: 'Name, email, and age are required.' });
    }
    const newUser = { id: nextId++, name, email, age };
    users.push(newUser);
    res.status(201).json(newUser);
});

// READ all users
app.get('/users', (req, res) => {
    res.json(users);
});

// READ a single user by ID
app.get('/users/:id', (req, res) => {
    const user = users.find(u => u.id === parseInt(req.params.id));
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
});

// UPDATE a user by ID
app.put('/users/:id', (req, res) => {
    const user = users.find(u => u.id === parseInt(req.params.id));
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    const { name, email, age } = req.body;
    user.name = name || user.name;
    user.email = email || user.email;
    user.age = age || user.age;
    res.json(user);
});

// DELETE a user by ID
app.delete('/users/:id', (req, res) => {
    const index = users.findIndex(u => u.id === parseInt(req.params.id));
    if (index === -1) {
        return res.status(404).json({ message: 'User not found' });
    }
    users.splice(index, 1);
    res.status(204).send(); // No content
});


app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});