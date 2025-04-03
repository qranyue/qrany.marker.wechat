import { login } from "./services/login";
import { setToken } from "./stores/user";
import { get_storage } from "./utils/storage";

// app.ts

App({
  onLaunch() {
    if (!get_storage("TOKEN")) setToken(login());
  },
});
