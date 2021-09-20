import { DynamoDB, S3 } from "aws-sdk";
import { APIGatewayProxyHandler } from "aws-lambda";
import { HttpResponse } from "../helpers/HttpResponse";
import { parseUserBody } from "../helpers/parseUserBody";
import { UserProvider } from "../providers";
import { USERS_TEBLE_NAME } from "../constants";
import { v4 } from "uuid";

const db = new DynamoDB();
const userProvider = new UserProvider(db, USERS_TEBLE_NAME);

export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    console.log("Lambda invocation with event: ", JSON.stringify(event));

    const userData = parseUserBody(event.body as string);
    console.log("User data: ", userData);

    const user = await userProvider.createUser({ id: v4(), ...userData });
    console.log("Created user: ", user);

    return HttpResponse.success(user);
  } catch (e) {
    console.error("Error encountered", e);
    return HttpResponse.serverError(e);
  }
};
