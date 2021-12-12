import {
  Context,
  Get,
  HttpResponseBadRequest,
  HttpResponseOK,
} from "@foal/core";
import { setAuthCookie } from "@foal/jwt";
import axios from "axios";
import { User } from "../../entities";
import { signToken } from "./tokenizer";

export class AuthController {
  @Get("/")
  async create(ctx: Context) {
    try {
      const cookie_value = ctx.request.cookies["soloo"];

      const engineUser = await axios.get("http://localhost:4040/v1/users", {
        headers: { Authorization: `Bearer ${cookie_value}` },
      });

      const user = new User();
      user.id = engineUser.data.id;
      user.name = engineUser.data.name;
      user.email = engineUser.data.email;
      user.avatarUrl = engineUser.data.avatar;
      const res = await user.save();
      const token = signToken({
        id: res.id,
        sub: res.id.toString(),
        username: engineUser.data.username,
      });

      const response = new HttpResponseOK({
        token: token,
      });

      await setAuthCookie(response, token);
      return response;
    } catch (err) {
      console.log(err);
      return new HttpResponseBadRequest(err);
    }
  }
}
