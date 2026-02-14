import { HttpClient } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { inject, Injectable, signal } from "@angular/core";
import { LoginUser } from "../../shared/models/login.user";
import { Observable } from "rxjs";
import { RegisterUser } from "../../shared/models/register.user";
import { AbstractControl } from "@angular/forms";
import { Response } from '../../shared/models/response.model';
import { getUserInfoFromToken, isTokenExpired } from "../../shared/utility/jwt.decode";
import { AuthState } from "../../shared/models/auth.state";
import { LocalStorage } from "../../shared/models/localstorage";

@Injectable({ providedIn: 'root' })
export class AuthService{
    private baseUrl : string =  environment.apiUrl;
    private http = inject(HttpClient);
    private defaultAuthState: AuthState = {
        isAuthenticated: false,
        token: null,
        user: null
    };
    authState = signal<AuthState>(this.defaultAuthState);

    login(user:LoginUser):Observable<Response>{
        return this.http.post<Response>(this.baseUrl + "api/Auth/login", user);
    }

    logout(){
        localStorage.removeItem(LocalStorage.AUTH_STATE);
        this.authState.set(this.defaultAuthState);
    }

    register(user:RegisterUser):Observable<Response>{
        return this.http.post<Response>(this.baseUrl + "api/Auth/register", user);
    }


    checkEqualValues(controlName1:string,controlName2:string){
        return (control:AbstractControl) =>{
            const val1 = control.get(controlName1)?.value;
            const val2 = control.get(controlName2)?.value;
            if(val1 === val2)
            {
                return null;
            }
            return {passwordmismatch:true};
        };
    }

    checkPasswordRegex(controlName:string){
        return (control:AbstractControl) =>{
            const value = control.get(controlName)?.value;
            if( /[A-Z]/.test(value) && /[a-z]/.test(value) && /[0-9]/.test(value) && /[^A-Za-z0-9]/.test(value))
            {
                return null;
            }
            return {passwordregexfailed:true};
        };
    }

    setAuth(token:string){
        const userInfo = getUserInfoFromToken(token);
        let authState : AuthState = {
            isAuthenticated : true,
            token : token,
            user : userInfo
        };
        localStorage.setItem(LocalStorage.AUTH_STATE,JSON.stringify(authState));
        this.authState.set(authState);
    }

    getAuth(): AuthState {
        const stored = localStorage.getItem(LocalStorage.AUTH_STATE);

        if (!stored) {
            return this.defaultAuthState;
        }

        try {
            const authStateInfo: AuthState = JSON.parse(stored);

            // Token validation
            if (!authStateInfo.token || isTokenExpired(authStateInfo.token)) {
                localStorage.removeItem(LocalStorage.AUTH_STATE);
                return this.defaultAuthState;
            }

            return authStateInfo;
        } catch {
            // Invalid JSON case
            localStorage.removeItem(LocalStorage.AUTH_STATE);
            return this.defaultAuthState;
        }
    }

    // getInitialAuthState() : AuthState {
    //     const userToken = localStorage.getItem(LocalStorage.USER_TOKEN);
    //     const userInfo = localStorage.getItem(LocalStorage.USER_INFO);
    //     let user: UserInfo | null = null;

    //     if(!userToken || userToken === 'undefined' || userToken === null || userToken === 'null' || isTokenExpired(userToken)){
    //         localStorage.removeItem(LocalStorage.USER_TOKEN);
    //         localStorage.removeItem(LocalStorage.USER_INFO);
            
    //         let authState : AuthState = {
    //             isAuthenticated : false,
    //             token : null,
    //             user : null
    //         };            

    //         return authState;
    //     }

    //     if(userInfo || userInfo === 'undefined' || userInfo === null || userInfo === 'null'){
    //         try{
    //             user = JSON.parse(userInfo===null?'':userInfo);
    //         }
    //         catch
    //         {
    //             user = getUserInfoFromToken(userToken);
    //             if(user){
    //                 localStorage.setItem(LocalStorage.USER_INFO,JSON.stringify(user));
    //             }
    //         }
    //     }

    //     let authState : AuthState = {
    //         isAuthenticated : !!userToken && !!user,
    //         token : userToken,
    //         user
    //     };
        
    //     return authState;
    // }
}




