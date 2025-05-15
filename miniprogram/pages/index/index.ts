// index.ts

import { MAP_KEY } from "../../const";
import { getMarkers } from "../../services/marker";
import { getToken } from "../../stores/user";
import type { MapMarker } from "../../types/marker";
import { nextTick } from "../../utils/next";
import { tryPromise } from "../../utils/try";

const addMarkers = async (lat: number, lng: number) => {
  const [m] = await tryPromise(
    new Promise<MapMarker>((resolve, reject) =>
      wx.navigateTo({
        url: `/pages/edit/edit?lat=${lat}&lng=${lng}`,
        events: { resolve, reject },
      })
    )
  );
  if (!m) return;
  return m;
};

const getCenter = async (map: WechatMiniprogram.MapContext | void) =>
  (
    await tryPromise(
      new Promise<WechatMiniprogram.GetCenterLocationSuccessCallbackResult>((resolve, reject) =>
        map?.getCenterLocation({
          success: resolve,
          fail: (err) => reject(err.errMsg),
        })
      )
    )
  )[0];
const getLocation = async () => {
  const l = (
    await tryPromise(
      new Promise<WechatMiniprogram.GetLocationSuccessCallbackResult>((resolve, reject) =>
        wx.getLocation({
          success: resolve,
          fail: (err) => reject(err.errMsg),
        })
      )
    )
  )[0];
  if (!l || !l.latitude || !l.longitude) return;
  return { latitude: l.latitude, longitude: l.longitude };
};

// 获取应用实例
Page({
  data: {
    MAP_KEY,

    latitude: void 0 as number | void,
    longitude: void 0 as number | void,

    markers: [] as MapMarker[],

    loading: true,
    add_loading: false,
  },

  map: void 0 as WechatMiniprogram.MapContext | void,

  onMarkerTap(e: WechatMiniprogram.MarkerTap) {
    const mId = e.detail.markerId;
    wx.navigateTo({ url: `/pages/info/info?id=${mId}` });
  },

  async onTap() {
    if (this.data.add_loading) return;
    this.setData({ add_loading: true });
    const l = await getCenter(this.map);
    this.setData({ add_loading: false });
    if (!l) return;
    const m = await addMarkers(l.latitude, l.longitude);
    if (!m) return;
    const len = this.data.markers.length;
    this.setData({ [`markers[${len}]`]: m });
  },

  async setCenter() {
    const l = await getLocation();
    l && this.setData(l);
  },

  async addMarkers() {
    this.setData({ loading: true });
    this.map?.initMarkerCluster({});
    await nextTick();
    await getToken();
    this.setData({ markers: await getMarkers(), loading: false });
  },

  onReady() {
    this.map = wx.createMapContext("map");
    this.setCenter();
    this.addMarkers();
  },
});
