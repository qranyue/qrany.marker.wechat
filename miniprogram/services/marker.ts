import { http } from "../utils/http";

export type MarkerResult = {
  id: number;
  latitude: number;
  longitude: number;
  tag: string;
  tagId: number;
  content: string;
};

export const getMarkers = () => http<MarkerResult[]>({ url: "markers" });
