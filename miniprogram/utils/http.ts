import { login } from "../services/login";
import { getToken, setToken } from "../stores/user";
import { get_storage } from "./storage";

type HttpOption = {
  url: string;
  method?: "POST" | "PUT";
  data?: WechatMiniprogram.IAnyObject;
  toast?: boolean;
};

/**
 * InfoResultRS
 */
export type RS<T> = { data: T; success: true } | { success: false; message: string };

const base = "https://marker.qran.site/v/";

let notlogin = false;
const relogin = async (fn: () => void) => {
  if (!notlogin) (notlogin = true), setToken(login());
  await getToken();
  notlogin = false;
  fn();
};

export const http = <T>(option: HttpOption) =>
  new Promise<T>((resolve, reject) => {
    const header = {} as WechatMiniprogram.IAnyObject;
    const token = get_storage<string>("TOKEN");
    if (token) header["token"] = token;
    wx.request<RS<T>>({
      url: `${base}${option.url}`,
      header,
      method: option.method ?? "GET",
      data: option.data,
      success: async ({ data, statusCode }) => {
        if (data.success) return resolve(data.data);
        if (statusCode === 401) return relogin(() => resolve(http(option)));
        reject(data.message);
      },
    });
  });

export const upfile = (path: string) => {
  return new Promise<string>((resolve, reject) => {
    const header = {} as WechatMiniprogram.IAnyObject;
    const token = get_storage<string>("TOKEN");
    if (token) header["token"] = token;
    wx.uploadFile({
      url: `${base}upload`,
      filePath: path,
      name: "file",
      header,
      success: (res) => {
        const r: RS<string> = JSON.parse(res.data);
        if (r.success) resolve(base + r.data);
        else reject(r.message);
      },
      fail: (err) => reject(err.errMsg),
    });
  });
};
