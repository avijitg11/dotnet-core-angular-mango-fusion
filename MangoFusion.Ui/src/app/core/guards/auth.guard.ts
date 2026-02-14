import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { of } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { RoutePaths } from "../../shared/models/route.path";

export const authGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);
    const authState = authService.getAuth(); 
    const routePaths = RoutePaths;
    if(authState.isAuthenticated){
        router.navigate([routePaths.HOME]);
    }
    return of(!authState.isAuthenticated);
};