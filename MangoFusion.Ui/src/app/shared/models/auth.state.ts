import { UserInfo } from "./user.info"

export type AuthState = {
    user : null | UserInfo;
    token : null | string;
    isAuthenticated : boolean;
}