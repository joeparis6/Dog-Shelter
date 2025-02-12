import React, { useEffect, useState } from 'react';
import { getDogsByIds, getLocations, getMatchDog, searchDogs } from '../api';
import DogCard from '../components/DogCard';
import { Dog } from '@/types/dog.type';
import { Location } from '@/types/location.type';
import MatchCard from '../components/MatchCard';
import Button from '../components/Button';

const DogIndex = () => {
  const [dogs, setDogs] = useState([]);
  const [zipCodeLocationMap, setZipCodeLocationMap] = useState({});
  const [matchDog, setMatchDog] = useState(null);

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

  useEffect(() => {
    fetchDogs();
  }, []);

  const handleFindMatch = async () => {
    try {
      const ids = dogs.map((dog: Dog) => dog.id);
      console.log(ids);
      const matchResponse = await getMatchDog(ids);
      const matchResult = await matchResponse.json();
      const matchId = matchResult.match;
      console.log(matchId);
      const match = dogs.find((dog: Dog) => dog.id === matchId);
      console.log(match);
      setMatchDog(match);
    } catch (error) {
      console.log('ERROR', error);
    }
  };

  return (
    <>
      <Button onClick={handleFindMatch} label={'Find Match'} />
      <Button onClick={fetchDogs} label={'Search'} />
      {matchDog && <MatchCard dog={matchDog} location={zipCodeLocationMap[matchDog.zip_code]} />}
      {dogs.map((dog: Dog) => (
        <div key={dog.id} className="m-3">
          <DogCard name={dog.name} imageUrl={dog.img} location={zipCodeLocationMap[dog.zip_code]} />
        </div>
      ))}
    </>
  );
};

export default DogIndex;
