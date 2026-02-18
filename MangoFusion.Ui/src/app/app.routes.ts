import { Routes } from '@angular/router';
import { RoutePaths } from './shared/models/route.path';
import { HomeComponent } from './features/home/home.component';
import { MenuManagementComponent } from './features/menu-management/menu-management.component';
import { MenuDetailsComponent } from './features/menu-details/menu-details.component';
import { menuManagementGuard } from './core/guards/memu-management.guard';
import { CartComponent } from './features/cart/cart.component';
import { cartGuard } from './core/guards/cart.guard';
import { OrderConformationComponent } from './features/order-conformation/order-conformation.component';
import { orderConformationGuard } from './core/guards/order-conformation.guard';

export const routes: Routes = [
    {path:RoutePaths.HOME,component:HomeComponent},
    {
        path:RoutePaths.HOME, loadChildren: () => import('./features/accounts/routes')
            .then(r => r.accountRoutes)
    },
    {path:RoutePaths.MENU_MANAGEMENT,component:MenuManagementComponent,canActivate: [menuManagementGuard]},
    {path:RoutePaths.MENU_DETAILS+"/:id",component:MenuDetailsComponent},
    {path:RoutePaths.CART,component:CartComponent,canActivate: [cartGuard]},
    {path:RoutePaths.ORDER_CONFORMATION,component:OrderConformationComponent,canActivate: [orderConformationGuard] },
    {path:RoutePaths.NOT_FOUND,component:HomeComponent}
];
