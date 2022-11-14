declare namespace Express {
  export interface Request {
    userData: {
      name: string;
      avatarUrl: string;
      sub: string;
      iat: number;
      exp: number;
    };
  }
}
