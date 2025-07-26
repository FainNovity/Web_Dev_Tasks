import React, { useState } from 'react';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [currentTask, setCurrentTask] = useState('');
  const [editingIndex, setEditingIndex] = useState(null);

  const handleAddTask = () => {
    if (currentTask.trim() === '') return;
    if (editingIndex !== null) {
      const updatedTasks = [...tasks];
      updatedTasks[editingIndex] = currentTask;
      setTasks(updatedTasks);
      setEditingIndex(null);
    } else {
      setTasks([...tasks, currentTask]);
    }
    setCurrentTask('');
  };

  const handleEditTask = (index) => {
    setCurrentTask(tasks[index]);
    setEditingIndex(index);
  };

  const handleDeleteTask = (index) => {
    const filteredTasks = tasks.filter((_, i) => i !== index);
    setTasks(filteredTasks);
  };

  return (
    <div className="App">
      <header>
        <h1>React To-Do List</h1>
        <div className="input-group">
          <input
            type="text"
            value={currentTask}
            onChange={(e) => setCurrentTask(e.target.value)}
            placeholder="Add or edit a task"
          />
          <button onClick={handleAddTask}>
            {editingIndex !== null ? 'Update Task' : 'Add Task'}
          </button>
        </div>
      </header>
      <ul>
        {tasks.map((task, index) => (
          <li key={index}>
            <span>{task}</span>
            <div className="task-buttons">
              <button className="edit" onClick={() => handleEditTask(index)}>Edit</button>
              <button className="delete" onClick={() => handleDeleteTask(index)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;