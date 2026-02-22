import { Component, computed, inject, OnInit, signal } from "@angular/core";
import { RouterLink, Router } from "@angular/router";
import { RoutePaths } from '../../shared/models/route.path';
import { AuthService } from "../../core/services/auth.service";
import { UserRoles } from '../../shared/models/user.roles';
import Swal from 'sweetalert2';
import { CartService } from "../../core/services/cart.service";
import { ThemeService } from "../../core/services/theme.service";

@Component({
    selector:'app-header',
    templateUrl:'./header.component.html',
    styleUrls:['./header.component.css'],
    imports: [RouterLink]
})
export class HeaderComponent implements OnInit{   
  private router = inject(Router);
  private authService = inject(AuthService); 
  private cartService = inject(CartService);
  private themeService = inject(ThemeService); 
  routePaths = RoutePaths;
  authState = this.authService.authState;
  userRoles = UserRoles;
  isDark = signal<boolean>(false);
  
  totalCartItem = computed(() =>
    this.cartService.cartItemList().reduce(
      (total, item) => total + item.quantity,
      0
    )
  );
  
  constructor(){
    const theme = this.themeService.init();
    if(theme==='dark')
      this.isDark.set(true);
    else
      this.isDark.set(false);
  }

  ngOnInit(): void {
    this.authState.set(this.authService.getAuth());
  }

  onLogout(){
    this.authService.logout();
    this.router.navigate([this.routePaths.HOME]);
    Swal.fire({
        title: "User Logout!",
        text: "User logout successfully!",
        icon: "success",
        confirmButtonColor: '#0d6efd'
    });
  }

  switchTheme() {
    const theme = this.themeService.toggleTheme();
    if(theme==='dark')
      this.isDark.set(true);
    else
      this.isDark.set(false);
  }
}