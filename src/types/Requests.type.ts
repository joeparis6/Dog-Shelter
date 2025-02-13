import { GeoBoundingBox } from './GeoBoundingBox.type';

export type DogRequest = {
  dogIds: string[];
};

export type DogMatchRequest = {
  dogIds: string[];
};

export type LocationRequest = {
  zipCodes: string[];
};

export type SearchLocationRequest = {
  city?: string;
  states?: string[];
  geoBoundingBox?: GeoBoundingBox;
  size?: number;
  from?: number;
};

export type SearchDogsRequest = {
  breeds?: string;
  zipCodes?: string;
  ageMin?: number;
  ageMax?: number;
  size?: number;
  from?: number;
  sort?: string;
};
