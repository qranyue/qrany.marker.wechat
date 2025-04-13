// pages/edit/edit.ts

import { edit } from "../../services/edit";
import { MarkerResult } from "../../services/marker";
import { Tag } from "../../types/tag";
import { emit } from "../../utils/event";
import { tryPromise } from "../../utils/try";

Component({
  data: {
    id: void 0 as number | undefined,
    title: "",
    content: "",
    tag: "",
    images: [] as string[],
    share: true,

    tags: [] as Tag[],

    uploading: false,
    loading: false,
    saved: void 0 as MarkerResult | undefined,
  },

  observers: {
    images(images: string[]) {
      this.setData({ uploading: images.some((_) => !!_) });
    },
  },

  methods: {
    async onSubmit() {
      this.setData({ loading: true });
      if (emit<boolean[]>("rule").some((x) => !x)) return this.setData({ loading: false });
      const [f, u] = [this.data, getCurrentPages().slice(-1)[0].options];
      const [r] = await tryPromise(edit({ ...f, latitude: +(u.lat ?? 0), longitude: +(u.lng || 0) }));
      if (r) wx.navigateBack();
      this.setData({ loading: false, saved: r });
    },

    onUploader(e: WechatMiniprogram.CustomEvent<string[]>) {
      this.setData({ images: e.detail });
    },

    onTag(e: WechatMiniprogram.CustomEvent<{}, {}, { name: string }>) {
      this.setData({ tag: e.currentTarget.dataset.name });
    },
  },

  lifetimes: {
    detached() {
      const e = this.getOpenerEventChannel();
      e.emit(this.data.saved ? "resolve" : "reject", this.data.saved || "返回");
    },
  },
});
