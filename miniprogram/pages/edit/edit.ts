// pages/edit/edit.ts

import { edit, info, remove } from "../../services/marker";
import { tags } from "../../services/tag";
import { MapMarker } from "../../types/marker";
import { Tag } from "../../types/tag";
import { emit } from "../../utils/event";
import { getOption } from "../../utils/router";

Page({
  data: {
    id: void 0 as number | undefined,
    latitude: void 0 as number | undefined,
    longitude: void 0 as number | undefined,
    title: "",
    content: "",
    tag: "",
    images: [] as string[],
    share: true,

    tags: [] as Tag[],

    spinning: true,
    uploading: false,
    loading: false,
    removeing: false,
    saved: void 0 as MapMarker | undefined,
  },

  async onSubmit() {
    this.setData({ loading: true });
    if (emit<boolean[]>("rule").some((x) => !x)) return this.setData({ loading: false });
    const [f, u] = [this.data, getOption()];
    const r = await edit({ ...f, latitude: +(u.lat ?? f.latitude ?? 0), longitude: +(u.lng ?? f.longitude ?? 0) });
    if (r) wx.navigateBack();
    this.setData({ loading: false, saved: r });
  },

  async onRemove() {
    this.setData({ removeing: true });
    await remove(getOption().id!);
    this.setData({ removeing: false });
    wx.navigateBack({ delta: getCurrentPages().length - 1 });
  },

  onUploader(e: WechatMiniprogram.CustomEvent<string[]>) {
    this.setData({ images: e.detail, uploading: e.detail.some((_) => !!_) });
  },

  onTag(e: WechatMiniprogram.CustomEvent<{}, {}, { name: string }>) {
    this.setData({ tag: e.currentTarget.dataset.name });
  },

  async getInfo(id: string) {
    this.setData({ spinning: true });
    const i = await info(id);
    if (!i) return this.setData({ spinning: false });
    this.setData({
      id: i.id,
      tag: i.tag,
      latitude: i.latitude,
      longitude: i.longitude,
      title: i.title,
      content: i.content,
      images: i.images,
      share: i.share,
      uploading: true,
      spinning: false,
    });
  },

  async getTags() {
    const r = await tags();
    if (r) this.setData({ tags: r });
  },

  onLoad(query) {
    if (query.id) this.getInfo(query.id);
    else this.setData({ spinning: false });
    this.getTags();
  },
  onUnload() {
    const e = this.getOpenerEventChannel();
    e.emit(this.data.saved ? "resolve" : "reject", this.data.saved || "返回");
  },
});
