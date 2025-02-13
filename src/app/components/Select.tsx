import React, { useState } from 'react';

type Props = {
  placeHolder?: string;
  options: string[];
  onSelect: (value: string) => void;
};

const Dropdown = (props: Props) => {
  const { placeHolder, options, onSelect } = props;
  const [selected, setSelected] = useState('');

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setSelected(value);
    onSelect(value);
  };

  return (
    <select value={selected} onChange={handleChange}>
      <option value="" disabled>
        {placeHolder ?? 'Select an option'}
      </option>
      {options.map((option, index) => (
        <option key={index} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
};

export default Dropdown;
