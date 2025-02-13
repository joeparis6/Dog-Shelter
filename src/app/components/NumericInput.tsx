import React from 'react';

interface NumericInputProps {
  value: number | string;
  onChange: (value: number | string) => void;
  min?: number;
  max?: number;
  placeholder?: string;
}

const NumericInput: React.FC<NumericInputProps> = ({ value, onChange, min, max, placeholder }) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    if (/^\d*$/.test(newValue)) {
      const numericValue = newValue === '' ? '' : Number(newValue);
      if ((min === undefined || numericValue >= min) && (max === undefined || numericValue <= max)) {
        onChange(numericValue);
      }
    }
  };

  return <input type="text" value={value} onChange={handleChange} placeholder={placeholder} />;
};

export default NumericInput;
