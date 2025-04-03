type Storage<T> = {
  expire: number
  value: T
}

export const get_storage = <T>(key: string) => {
  const v = wx.getStorageSync<Storage<T>>(key)
  if (!v) return
  if (!('expire' in v)) return
  if (!v.expire) return v.value
  if (v.expire > Date.now()) return v.value
  return
}

export const set_storage = <T>(key: string, value: T, expire = 0) => {
  wx.setStorageSync(key, { expire, value })
}