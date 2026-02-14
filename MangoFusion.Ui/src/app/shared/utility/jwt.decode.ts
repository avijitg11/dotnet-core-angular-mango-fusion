import { jwtDecode } from "jwt-decode";
import { JWTToken } from "../models/jwt.token";
import { UserInfo } from "../models/user.info";

const decodeJWT = (token:string) : JWTToken | null =>{
    try{
        return jwtDecode<JWTToken>(token);
    }
    catch{
        return null;
    }
}


export const isTokenExpired = (token:string) : boolean =>{
    const decodedToken = decodeJWT(token);
    return !decodedToken?.exp || decodedToken?.exp * 1000 < Date.now();
}

export const getUserInfoFromToken = (token:string) : UserInfo | null =>{
    const decodedToken = decodeJWT(token);

    if(!decodedToken) return null;

    const user : UserInfo = {
        fullname: decodedToken.fullname,
        id: decodedToken.id,
        email: decodedToken.email,
        role: decodedToken.role,
        exp: decodedToken.exp
    };

    return user;
}