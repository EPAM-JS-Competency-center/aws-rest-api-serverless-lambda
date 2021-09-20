import { DynamoDB } from "aws-sdk";
import { User } from "../types/user";

export class UserProvider {
  constructor(private readonly db: DynamoDB, private readonly table: string) {}

  async getUser(id: string): Promise<User | null> {
    const item = await this.db
      .getItem({
        TableName: this.table,
        Key: { id: { S: id } },
      })
      .promise();
    return UserProvider.unmarshall(item.Item);
  }

  async createUser(user: User): Promise<User> {
    const item = { ...user };

    await this.db
      .putItem({
        TableName: this.table,
        Item: DynamoDB.Converter.marshall(item),
        ConditionExpression: "attribute_not_exists(id)",
      })
      .promise();

    return item as User;
  }

  async updateUser(user: User): Promise<User> {
    await this.db
      .putItem({
        TableName: this.table,
        Item: DynamoDB.Converter.marshall(user),
      })
      .promise();
    return user;
  }

  async deleteUser(id: string): Promise<void> {
    await this.db
      .deleteItem({
        TableName: this.table,
        Key: { id: { S: id } },
      })
      .promise();
  }

  async scanUsers(): Promise<User[]> {
    const { Items = [] } = await this.db
      .scan({
        TableName: this.table,
      })
      .promise();

    return (Items || []).map(UserProvider.unmarshall) as User[];
  }

  private static unmarshall(
    item?: AWS.DynamoDB.AttributeMap | null
  ): User | null {
    if (item == null) {
      return null;
    }
    return DynamoDB.Converter.unmarshall(item) as User;
  }
}
