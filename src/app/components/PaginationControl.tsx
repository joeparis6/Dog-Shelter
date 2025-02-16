import React from 'react';
import Button from './Button';

type Props = {
  from: number;
  size: number;
  handlePageChange: () => void;
};

const PaginationControl = (props: Props) => {
  const { from, size, handlePageChange } = props;
  return (
    <div className="max-w-sm mx-auto flex flex-row justify-between">
      <Button label={'Previous'} onClick={handlePageChange} />
      <h2>{`Showing Results ${from + 1} to ${from + size}`}</h2>
      <Button label={'Next'} onClick={handlePageChange} />
    </div>
  );
};

export default PaginationControl;
