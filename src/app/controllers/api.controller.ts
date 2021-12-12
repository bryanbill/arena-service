import {
  ApiInfo,
  ApiServer,
  ApiUseTag,
  Config,
  Context,
  controller,
  Get,
  HttpResponseForbidden,
  HttpResponseOK,
} from "@foal/core";
import { AuthController } from "./auth";
import { UsersController } from "./users";

@ApiInfo({
  title: "Soloo Arena API",
  version: "0.0.1",
})
@ApiServer({
  url: `/${Config.get("version", "string", "/v1")}`,
})
export class ApiController {
  subControllers = [
    controller("/users", UsersController),
    controller("/auth", AuthController),
  ];
}
