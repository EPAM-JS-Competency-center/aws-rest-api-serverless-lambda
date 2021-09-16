import { DynamoDB } from "aws-sdk";
import { APIGatewayProxyHandler } from "aws-lambda";
import { HttpResponse } from "../helpers/HttpResponse";
import { toUsersResponse } from "../helpers/toUsersResponse";
import { UserProvider } from "../providers";
import { USERS_TEBLE_NAME } from "../constants";

const db = new DynamoDB();
const userProvider = new UserProvider(db, USERS_TEBLE_NAME);

export const handler: APIGatewayProxyHandler = async (event) => {
  console.log("Lambda invocation with event: ", JSON.stringify(event));

  try {
    const items = await userProvider.scanUsers();
    console.log("Found users: ", items);

    return HttpResponse.success({ data: toUsersResponse(items) });
  } catch (e) {
    console.error("Error encountered", e);
    return HttpResponse.serverError(e);
  }
};
