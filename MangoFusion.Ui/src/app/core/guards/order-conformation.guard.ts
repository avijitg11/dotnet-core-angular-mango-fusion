import { CanActivateFn, Router } from "@angular/router";
import { AuthService } from "../services/auth.service";
import { inject } from "@angular/core";
import { RoutePaths } from "../../shared/models/route.path";
import { of } from "rxjs";
import { OrderService } from "../services/order.service";

export const orderConformationGuard : CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    const orderService = inject(OrderService);
    const router = inject(Router);
    const authState = authService.getAuth(); 
    const routePaths = RoutePaths;
    
    if(!authState.isAuthenticated || orderService.orderConfirmedDetails().orderId === 0){
        router.navigate([routePaths.HOME]);
        return of(false);
    }
    
    return of(true);
};