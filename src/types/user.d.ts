export interface AuthCredentials {
  email: string;
  password: string;
}

export interface UserDocument {
  _id: string;
  email: string;
  password: string;
}
