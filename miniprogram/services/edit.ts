import { http } from "../utils/http";
import { MarkerResult } from "./marker";

type EditForm = {
  id?: number;
  latitude: number;
  longitude: number;
  title: string;
  content?: string;
  images: (string | undefined)[];
  tag: string;
  share: boolean;
};

export const edit = async (form: EditForm) => {
  const data = {
    id: form.id,
    latitude: form.latitude,
    longitude: form.longitude,
    title: form.title,
    content: form.content,
    images: form.images.filter((x) => x),
    tag: form.tag,
    share: form.share,
  };
  return await http<MarkerResult>({ url: "edit", method: "POST", data });
};
