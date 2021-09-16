import { toUsersResponse } from "./toUsersResponse";

describe("Campaigns Controller Response", () => {
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
