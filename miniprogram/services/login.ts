import { http } from "../utils/http";
import { tryPromise } from "../utils/try";

const wx_login = () => new Promise<string>((resolve, reject) => wx.login({ success: (res) => resolve(res.code), fail: (err) => reject(err.errMsg) }));

export const login = async () => {
  const [code] = await tryPromise(wx_login());
  if (!code) return;
  return await http<string>({ url: "login", data: { code } });
};
