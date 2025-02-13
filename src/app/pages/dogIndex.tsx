import React, { useContext, useEffect, useState } from 'react';
import { getBreeds, getDogsByIds, getLocations, getMatchDog, logOut, searchDogs, searchLocations } from '../api';
import DogCard from '../components/DogCard';
import { Dog } from '@/types/Dog.type';
import { Location } from '@/types/Location.type';
import MatchCard from '../components/MatchCard';
import Button from '../components/Button';
import { AuthContext } from '../contexts/auth.context';
import Dropdown from '../components/Select';
import NumericInput from '../components/NumericInput';
import TextInput from '../components/TextInput';
import { stateAndTerritoryCodes } from '../data/StateCodes';

enum LocationFilterMethods {
  CITY_STATE = 'City and State',
  ZIP_CODE = 'Zip Code',
  COORDINATES = 'Coordinates',
  NONE = '',
}

const DogIndex = () => {
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [breeds, setBreeds] = useState<string[]>([]);
  const [zipCodeLocationMap, setZipCodeLocationMap] = useState({});
  const [matchDog, setMatchDog] = useState<Dog | undefined>();
  const [locationFilterMethod, setLocationFilterMethod] = useState<LocationFilterMethods>(LocationFilterMethods.NONE);
  const [searchData, setSearchData] = useState({});
  const { setIsAuthorized } = useContext(AuthContext);
  const searchMethods = ['City and State', 'Zip Code', 'Coordinates'];

  const fetchDogs = async (providedLocations?: Location) => {
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

  const searchForLocations = async () => {
    try {
      const response = await searchLocations({});
      const locationSearchResult = await response.json();
      console.log(locationSearchResult);
    } catch (error) {
      console.log('ERROR', error);
    }
  };

  const handleApplyFilters = () => {
    console.log(searchData);
  };

  const handleLogout = async () => {
    try {
      await logOut();
      setIsAuthorized(false);
    } catch (error) {
      console.log('ERROR', error);
    }
  };

  const LocationFilters = (method: string) => {
    switch (method) {
      case LocationFilterMethods.ZIP_CODE:
        return (
          <div>
            <NumericInput
              onChange={(value: number | string) =>
                setSearchData((prevData) => {
                  return { ...prevData, zipCode: value };
                })
              }
              value={searchData?.zipCode}
              min={10000}
              max={99999}
              placeholder="Zip Code"
            />
          </div>
        );
      case LocationFilterMethods.COORDINATES:
        return (
          <div>
            <NumericInput onChange={() => {}} value={undefined} min={10000} max={99999} placeholder="Latitude" />
            <NumericInput onChange={() => {}} value={undefined} min={10000} max={99999} placeholder="Longitude" />
          </div>
        );
      case LocationFilterMethods.CITY_STATE:
        return (
          <div>
            <TextInput
              value={searchData?.city ?? ''}
              onChange={(value) =>
                setSearchData((prevData) => {
                  return { ...prevData, city: value };
                })
              }
              placeholder="City"
            />
            <Dropdown
              options={stateAndTerritoryCodes}
              placeHolder="State"
              onSelect={(value) =>
                setSearchData((prevData) => {
                  return { ...prevData, state: value };
                })
              }
            />
          </div>
        );
      default:
        return <></>;
    }
  };

  return (
    <>
      <Button onClick={handleLogout} label={'Logout'} />
      <Button onClick={handleFindMatch} label={'Find Match'} />
      <Button onClick={fetchDogs} label={'Search'} />
      <div className="max-w-lg mx-auto flex-row">
        <Dropdown
          placeHolder={'Select Breed'}
          options={breeds}
          onSelect={(value) =>
            setSearchData((prevData) => {
              return { ...prevData, breed: value };
            })
          }
        />
        <Dropdown
          placeHolder={'Select Location Filter'}
          options={searchMethods}
          onSelect={(value: string) => setLocationFilterMethod(value)}
        />
        {LocationFilters(locationFilterMethod)}
        <Button onClick={handleApplyFilters} label={'Apply'} />
      </div>
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
