import { Dog } from '@/types/dog.type';
import { Location } from '@/types/location.type';
import React from 'react';

type Props = {
  dog: Dog;
  location: Location;
};

const MatchCard = (props: Props) => {
  const { dog, location } = props;
  return (
    <div className="max-w-sm mx-auto bg-yellow-400 text-white m-2 p-1">
      <p>{`Your Match is ${dog.name}!`}</p>
    </div>
  );
};

export default MatchCard;
