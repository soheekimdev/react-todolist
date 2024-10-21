import { useEffect, useRef, useState } from 'react';
import './App.css';

const App = () => {
  const [todolist, setTodolist] = useState([{ id: Number(new Date()), content: '안녕하세요' }]);

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
    const newTodo = { id: Number(new Date()), content: inputRef.current.value };
    setTodolist((prev) => [...prev, newTodo]);
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
    setTodolist((prev) => prev.filter((el) => el.id !== todo.id));
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

const Clock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    setInterval(() => {
      setTime(new Date());
    }, 1000);
  }, []);

  return <div>{time.toLocaleTimeString()}</div>;
};

const formatTime = (seconds) => {
  const timeString = `${String(Math.floor(seconds / 3600)).padStart(2, '0')}:${String(
    Math.floor((seconds % 3600) / 60)
  ).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
  return timeString;
};

const StopWatch = () => {
  const [time, setTime] = useState(0);
  const [isOn, setIsOn] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    if (isOn) {
      const timerId = setInterval(() => {
        setTime((prev) => prev + 1);
      }, 1000);
      timerRef.current = timerId;
    } else {
      clearInterval(timerRef.current);
    }
  }, [isOn]);

  return (
    <div>
      {formatTime(time)}
      <button
        onClick={() => {
          setIsOn(!isOn);
        }}
      >
        {isOn ? '끄기' : '켜기'}
      </button>
      <button
        onClick={() => {
          setTime(0);
          setIsOn(false);
        }}
      >
        리셋
      </button>
    </div>
  );
};

const Timer = () => {
  const [startTime, setStartTime] = useState(0);
  const [isOn, setIsOn] = useState(false);
  const [time, setTime] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    if (isOn && time > 0) {
      const timerId = setInterval(() => {
        setTime((prev) => prev - 1);
      }, 1000);
      timerRef.current = timerId;
    } else if (!isOn || time === 0) {
      clearInterval(timerRef.current);
    }
    return () => {
      clearInterval(timerRef.current);
    };
  }, [isOn, time]);

  return (
    <div>
      <div>
        {time ? formatTime(time) : formatTime(startTime)}
        <button
          onClick={() => {
            setIsOn(true);
            setTime(time ? time : startTime);
            setStartTime(0);
          }}
        >
          시작
        </button>
        <button onClick={() => setIsOn(false)}>멈춤</button>
        <button
          onClick={() => {
            setTime(0);
            setIsOn(false);
          }}
        >
          리셋
        </button>
      </div>
      <input type="range" max="3600" step="30" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
      <div></div>
    </div>
  );
};

const useFetch = (url) => {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch(url)
      .then((res) => res.json())
      .then((res) => {
        setData(res);
        setIsLoading(false);
      });
  }, [url]);

  return [isLoading, data];
};

const Advice = () => {
  const [isLoading, data] = useFetch('https://korean-advice-open-api.vercel.app/api/advice');

  return (
    <>
      {!isLoading && (
        <>
          <div>{data.message}</div>
          <div>-{data.author}-</div>
        </>
      )}
      <button>명언 새로고침</button>
    </>
  );
};

export default App;
