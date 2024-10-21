import { useEffect, useRef, useState } from 'react';
import './App.css';
import Clock from './components/Clock';
import StopWatch from './components/Stopwatch';
import Timer from './components/Timer';
import Advice from './components/Advice';
import useFetch from './hooks/useFetch';

const App = () => {
  const [isLoading, data] = useFetch('http://localhost:3000/todo');
  const [todolist, setTodolist] = useState([]);

  useEffect(() => {
    if (data) setTodolist(data);
  }, [isLoading]);

  return (
    <>
      <Clock />
      <StopWatch />
      <Timer />
      <TodoInput setTodolist={setTodolist} />
      <TodoList todolist={todolist} setTodolist={setTodolist} />
      <Advice />
    </>
  );
};

const TodoInput = ({ setTodolist }) => {
  const inputRef = useRef(null);

  const addTodo = () => {
    const newTodo = { content: inputRef.current.value };
    fetch('http://localhost:3000/todo', {
      method: 'POST',
      body: JSON.stringify(newTodo),
    })
      .then((res) => res.json())
      .then((res) => setTodolist((prev) => [...prev, res]));
    inputRef.current.value = '';
  };

  return (
    <>
      <input ref={inputRef} />
      <button onClick={addTodo}>추가</button>
    </>
  );
};

const TodoList = ({ todolist, setTodolist }) => {
  return (
    <ul>
      {todolist.map((todo) => (
        <Todo key={todo.id} todo={todo} setTodolist={setTodolist} />
      ))}
    </ul>
  );
};

const Todo = ({ todo, setTodolist }) => {
  const [todoInput, setTodoInput] = useState(todo.content);
  const [isReadOnly, setIsReadOnly] = useState(true);

  const editTodo = () => {
    if (!isReadOnly) {
      setTodolist((prev) => prev.map((item) => (item.id === todo.id ? { ...item, content: todoInput } : item)));
    }
    setIsReadOnly(!isReadOnly);
  };

  const removeTodo = () => {
    fetch(`http://localhost:3000/todo/${todo.id}`, {
      method: 'DELETE',
    }).then((res) => {
      if (res.ok) {
        setTodolist((prev) => prev.filter((el) => el.id !== todo.id));
      }
    });
  };

  return (
    <li>
      <input
        value={todoInput}
        onChange={(e) => {
          setTodoInput(e.target.value);
        }}
        readOnly={isReadOnly}
      />
      <div>
        <button onClick={editTodo}>{isReadOnly ? '수정' : '저장'}</button>
        <button onClick={removeTodo}>삭제</button>
      </div>
    </li>
  );
};

export default App;
