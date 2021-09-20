import AWS from "aws-sdk";

import { User } from "../types/user";
import { UserProvider } from "./UserProvider";

const table = "testTable";

const userList: User[] = [
  {
    id: "testId1",
    nickname: "test1",
  },
  {
    id: "testId2",
    nickname: "test2",
  },
];

const dbUserListMock = userList.map((item) =>
  AWS.DynamoDB.Converter.marshall(item)
);

function createMockDb(): AWS.DynamoDB {
  return {
    query: jest.fn().mockReturnValue({
      promise: () => {
        return Promise.resolve({ Items: dbUserListMock });
      },
    }),
    getItem: jest.fn().mockReturnValue({
      promise: () => {
        return Promise.resolve({ Item: dbUserListMock[0] });
      },
    }),
    putItem: jest.fn().mockReturnValue({
      promise: () => {
        return Promise.resolve();
      },
    }),
    deleteItem: jest.fn().mockReturnValue({
      promise: () => {
        return Promise.resolve();
      },
    }),
    transactWriteItems: jest.fn().mockReturnValue({
      promise: () => {
        return Promise.resolve();
      },
    }),
    updateItem: jest.fn().mockReturnValue({
      promise: () => {
        return Promise.resolve();
      },
    }),
    scan: jest.fn().mockReturnValue({
      promise: () => {
        return Promise.resolve({ Items: dbUserListMock });
      },
    }),
  } as unknown as AWS.DynamoDB;
}

describe("UserProvider", () => {
  let dbMock: AWS.DynamoDB;

  beforeEach(() => {
    dbMock = createMockDb();
  });

  describe("#getUser", () => {
    it("should return user by id", async () => {
      const provider = new UserProvider(dbMock, table);

      const result = await provider.getUser(userList[0].id);

      expect(dbMock.getItem).toBeCalledWith({
        TableName: table,
        Key: { id: { S: userList[0].id } },
      });

      expect(result).toStrictEqual(userList[0]);
    });
  });

  describe("#createUser", () => {
    it("should return user", async () => {
      const provider = new UserProvider(dbMock, table);

      const result = await provider.createUser(userList[0]);

      expect(dbMock.putItem).toBeCalledWith({
        TableName: table,
        Item: AWS.DynamoDB.Converter.marshall({
          ...userList[0],
        }),
        ConditionExpression: "attribute_not_exists(id)",
      });

      expect(result).toStrictEqual({ ...userList[0] });
    });
  });

  describe("#updateUser", () => {
    it("should return user from params", async () => {
      const provider = new UserProvider(dbMock, table);

      const result = await provider.updateUser(userList[0]);

      expect(dbMock.putItem).toBeCalledWith({
        TableName: table,
        Item: AWS.DynamoDB.Converter.marshall({
          ...userList[0],
        }),
      });
      expect(result).toStrictEqual({ ...userList[0] });
    });
  });

  describe("#deleteUser", () => {
    it("should call deleteItem method from db", async () => {
      const provider = new UserProvider(dbMock, table);

      await provider.deleteUser(userList[0].id);

      expect(dbMock.deleteItem).toBeCalledWith({
        TableName: table,
        Key: { id: { S: userList[0].id } },
      });
    });
  });

  describe("#scanUsers", () => {
    it("should return list of all users from the table", async () => {
      const provider = new UserProvider(dbMock, table);

      const result = await provider.scanUsers();

      expect(dbMock.scan).toBeCalledWith({
        TableName: table,
      });
      expect(result).toStrictEqual(userList);
    });
  });
});
