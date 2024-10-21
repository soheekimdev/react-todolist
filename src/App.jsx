import { useEffect, useRef, useState } from 'react';
import './App.css';
import Clock from './components/Clock';
import StopWatch from './components/Stopwatch';
import Timer from './components/Timer';
import Advice from './components/Advice';
import useFetch from './hooks/useFetch';
import { formatTime } from './utils/timeUtils';

const App = () => {
  const [isLoading, data] = useFetch('http://localhost:3000/todo');
  const [todolist, setTodolist] = useState([]);
  const [currentTodoId, setcurrentTodoId] = useState(null);
  const [time, setTime] = useState(0);
  const [isTimer, setIsTimer] = useState(false);

  useEffect(() => {
    if (currentTodoId) {
      fetch(`http://localhost:3000/todo/${currentTodoId}`, {
        method: 'PATCH',
        body: JSON.stringify({ time: todolist.find((el) => el.id === currentTodoId).time + 1 }),
      })
        .then((res) => res.json())
        .then((res) => setTodolist((prev) => prev.map((el) => (el.id === currentTodoId ? res : el))));
    }
  }, [time]);

  useEffect(() => {
    setTime(0);
  }, [isTimer]);

  useEffect(() => {
    if (data) setTodolist(data);
  }, [isLoading]);

  return (
    <>
      <h1>TODO LIST</h1>
      <Clock />
      <Advice />
      <button onClick={() => setIsTimer(!isTimer)}>{isTimer ? '스톱워치로 변경' : '타이머로 변경'}</button>
      {isTimer ? <Timer time={time} setTime={setTime} /> : <StopWatch time={time} setTime={setTime} />}
      <TodoInput setTodolist={setTodolist} />
      <TodoList
        todolist={todolist}
        setTodolist={setTodolist}
        currentTodoId={currentTodoId}
        setcurrentTodoId={setcurrentTodoId}
      />
    </>
  );
};

const TodoInput = ({ setTodolist }) => {
  const inputRef = useRef(null);

  const addTodo = () => {
    const newTodo = { content: inputRef.current.value, time: 0 };
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

const TodoList = ({ todolist, setTodolist, currentTodoId, setcurrentTodoId }) => {
  return (
    <ul>
      {todolist.map((todo) => (
        <Todo
          key={todo.id}
          todo={todo}
          setTodolist={setTodolist}
          currentTodoId={currentTodoId}
          setcurrentTodoId={setcurrentTodoId}
        />
      ))}
    </ul>
  );
};

const Todo = ({ todo, setTodolist, currentTodoId, setcurrentTodoId }) => {
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
    <li className={currentTodoId === todo.id ? 'current' : null}>
      <div>
        <input
          value={todoInput}
          onChange={(e) => {
            setTodoInput(e.target.value);
          }}
          readOnly={isReadOnly}
        />
        {formatTime(todo.time)}
      </div>
      <div>
        <button onClick={() => setcurrentTodoId(todo.id)}>시작하기</button>
        <button onClick={editTodo}>{isReadOnly ? '수정' : '저장'}</button>
        <button onClick={removeTodo}>삭제</button>
      </div>
    </li>
  );
};

export default App;
