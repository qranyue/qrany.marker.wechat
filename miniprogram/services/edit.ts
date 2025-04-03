import { http } from "../utils/http";
import { MarkerResult } from "./marker";

type EditForm = {
  id?: number;
  content?: string;
  images: (string | undefined)[];
  latitude: number;
  longitude: number;
  tag: string;
  share: boolean;
};

export const edit = async (form: EditForm) => {
  const data = { ...form, images: form.images.filter((x) => x) };
  return await http<MarkerResult>({ url: "edit", method: "POST", data });
};
