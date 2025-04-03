// lib/button.ts
Component({
  behaviors: ["wx://form-field-button"],

  properties: {
    disabled: { type: Boolean, value: false },
    loading: { type: Boolean, value: false },
  },
});
