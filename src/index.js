import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';

import axios from 'axios';
import './index.css';
import * as serviceWorker from './serviceWorker';

const useDataApi = (initialUrl, initialData) => {
  const [data, setData] = useState(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const fetchData = async url => {
    setIsError(false);
    setIsLoading(true);

    try {
      const result = await axios(url);
      setData(result.data);
    } catch (error) {
      setIsError(true);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    fetchData(initialUrl);
  }, [initialUrl]);

  return { data, isLoading, isError, fetchData };
};

function App() {
  const [query, setQuery] = useState('');
  const { data, isLoading, isError, fetchData } = useDataApi(
    `https://hn.algolia.com/api/v1/search?query=golang`,
    { hits: [] }
  );

  return (
    <>
      <form
        onSubmit={event => {
          fetchData(`https://hn.algolia.com/api/v1/search?query=${query}`);
          event.preventDefault();
          setQuery('');
        }}
      >
        <input
          type="text"
          value={query}
          onChange={event => setQuery(event.target.value)}
        />
        <button type="submit">Search</button>
      </form>
      {isError && <div>Something went wrong ...</div>}
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <ul>
          {data.hits.map(item => (
            <li key={item.objectID}>
              <a href={item.url}>{item.title}</a>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
