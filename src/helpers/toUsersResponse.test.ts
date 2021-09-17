import { toUsersResponse } from "./toUsersResponse";

describe("Users Controller Response", () => {
  it("should create controller response", async () => {
    const result = toUsersResponse([
      {
        id: "test-id",
        nickname: "Test",
      },
    ]);

    expect(result).toStrictEqual([
      {
        nickname: "Test",
        id: "test-id",
      },
    ]);
  });
});
