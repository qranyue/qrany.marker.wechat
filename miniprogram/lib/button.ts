// lib/button.ts
Component({
  properties: {
    form: { type: String },
    type: { type: String },
    disabled: { type: Boolean, value: false },
    loading: { type: Boolean, value: false },
  },

  methods: {
    onClick() {
      this.triggerEvent("tap", {});
    },
  },
});
