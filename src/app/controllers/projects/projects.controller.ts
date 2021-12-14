import {
  Context,
  Get,
  HttpResponseOK,
  Post,
  Put,
  ValidateBody,
} from "@foal/core";
import { JWTRequired } from "@foal/jwt";
import { fetchUser } from "@foal/typeorm";
import { Project, User } from "../../entities";
import { issuePartial } from "../../helpers/utils/serializers/issues";
import {
  createEntity,
  findEntityOrThrow,
  updateEntity,
} from "../../helpers/utils/typeorm";

@JWTRequired({ cookie: true, user: fetchUser(User) })
export class ProjectsController {
  @Get("/")
  async getProject(ctx: Context) {
    const project = await findEntityOrThrow(Project, ctx.user.projectId, {
      relations: ["users", "issues"],
    });
    return new HttpResponseOK({
      project: {
        ...project,
        issues: project.issues.map(issuePartial),
      },
    });
  }

  @Post("/")
  @ValidateBody({
    properties: {
      name: { type: "string" },
      description: { type: "string" },
      url: { type: "string" },
      category: { type: "string" },
      users: { type: "array" },
    },
  })
  async createProject(ctx: Context) {
    // get user object for each user id
    let users: User[] = [];
    for (let i = 0; i < ctx.request.body.users.length; i++) {
      users.push(await findEntityOrThrow(User, ctx.request.body.users[i]));
    }
    //mutate the original payload removing user ids
    delete ctx.request.body.users;
    const payload = {
      ...ctx.request.body,
      users,
    };
    const project = await createEntity(Project, ctx.request.body);
    return new HttpResponseOK(project);
  }

  @Put("/")
  async updateProject(ctx: Context) {
    const project = await updateEntity(
      Project,
      ctx.user.projectId,
      ctx.request.body
    );

    return new HttpResponseOK(project);
  }
}
