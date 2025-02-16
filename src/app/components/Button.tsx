import React from 'react';

type Props = {
  label: string;

  onClick: () => void;
};

const Button = (props: Props) => {
  const { label, onClick } = props;
  return (
    <div className="max-w-min bg-blue-900 text-white whitespace-nowrap rounded-sm m-2 p-1">
      <button onClick={onClick}>{label}</button>
    </div>
  );
};

export default Button;
