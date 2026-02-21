import { Routes } from '@angular/router';
import { RoutePaths } from './shared/models/route.path';
import { adminGuard } from './core/guards/admin.guard';
import { cartGuard } from './core/guards/cart.guard';
import { orderConformationGuard } from './core/guards/order-conformation.guard';
import { authGuard } from './core/guards/auth.guard';
import { customerGuard } from './core/guards/customer.guard';

export const routes: Routes = [
    {path:RoutePaths.HOME,loadComponent: () =>
      import('./features/home/home.component').then(m => m.HomeComponent)},

    {
        path:RoutePaths.ACCOUNT, loadChildren: () => import('./features/accounts/routes')
            .then(r => r.accountRoutes),
        canActivate: [authGuard]
    },

    {path:RoutePaths.MENU_MANAGEMENT,loadComponent: () =>
      import('./features/menu-management/menu-management.component').then(m => m.MenuManagementComponent),
      canActivate: [adminGuard]},

    {path:RoutePaths.MENU_DETAILS+"/:id",loadComponent: () =>
      import('./features/menu-details/menu-details.component').then(m => m.MenuDetailsComponent)},

    {path:RoutePaths.CART,loadComponent: () =>
      import('./features/cart/cart.component').then(m => m.CartComponent),
      canActivate: [cartGuard]},

    {path:RoutePaths.ORDER_CONFORMATION,loadComponent: () =>
      import('./features/order-conformation/order-conformation.component').then(m => m.OrderConformationComponent)
    ,canActivate: [orderConformationGuard] },

    {path:RoutePaths.ORDER_MANAGEMENT,loadComponent: () =>
      import('./features/order-management/order-management.component').then(m => m.OrderManagementComponent),
      canActivate: [adminGuard]}, 

    {path:RoutePaths.MY_ORDERS,loadComponent: () =>
      import('./features/my-orders/my-orders.component').then(m => m.MyOrdersComponent),
      canActivate: [customerGuard]},

    {path:RoutePaths.NOT_FOUND,loadComponent: () =>
      import('./features/home/home.component').then(m => m.HomeComponent)}
];
