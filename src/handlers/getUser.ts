import { DynamoDB, S3 } from "aws-sdk";
import { APIGatewayProxyHandler } from "aws-lambda";
import { HttpResponse } from "../helpers/HttpResponse";
import { validate } from "../helpers/validate";
import { UserProvider } from "../providers";
import { userIdSchema } from "../schemas/userIdSchema";
import { USERS_TEBLE_NAME } from "../constants";

const db = new DynamoDB();
const userProvider = new UserProvider(db, USERS_TEBLE_NAME);

export const handler: APIGatewayProxyHandler = async (event) => {
  console.log("Lambda invocation with event: ", JSON.stringify(event));

  try {
    await validate(userIdSchema, event.pathParameters);

    const userId = event.pathParameters?.userId as string;
    console.log("User Id: ", userId);

    const user = await userProvider.getUser(userId);

    if (user) {
      console.log("Found user item: ", user);

      return HttpResponse.success(user);
    }
    return HttpResponse.notFound();
  } catch (e) {
    console.error("Error encountered", e);
    return HttpResponse.serverError(e);
  }
};
