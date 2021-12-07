import { Context, Hook } from "@foal/core";
import axios from "axios";
import { User } from "../entities";

export async function EngineService() {
  const user = await axios.post("/v1/user", {});
  return Hook((ctx: Context<User>) => {
    ctx.user = user.data;
  });
}
