// index.ts

import { getMarkers, MarkerResult } from "../../services/marker";
import { getToken } from "../../stores/user";
import type { MapMarker } from "../../types/marker";
import { tryPromise } from "../../utils/try";

const addMarkers = async (lat: number, lng: number) =>
  new Promise<MarkerResult>((resolve, reject) =>
    wx.navigateTo({
      url: `/pages/edit/edit?lat=${lat}&lng=${lng}`,
      events: { resolve, reject },
    })
  );

let mapCtx: WechatMiniprogram.MapContext | undefined;

const getLocation = () =>
  new Promise<WechatMiniprogram.GetLocationSuccessCallbackResult>((resolve, reject) => wx.getLocation({ success: resolve, fail: (err) => reject(err.errMsg) }));

const getCenter = () =>
  new Promise<WechatMiniprogram.GetCenterLocationSuccessCallbackResult>((resolve, reject) => mapCtx?.getCenterLocation({ success: resolve, fail: (err) => reject(err.errMsg) }));

// 获取应用实例
Component({
  data: {
    add_loading: false,
  },

  methods: {
    onMarkerTap(e: WechatMiniprogram.MarkerTap) {
      const mId = e.detail.markerId;
      wx.navigateTo({ url: `/pages/info/info?id=${mId}` });
    },
    async onTap() {
      if (this.data.add_loading) return;
      this.setData({ add_loading: true });
      const [l] = await tryPromise(getCenter());
      this.setData({ add_loading: false });
      if (!l) return;
      const [m] = await tryPromise(addMarkers(l.latitude, l.longitude));
      if (!m) return;
      mapCtx?.addMarkers({
        markers: [{ id: m.id, latitude: l.latitude, longitude: l.longitude, title: m.content, clusterId: m.tagId, joinCluster: true } as MapMarker],
      });
    },

    async setCenter() {
      const [l] = await tryPromise(getLocation());
      if (!l) return;
      mapCtx?.moveToLocation({
        latitude: l.latitude,
        longitude: l.longitude,
      });
    },

    async getMarkers() {
      await getToken();
      const [res] = await tryPromise(getMarkers());
      if (!res) return [];
      return res.map<MapMarker>((x) => ({
        id: x.id,
        latitude: x.latitude,
        longitude: x.longitude,
        title: x.content,
        clusterId: x.tagId,
        joinCluster: true,
      }));
    },
    async addMarkers() {
      mapCtx?.addMarkers({ markers: await this.getMarkers() });
    },
  },

  lifetimes: {
    async ready() {
      mapCtx = wx.createMapContext("map");
      this.setCenter();
      this.addMarkers();
    },
  },
});
