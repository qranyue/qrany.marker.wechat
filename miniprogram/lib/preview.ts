// lib/preview.ts
Component({
  properties: {
    values: { type: Array, value: [] },
  },

  methods: {
    preview(e: WechatMiniprogram.CustomEvent<{}, {}, { url: string }>) {
      const { url } = e.currentTarget.dataset;
      wx.previewImage({ urls: this.data.values, current: url });
    },
  },
});
