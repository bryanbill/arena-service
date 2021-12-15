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
     
      const engineUser = await axios.get("http://localhost:4040/v1/users", {
        });
      // check if user exists in arena
      const thisuser = await User.findOne({
        where: {
          id: engineUser.data.id,
        },
      });
      const user = new User();
      if (thisuser) {
        await User.update(
          {
            id: engineUser.data.id,
          },
          {
            name: engineUser.data.name,
            email: engineUser.data.email,
          }
        );
        return new HttpResponseOK();
      }
      user.id = engineUser.data.id;
      user.name = engineUser.data.name;
      user.email = engineUser.data.email;
      user.avatarUrl = engineUser.data.avatar;
      const res = await user.save();
      const token = signToken({
        id: res.id,
        sub: res.id.toString(),
        username: engineUser.data.username,
        projectId: res.projectId,
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
