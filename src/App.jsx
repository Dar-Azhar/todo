import { useEffect, useState } from 'react';
import axios from "axios";
import './App.css';

function App() {
  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/todo/get')
        setTodos(response.data);
      } catch (error) {
        console.error("Error fetching todos:", error);
      }
    };

    fetchTodos();

  }, []);

  const addTodo = async () => {
    if (!inputValue.trim()) return;
    try {
      const response = await axios.post('http://localhost:8000/api/todo/create', { todo: inputValue })
      setTodos([...todos, response.data])
      setInputValue("");
    } catch (error) {
      console.log(error);
    }
  }


  const handleEdit = async (todo) => {
    const newTodo = prompt("Edit your todo:", todo.todo); // Assuming todo has a `todo` property
    if (newTodo && newTodo !== todo.todo) {
      try {
        await axios.put(`http://localhost:8000/api/todo/update/${todo._id}`, { todo: newTodo });
        const updatedTodos = todos.map((t) => (t._id === todo._id ? { ...t, todo: newTodo } : t));
        setTodos(updatedTodos); // Update the state with the edited todo
      } catch (error) {
        console.error("Error updating todo:", error);
      }
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/api/todo/delete/${id}`);
      const updatedTodos = todos.filter((t) => t._id !== id);
      setTodos(updatedTodos); 
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  return (
    <main>
      <h1>Todo App</h1>
      <div className="container">
        <div className="input">
          <input
            type="text"
            placeholder="Todo..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <button type="button" onClick={() => addTodo()}>Add</button>
        </div>
        <ul className="todo-list">
          {todos.map((todo) => (
            <div className="todo-item" key={todo._id}> {/* Use _id as the unique key */}
              <li>{todo.todo}</li>
              <div className="buttons">
                <button type="button" className="edit-btn" onClick={() => handleEdit(todo)}>Edit</button>
                <button type="button" className="delete-btn" onClick={() => handleDelete(todo._id)}>Delete</button>
              </div>
            </div>
          ))}
        </ul>
      </div>
    </main>
  );
};

export default App;
