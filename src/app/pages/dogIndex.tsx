import React, { useEffect, useState } from 'react';

const DogIndex = () => {
  const [dogIds, setDogIds] = useState([]);

  const BASE_URL = 'https://frontend-take-home-service.fetch.com';
  const DOG_SEARCH = '/dogs/search';

  const fetchDogs = async () => {
    const response = await fetch(BASE_URL + DOG_SEARCH, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });
    console.log(response);

    const reader = response?.body?.getReader();
    const decoder = new TextDecoder(); // To convert binary to text

    let result = '';
    let done = false;

    while (!done) {
      const { value, done: streamDone } = await reader.read();
      if (value) {
        result += decoder.decode(value, { stream: true }); // Append chunk
      }
      done = streamDone;
    }

    console.log('Full Response:', result);
    setDogIds(JSON.parse(result)?.resultIds ?? []);
  };

  useEffect(() => {
    fetchDogs();
  }, []);

  return (
    <>
      {dogIds.map((id) => (
        <h2 key={id}>{id}</h2>
      ))}
      <button onClick={fetchDogs}>try again</button>
    </>
  );
};

export default DogIndex;
