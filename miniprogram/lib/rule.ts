import { off, on } from "../utils/event";

// lib/rule.ts
Component({
  properties: {
    value: {
      type: Boolean,
      observer() {
        this.data.ready && this.verify();
      },
    },
    tip: { type: String, value: "" },
  },

  data: {
    visible: "hidden",
    ready: false,
    fn: void 0 as (() => void) | undefined,
  },

  methods: {
    verify() {
      this.setData({
        visible: this.data.value ? "hidden" : "visible",
      });
      return this.data.value;
    },
  },

  lifetimes: {
    created() {
      on("rule", (this.data.fn = () => this.verify()));
    },
    ready() {
      this.setData({ ready: true });
    },
    detached() {
      this.setData({ ready: false });
      const fn = this.data.fn;
      fn && off("rule", fn);
    },
  },
});
