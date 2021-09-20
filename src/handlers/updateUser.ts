import { DynamoDB } from "aws-sdk";
import { APIGatewayProxyHandler } from "aws-lambda";
import { HttpResponse } from "../helpers/HttpResponse";
import { parseUserBody } from "../helpers/parseUserBody";
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
  } catch (e) {
    return HttpResponse.badRequest(e);
  }

  try {
    const userId = event.pathParameters?.userId as string;
    console.log("User id: ", userId);

    const userData = parseUserBody(event.body as string);
    console.log("User data: ", userData);

    const user = await userProvider.updateUser({ ...userData, id: userId });

    console.log("Updated user: ", user);

    return HttpResponse.success(user);
  } catch (e) {
    console.error("Error encountered", e);
    return HttpResponse.serverError(e);
  }
};
