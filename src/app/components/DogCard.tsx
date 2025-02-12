import React from 'react';
import Image from 'next/image';
import { Location } from '@/types/location.type';

type Props = {
  name: string;
  imageUrl: string;
  location: Location;
};

const DogCard = (props: Props) => {
  const { name, imageUrl, location } = props;

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
        <h2 className="text-white">{name}</h2>
        <h2 className="text-white">{getLocationString()}</h2>
        <Image src={imageUrl} alt="" height={60} width={60} />
      </div>
    </div>
  );
};

export default DogCard;
