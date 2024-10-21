import useFetch from '../hooks/useFetch';

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

export default Advice;
