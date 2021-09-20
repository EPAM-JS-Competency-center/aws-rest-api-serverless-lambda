import { UserApiRequest } from "../types/user";

export function parseUserBody(body: string): UserApiRequest {
  const item = JSON.parse(body);

  return {
    nickname: item.nickname,
  };
}
