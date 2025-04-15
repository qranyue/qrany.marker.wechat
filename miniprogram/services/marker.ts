import { MapMarker } from "../types/marker";
import { http } from "../utils/http";
import { tryPromise } from "../utils/try";

type MarkerResult = {
  id: number;
  latitude: number;
  longitude: number;
  title: string;
  tag: string;
  tagId: number;
  content: string;
};

export const getMarkers = async () =>
  (
    (
      await tryPromise(
        http<MarkerResult[]>({ url: "markers" })
      )
    )[0] || []
  ).map<MapMarker>((x) => ({
    id: x.id,
    latitude: x.latitude,
    longitude: x.longitude,
    title: x.title,
    clusterId: x.tagId,
    joinCluster: true,
  }));

/** 编辑表单 */
type EditForm = {
  /** 内容 */
  content?: string;
  /** 主键 */
  id?: number;
  /** 图片 */
  images: (string | undefined)[];
  /** 经度 */
  latitude: number;
  /** 纬度 */
  longitude: number;
  /** 公开 */
  share: boolean;
  /** 标签 */
  tag: string;
  /** 标题 */
  title: string;
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
  const [m] = await tryPromise(
    http<MarkerResult>({ url: "edit", method: "POST", data })
  );
  if (!m) return;
  return { id: m.id, latitude: m.latitude, longitude: m.longitude, title: m.title, clusterId: m.tagId, joinCluster: true } as MapMarker;
};

/** InfoResult，标记详情 */
export type InfoResult = {
  /** 主键 */
  id: number;
  /** 经度 */
  latitude: number;
  /** 纬度 */
  longitude: number;
  /** 标题 */
  title: string;
  /** 内容 */
  content?: string;
  /** 标签 */
  tag: string;
  /** 图片 */
  images: string[];
  /** 编辑 */
  edit: boolean;
  /** 公开 */
  share: boolean;
};

export const info = async (id: string) =>
  (
    await tryPromise(
      http<InfoResult>({ url: "info", data: { id } })
    )
  )[0];

export const remove = async (id: string) =>
  (
    await tryPromise(
      http<boolean>({ url: "remove", data: { id } })
    )
  )[0];
