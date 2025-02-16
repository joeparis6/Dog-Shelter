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
    <div className="max-w-3xl mx-auto overflow-hidden p-1">
      <div className="max-w-3xl bg-green-900 rounded-sm flex justify-between p-1">
        <div className="mx-auto">
          <h1 className="font-serif text-yellow-300 text-3xl">{name}</h1>
          <h4 className="text-white">{`${dog.age} year${age !== 1 ? 's' : ''} old`}</h4>
          <h4 className="text-white">{breed}</h4>
          <h4 className="text-white">{getLocationString()}</h4>
        </div>

        <Image src={imageUrl} alt="" height={100} width={100} />
      </div>
    </div>
  );
};

export default DogCard;
