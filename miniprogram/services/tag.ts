import { Tag } from "../types/tag";
import { http } from "../utils/http";
import { tryPromise } from "../utils/try";

export const tags = async () =>
  (
    await tryPromise(
      http<Tag[]>({ url: "tags" })
    )
  )[0] || [];
