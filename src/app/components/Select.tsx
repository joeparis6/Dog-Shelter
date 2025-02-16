import React, { useState } from 'react';

type Props = {
  placeHolder?: string;
  options: { label?: string; value: string }[];
  onSelect: (value: string) => void;
};

const Dropdown = (props: Props) => {
  const { placeHolder, options, onSelect } = props;
  const [selected, setSelected] = useState('');

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    console.log(event.target.value);
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
        <option key={index} value={option.value}>
          {option?.label ?? option.value}
        </option>
      ))}
    </select>
  );
};

export default Dropdown;
