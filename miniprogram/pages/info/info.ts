import { MAP_KEY } from "../../const";
import { info } from "../../services/marker";
import { getToken } from "../../stores/user";
import { getOption } from "../../utils/router";

// pages/info/info.ts
Page({
  data: {
    MAP_KEY,

    /** 主键 */
    id: void 0 as number | void,
    /** 经度 */
    latitude: void 0 as number | void,
    /** 纬度 */
    longitude: void 0 as number | void,
    /** 标题 */
    title: "",
    /** 内容 */
    content: "",
    /** 标签 */
    tag: "",
    /** 图片 */
    images: [] as string[],
    /** 编辑 */
    edit: false,
    /** 公开 */
    share: false,

    loading: true,
  },

  async info() {
    this.setData({ loading: true });
    await getToken();
    const r = await info(getOption().id || "0");
    this.setData({ ...r, loading: false });
  },

  open() {
    const d = this.data;
    wx.openLocation({ latitude: d.latitude!, longitude: d.longitude! });
  },

  edit() {
    const d = this.data;
    wx.navigateTo({ url: `/pages/edit/edit?id=${d.id}` });
  },

  onLoad() {
    this.info();
  },
});
