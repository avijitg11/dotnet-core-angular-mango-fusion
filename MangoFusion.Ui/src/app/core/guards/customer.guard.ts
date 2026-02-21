import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { of } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { RoutePaths } from "../../shared/models/route.path";
import { UserRoles } from '../../shared/models/user.roles';

export const customerGuard : CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);
    const authState = authService.getAuth(); 
    const routePaths = RoutePaths;
    const userRoles = UserRoles;
    
    if(!authState.isAuthenticated || authState.user?.role !== userRoles[0]){
        router.navigate([routePaths.HOME]);
        return of(false);
    }
    
    return of(true);
};