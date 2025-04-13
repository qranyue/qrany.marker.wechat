import { off, on } from "../utils/event";

// lib/rule.ts
Component({
  properties: {
    value: { type: Boolean },
    tip: { type: String, value: "" },
  },

  data: {
    visible: "hidden",

    fn: void 0 as (() => void) | undefined,
  },

  observers: {
    value() {
      this.data.fn && this.verify();
    },
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
    ready() {
      on("rule", (this.data.fn = () => this.verify()));
    },
    detached() {
      const fn = this.data.fn;
      fn && off("rule", fn);
    },
  },
});
