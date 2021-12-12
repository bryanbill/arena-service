import { Context, Hook } from "@foal/core";
import axios from "axios";
import { User } from "../entities";

export function EngineService() {
  const user = Promise.resolve(axios.post("/v1/user", {})).then(
    async (res) => await res.data
  );
  return Hook(async (ctx: Context<User>) => {
    ctx.user = await user;
  });
}
