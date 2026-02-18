import { CanActivateFn, Router } from "@angular/router";
import { AuthService } from "../services/auth.service";
import { inject } from "@angular/core";
import { RoutePaths } from "../../shared/models/route.path";
import { of } from "rxjs";

export const cartGuard : CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);
    const authState = authService.getAuth(); 
    const routePaths = RoutePaths;
    
    if(!authState.isAuthenticated){
        router.navigate([routePaths.LOGIN]);
        return of(false);
    }
    
    return of(true);
};