import { User } from "../types/user";

export function toUsersResponse(items: User[]) {
  return items.map(({ id, nickname }) => ({
    id,
    nickname,
  }));
}
