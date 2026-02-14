export type JWTToken = {
  fullname: string;
  id: string;
  email: string;
  role: string;
  nbf: number;
  exp: number;
  iat: number;
};