import { useRef, useState } from 'react';
import './App.css';

function App() {
  const [todolist, setTodolist] = useState([{ id: Number(new Date()), content: '안녕하세요' }]);
  const inputRef = useRef(null);

  const addTodo = () => {
    const newTodo = { id: Number(new Date()), content: inputRef.current.value };
    setTodolist((prev) => [...prev, newTodo]);
    inputRef.current.value = '';
  };

  const removeTodo = (todo) => {
    setTodolist((prev) => prev.filter((el) => el.id !== todo.id));
  };

  return (
    <>
      <input ref={inputRef} />
      <button onClick={addTodo}>추가</button>
      <ul>
        {todolist.map((todo) => (
          <li key={todo.id}>
            {todo.content}
            <button onClick={() => removeTodo(todo)}>삭제</button>
          </li>
        ))}
      </ul>
    </>
  );
}

export default App;
