import React, { useContext, useEffect, useState } from 'react';
import { getBreeds, getDogsByIds, getLocations, getMatchDog, logOut, searchDogs } from '../api';
import DogCard from '../components/DogCard';
import { Dog } from '@/types/dog.type';
import { Location } from '@/types/location.type';
import MatchCard from '../components/MatchCard';
import Button from '../components/Button';
import { AuthContext } from '../contexts/auth.context';

const DogIndex = () => {
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [breeds, setBreeds] = useState<string[]>([]);
  const [zipCodeLocationMap, setZipCodeLocationMap] = useState({});
  const [matchDog, setMatchDog] = useState<Dog | undefined>();
  const { setIsAuthorized } = useContext(AuthContext);

  const fetchDogs = async () => {
    try {
      const response = await searchDogs();
      const data = await response.json();

      const ids = data?.resultIds ?? [];
      const dogResponse = await getDogsByIds(ids);
      const dogData = await dogResponse.json();
      const zipCodes = dogData.map((dog: Dog) => dog.zip_code);
      const locationsResponse = await getLocations(zipCodes);
      const locations = await locationsResponse.json();
      const locationMap: object = {};
      locations.forEach((location: Location) => {
        if (!location?.zip_code) {
          return;
        }
        const zipCode = location.zip_code;
        locationMap[zipCode] = location;
      });

      setZipCodeLocationMap(locationMap);
      setDogs(dogData);
    } catch (error) {
      console.log('ERROR', error);
    }
  };

  const fetchBreeds = async () => {
    const breedResponse = await getBreeds();
    const breedResult = await breedResponse.json();
    setBreeds(breedResult);
  };

  useEffect(() => {
    fetchDogs();
    fetchBreeds();
  }, []);

  const handleFindMatch = async () => {
    try {
      const ids = dogs.map((dog: Dog) => dog.id);
      const matchResponse = await getMatchDog(ids);
      const matchResult = await matchResponse.json();
      const matchId = matchResult.match;
      const match = dogs.find((dog: Dog) => dog.id === matchId);
      setMatchDog(match);
    } catch (error) {
      console.log('ERROR', error);
    }
  };

  const handleLogout = async () => {
    try {
      await logOut();
      setIsAuthorized(false);
    } catch (error) {
      console.log('ERROR', error);
    }
  };

  return (
    <>
      <Button onClick={handleLogout} label={'Logout'} />
      <Button onClick={handleFindMatch} label={'Find Match'} />
      <Button onClick={fetchDogs} label={'Search'} />
      {matchDog && <MatchCard dog={matchDog} location={zipCodeLocationMap[matchDog.zip_code]} />}
      {dogs &&
        dogs.map((dog: Dog) => (
          <div key={dog.id} className="m-3">
            <DogCard dog={dog} imageUrl={dog.img} location={zipCodeLocationMap[dog.zip_code]} />
          </div>
        ))}
    </>
  );
};

export default DogIndex;
