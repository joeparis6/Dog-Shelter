import React from 'react';
import Image from 'next/image';
import { Location } from '@/types/Location.type';
import { Dog } from '@/types/Dog.type';

type Props = {
  dog: Dog;
  imageUrl: string;
  location: Location;
};

const DogCard = (props: Props) => {
  const { dog, imageUrl, location } = props;
  const { name, age, breed } = dog;
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
    <div className="max-w-xl mx-auto bg-red-700 rounded-lg overflow-hidden p-1">
      <div className="max-w-xl mx-auto bg-red-700 border-2 rounded-lg border-solid border-white divide-white m-1 flex justify-between p-2 mx-1">
        <div className="mx-auto">
          <h1 className="text-white">{name}</h1>
          <h4 className="text-white">{`${dog.age} year${age > 1 ? 's' : ''} old`}</h4>
          <h4 className="text-white">{breed}</h4>
          <h4 className="text-white">{getLocationString()}</h4>
        </div>

        <Image src={imageUrl} alt="" height={100} width={100} />
      </div>
    </div>
  );
};

export default DogCard;
