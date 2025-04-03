import { off, on } from "../utils/event";

// lib/rule.ts
Component({
  properties: {
    value: { type: Boolean },
    tip: { type: String, value: "" },
  },

  data: {
    visible: "hidden",

    fn: () => {},
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
    detached() {
      off("rule", this.data.fn);
    },
  },
});
