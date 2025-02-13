import { Coordinates } from './Coordinates.type';

export type GeoBoundingBox = {
  top?: Coordinates;
  left?: Coordinates;
  bottom?: Coordinates;
  right?: Coordinates;
  bottom_left?: Coordinates;
  top_left?: Coordinates;
};
