import React from 'react';
import Image from 'next/image';
import { Location } from '@/types/location.type';
import { Dog } from '@/types/dog.type';

type Props = {
  dog: Dog;
  imageUrl: string;
  location: Location;
};

const DogCard = (props: Props) => {
  const { dog, imageUrl, location } = props;

  const getLocationString = () => {
    if (location?.city && location?.state) {
      return `${location.city}, ${location.state}`;
    } else if (location?.state) {
      return location.state;
    } else {
      return 'Location Unknown';
    }
  };

  return (
    <div className="max-w-sm mx-auto bg-red-700 rounded-lg overflow-hidden">
      <div className="max-w-md mx-auto bg-red-700 border-2 rounded-lg border-solid border-white divide-white m-1 flex justify-between p-2 m-1 mx-1.5">
        <div className="mx-auto">
          <h1 className="text-white">{dog.name}</h1>
          <h4 className="text-white">{dog.breed}</h4>
          <h4 className="text-white">{getLocationString()}</h4>
        </div>

        <Image src={imageUrl} alt="" height={60} width={60} />
      </div>
    </div>
  );
};

export default DogCard;
