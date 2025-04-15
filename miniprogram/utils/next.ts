export const nextTick = () => new Promise((resolve) => wx.nextTick(resolve));
