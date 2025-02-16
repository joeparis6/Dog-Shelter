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
  const [locaitonSearchData] = useState({});
  const [paginationData, setPaginationData] = useState<{ from: number; size: number }>({ from: 0, size: 25 });
  const { setIsAuthorized } = useContext(AuthContext);
  const searchMethods = ['City and State', 'Zip Code', 'Coordinates'];
  const sortMethods = [
    { label: 'Breed (A-Z)', value: 'breed:asc' },
    { label: 'Breed (Z-A)', value: 'breed:desc' },
    { label: 'Name (A-Z)', value: 'name:asc' },
    { label: 'Name (Z-A)', value: 'name:desc' },
    { label: 'Oldest to Youngest', value: 'age:desc' },
    { label: 'Youngest to Oldest', value: 'age:asc' },
  ];

  const fetchDogs = async (providedLocations?: Location[]) => {
    try {
      console.log(searchData);
      const { zipCode, breed, ageMin, ageMax, sort } = searchData;
      const { from, size } = paginationData;
      const response = await searchDogs([breed], [zipCode], ageMin, ageMax, size, from, sort);
      const { resultIds, next, prev } = await response.json();

      const dogResponse = await getDogsByIds(resultIds);
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

  const fetchLocations = async () => {
    const locationsResponse = await searchLocations({});
    const { results, total } = await locationsResponse.json();
    console.timeLog(results, total);
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
    console.log(searchData);
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
                  return { ...prevData, city: value, zipCode: null };
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
      <Button onClick={handleFindMatch} label={'Feeling Lucky'} />
      <Button onClick={fetchDogs} label={'Search'} />
      <div className="max-w-3xl mx-auto flex-row">
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
