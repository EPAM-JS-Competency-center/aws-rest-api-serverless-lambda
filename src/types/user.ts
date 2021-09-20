export interface User {
  id: string;
  nickname: string;
}

export interface UserApiRequest extends Omit<User, "id"> {}

export interface UserApiResponse extends User {}
