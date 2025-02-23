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
import PaginationControl from '../components/PaginationControl';

enum LocationFilterMethods {
  CITY_STATE = 'City and State',
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
  const [locationSearchData, setLocationSearchData] = useState({});
  const [paginationData, setPaginationData] = useState<{ from: number; size: number }>({ from: 0, size: 25 });
  const { setIsAuthorized } = useContext(AuthContext);
  const searchMethods = ['City and State', 'Coordinates'];
  const sortMethods = [
    { label: 'Breed (A-Z)', value: 'breed:asc' },
    { label: 'Breed (Z-A)', value: 'breed:desc' },
    { label: 'Name (A-Z)', value: 'name:asc' },
    { label: 'Name (Z-A)', value: 'name:desc' },
    { label: 'Oldest to Youngest', value: 'age:desc' },
    { label: 'Youngest to Oldest', value: 'age:asc' },
  ];

  const fetchDogs = async () => {
    try {
      // get locations if filters provides
      console.log(locationSearchData);
      const { city, states, geoBoundingBox } = locationSearchData;
      let locationZipCodes = [];
      if (city || states || geoBoundingBox) {
        const searchLocationsResponse = await searchLocations(city, states, geoBoundingBox, 10000);
        const searchLocationsResult = await searchLocationsResponse.json();
        locationZipCodes = searchLocationsResult.results.map((location: Location) => location.zip_code);
      }
      // get Dogs
      const { breed, ageMin, ageMax, sort } = searchData;
      const { from, size } = paginationData;
      const response = await searchDogs([breed], locationZipCodes ?? null, ageMin, ageMax, size, from, sort);
      const { resultIds, next, prev } = await response.json();
      const dogResponse = await getDogsByIds(resultIds);
      const allDogs = await dogResponse.json();
      const filteredDogs = allDogs;

      // get zip codes for all dogs
      const zipCodes = filteredDogs.map((dog: Dog) => dog.zip_code);

      // get locations of all dogs
      const locationsResponse = await getLocations(zipCodes);
      const locations = await locationsResponse.json();
      const locationMap: object = {};
      // create mapping of zip codes to location
      locations.forEach((location: Location) => {
        if (!location?.zip_code) {
          return;
        }
        const zipCode = location.zip_code;
        locationMap[zipCode] = location;
      });

      setZipCodeLocationMap(locationMap);
      setDogs(filteredDogs);
    } catch (error) {
      console.log('ERROR', error);
    }
  };

  const fetchBreeds = async () => {
    const breedResponse = await getBreeds();
    const breedResult = await breedResponse.json();
    setBreeds(breedResult);
  };

  const fetchLocations = async () => {
    const locationsResponse = await searchLocations({});
    const { results, total } = await locationsResponse.json();
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

  const handleApplyFilters = async () => {
    await fetchDogs();
  };

  const handleReset = async () => {
    setSearchData({});
    setLocationSearchData({});
    await fetchDogs();
  };

  const handleLogout = async () => {
    try {
      await logOut();
      if (setIsAuthorized) {
        setIsAuthorized(false);
      }
    } catch (error) {
      console.log('ERROR', error);
    }
  };

  const LocationFilters = (method: string) => {
    switch (method) {
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
              value={locationSearchData?.city ?? ''}
              onChange={(value) =>
                setLocationSearchData((prevData) => {
                  return { ...prevData, city: value };
                })
              }
              placeholder="City"
            />
            <Dropdown
              options={stateAndTerritoryCodes.map((state: string) => {
                return { value: state };
              })}
              placeHolder="State"
              onSelect={(value) =>
                setLocationSearchData((prevData) => {
                  return { ...prevData, states: [value] };
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
      <div className="flex flex-row">
        <Button onClick={handleLogout} label={'Logout'} />
        <Button onClick={handleFindMatch} label={'Feeling Lucky'} />
        <Button onClick={fetchDogs} label={'Search'} />
      </div>

      <div className="max-w-3xl mx-auto">
        <Dropdown
          placeHolder={'Select Breed'}
          options={breeds.map((breed) => {
            return { value: breed };
          })}
          onSelect={(value) =>
            setSearchData((prevData) => {
              return { ...prevData, breed: value };
            })
          }
        />
        <NumericInput
          onChange={(value: number | string) =>
            setSearchData((prevData) => {
              return { ...prevData, ageMin: value };
            })
          }
          value={searchData?.ageMin}
          placeholder="Minimum Age"
        />
        <NumericInput
          onChange={(value: number | string) =>
            setSearchData((prevData) => {
              return { ...prevData, ageMax: value };
            })
          }
          value={searchData?.ageMax}
          placeholder="Max Age"
        />
        <Dropdown
          placeHolder={'Sort'}
          options={sortMethods}
          onSelect={(value: string) =>
            setSearchData((prevData) => {
              return { ...prevData, sort: value };
            })
          }
        />

        <Dropdown
          placeHolder={'Select Location Filter'}
          options={searchMethods.map((method: string) => {
            return { value: method };
          })}
          onSelect={(option) => setLocationFilterMethod(option as LocationFilterMethods)}
        />

        {LocationFilters(locationFilterMethod)}
        <Button onClick={handleApplyFilters} label={'Apply'} />
        <Button onClick={handleReset} label={'Reset'} />
      </div>
      {matchDog && <MatchCard dog={matchDog} location={zipCodeLocationMap[matchDog.zip_code]} />}
      {dogs && (
        <>
          {dogs.map((dog: Dog) => (
            <div key={dog.id} className="m-3">
              <DogCard dog={dog} imageUrl={dog.img} location={zipCodeLocationMap[dog.zip_code]} />
            </div>
          ))}
          <PaginationControl from={0} size={25} handlePageChange={() => {}} />
        </>
      )}
    </>
  );
};

export default DogIndex;
