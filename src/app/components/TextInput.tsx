import React from 'react';

interface TextInputProps {
  value: string;
  label: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const TextInput: React.FC<TextInputProps> = ({ value, label, onChange, placeholder }) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value as string);
  };

  return (
    <>
      <label>{label}</label>
      <input type="text" value={value} onChange={handleChange} placeholder={placeholder} />
    </>
  );
};

export default TextInput;
