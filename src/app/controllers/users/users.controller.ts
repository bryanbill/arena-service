import { ApiUseTag, Context, Get, HttpResponseOK } from "@foal/core";
import { JWTRequired } from "@foal/jwt";
import { fetchUser } from "@foal/typeorm";
import axios from "axios";
import { User } from "../../entities";

@ApiUseTag("Users")
@JWTRequired({ cookie: true, user: fetchUser(User) })
export class UsersController {
  @Get("/")
  async getUser(ctx: Context) {
    const user = await User.findOne(ctx.user.id);

    return new HttpResponseOK(user);
  }
}
