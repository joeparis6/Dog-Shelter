const BASE_URL = 'https://frontend-take-home-service.fetch.com';
const AUTHENTICATE = '/auth/login';
const LOG_OUT = '/auth/logout';
const BREEDS = '/dogs/breeds';
const DOG_SEARCH = '/dogs/search';
const DOGS = '/dogs';
const MATCH = '/dogs/match';
const LOCATIONS = '/locations';
const SEARCH_LOCATIONS = '/locations/search';

export const login = async ({ name, email }) => {
  const url = BASE_URL + AUTHENTICATE;
  return await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({
      name: 'John Doe',
      email: 'duvjgspizlzczgrwcy@poplk.com',
    }),
  });
};

export const logOut = async () => {
  const url = BASE_URL + LOG_OUT;
  return await fetch(url, {
    method: 'POST',
    credentials: 'include',
  });
};

export const getBreeds = async () => {
  const url = BASE_URL + BREEDS;
  return await fetch(url, {
    method: 'GET',
    credentials: 'include',
  });
};

export const searchDogs = async (size?: number, from?: number) => {
  const searchParams = new URLSearchParams({
    size: size?.toString() ?? '25',
    from: from?.toString() ?? '0',
  }).toString();
  const url = BASE_URL + DOG_SEARCH + '?' + searchParams;
  return await fetch(url, {
    method: 'GET',
    credentials: 'include',
  });
};

export const getDogsByIds = async (ids: string[]) => {
  console.log(ids);
  const url = BASE_URL + DOGS;
  return await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(ids),
  });
};

export const getMatchDog = async (ids: string[]) => {
  const url = BASE_URL + MATCH;
  return await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(ids),
  });
};

export const getLocations = async (zipCodes: string[]) => {
  const url = BASE_URL + LOCATIONS;
  return await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(zipCodes),
  });
};

export const searchLocations = async (search: string) => {
  const url = BASE_URL + SEARCH_LOCATIONS;
  return await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify([]),
  });
};
