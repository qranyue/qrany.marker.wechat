// lib/uploader.ts
import { upfile } from "../utils/http";
import { tryPromise } from "../utils/try";

type File = {
  key: string;
  url?: string;
  path?: string;
  loading?: boolean;
  error?: boolean;
};

const choose = (count: number) =>
  new Promise<string[]>((resolve, reject) => {
    wx.chooseMedia({
      count,
      mediaType: ["image"],
      sourceType: ["album", "camera"],
      success: (res) => resolve(res.tempFiles.map((f) => f.tempFilePath)),
      fail: (err) => reject(err.errMsg),
    });
  });

const uuid = () => (Math.random() * 1e18).toString(36);

Component({
  properties: {
    value: { type: Array, value: [] },
  },

  data: {
    files: [] as File[],
  },

  observers: {
    value(v: string[]) {
      if (v.length === this.data.files.length) return;
      this.setData({ files: v.map((u) => ({ key: uuid(), url: u })) });
    },
  },

  methods: {
    async choose() {
      const [files] = await tryPromise(choose(9 - this.data.files.length));
      if (!files) return;
      const len = this.data.files.length;
      await Promise.all(
        files.map(async (f, i) => {
          const [key, c] = [uuid(), len + i];
          this.setData({ [`files[${c}]`]: { key, path: f, loading: true } });
          const [u] = await tryPromise(upfile(f));
          if (!u) return this.setData({ [`files[${c}].loading`]: false, [`files[${c}].error`]: true });
          this.setData({ [`files[${c}].loading`]: false, [`files[${c}].url`]: u });
        })
      );
      const v = this.data.files.map((u) => u.url);
      this.triggerEvent("input", v);
    },

    preview(e: WechatMiniprogram.CustomEvent<{}, {}, { url: string }>) {
      wx.previewImage({ urls: this.data.value, current: e.currentTarget.dataset.url });
    },
    remove(e: WechatMiniprogram.CustomEvent<{}, {}, { url: string }>) {
      const files = this.data.files.filter((u) => (u.url || u.path) !== e.currentTarget.dataset.url);
      this.setData({ files });
      const v = files.map((u) => u.url).filter((x) => !!x);
      this.triggerEvent("input", v);
    },
  },
});
