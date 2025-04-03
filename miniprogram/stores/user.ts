import { get_storage, set_storage } from "../utils/storage";
import { tryPromise } from "../utils/try";

let TOKEN = Promise.resolve(get_storage<string>("TOKEN"));

export const setToken = async (token: typeof TOKEN) => {
  TOKEN = token;
  const v = await token;
  if (v) set_storage("TOKEN", v, Date.now() + 7 * 3600000);
};

export const getToken = async () => TOKEN && (await tryPromise(TOKEN))[0];
