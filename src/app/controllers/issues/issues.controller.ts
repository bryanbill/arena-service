import {
  Context,
  Delete,
  Get,
  HttpResponseOK,
  Post,
  Put,
  ValidateBody,
  ValidatePathParam,
} from "@foal/core";
import { JWTRequired } from "@foal/jwt";
import { fetchUser } from "@foal/typeorm";
import { Issue, Project, User } from "../../entities";
import {
  createEntity,
  deleteEntity,
  findEntityOrThrow,
  updateEntity,
} from "../../helpers/utils/typeorm";

@JWTRequired({ cookie: true, user: fetchUser(User) })
export class IssuesController {
  @Get("/")
  async getProjectIssues(ctx: Context) {
    const { projectId } = ctx.user.projectId;
    const { searchTerm } = ctx.request.query;

    let whereSQL = "issue.projectId = :projectId";

    if (searchTerm) {
      whereSQL +=
        " AND (issue.title ILIKE :searchTerm OR issue.descriptionText ILIKE :searchTerm)";
    }

    const issues = await Issue.createQueryBuilder("issue")
      .select()
      .where(whereSQL, { projectId, searchTerm: `%${searchTerm}%` })
      .getMany();
    return new HttpResponseOK(issues);
  }

  @Get("/:id")
  @ValidatePathParam("id", Issue)
  async getIssueWithUsersAndComments(ctx: Context) {
    const issue = await findEntityOrThrow(Issue, ctx.request.params.id, {
      relations: ["users", "comments", "comments.user"],
    });
    return new HttpResponseOK(issue);
  }

  @Post("/")
  @ValidateBody({
    properties: {
      title: { type: "string" },
      type: { type: "string" },
      status: { type: "string" },
      priority: { type: "string" },
      description: { type: "string" },
      estimate: { type: "number" },
      timeSpent: { type: "number" },
      reporterId: { type: "number" },
      projectId: { type: "number" },
      users: { type: "array" },
    },
  })
  async createIssue(ctx: Context) {
    // get user object for each user id
    let users: User[] = [];
    for (let i = 0; i < ctx.request.body.users.length; i++) {
      users.push(await findEntityOrThrow(User, ctx.request.body.users[i]));
    }

    // get project object for the project id
    const project = await findEntityOrThrow(
      Project,
      ctx.request.body.projectId
    );

    //mutate the original payload removing user ids
    delete ctx.request.body.users;
    delete ctx.request.body.projectId;

    const payload = {
      ...ctx.request.body,
      project,
      users,
    };

    const listPosition = await this.calculateListPosition(payload);
    const issue = await createEntity(Issue, {
      ...payload,
      listPosition,
    });

    return new HttpResponseOK(issue);
  }

  @Put("/:id")
  @ValidatePathParam("id", Issue)
  @ValidateBody({
    properties: {},
  })
  async updateIssue(ctx: Context) {
    const issue = await updateEntity(
      Issue,
      ctx.request.params.id,
      ctx.request.body
    );
    return new HttpResponseOK(issue);
  }

  @Delete("/:id")
  @ValidatePathParam("id", Issue)
  async deleteIssue(ctx: Context) {
    const issue = await deleteEntity(Issue, ctx.request.params.issueId);
    return new HttpResponseOK(issue);
  }
  calculateListPosition = async ({
    projectId,
    status,
  }: Issue): Promise<number> => {
    const issues = await Issue.find({ projectId, status });

    const listPositions = issues.map(({ listPosition }) => listPosition);

    if (listPositions.length > 0) {
      return Math.min(...listPositions) - 1;
    }
    return 1;
  };
}
