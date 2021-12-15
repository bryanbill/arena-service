import {
  ApiInfo,
  ApiServer,
  ApiUseTag,
  Config,
  Context,
  controller,
  Get,
  Hook,
  HttpResponseForbidden,
  HttpResponseNoContent,
  HttpResponseOK,
  Options,
} from "@foal/core";
import { response } from "express";
import { AuthController } from "./auth";
import { CommentsController } from "./comments";
import { IssuesController } from "./issues";
import { ProjectsController } from "./projects";
import { UsersController } from "./users";

@ApiInfo({
  title: "Soloo Arena API",
  version: "0.0.1",
})
@ApiServer({
  url: `/${Config.get("version", "string", "/v1")}`,
})
@Hook((ctx) => (response) => {
  response.setHeader(
    "Access-Control-Allow-Origin",
    ctx.request.get("Origin") || "http:localhost:8081"
  );
  response.setHeader("Access-Control-Allow-Credentials", "true");
})
export class ApiController {
  subControllers = [
    controller("/currentUser", UsersController),
    controller("/auth", AuthController),
    controller("/project", ProjectsController),
    controller("/issues", IssuesController),
    controller("/comments", CommentsController),
  ];
  @Options("*")
  options(ctx: Context) {
    const response = new HttpResponseNoContent();
    response.setHeader(
      "Access-Control-Allow-Methods",
      "HEAD, GET, POST, PUT, PATCH, DELETE"
    );
    response.setHeader(
      "Access-Control-Allow-Headers",
      "Content-Type,Authorization"
    );
    return response;
  }
}
