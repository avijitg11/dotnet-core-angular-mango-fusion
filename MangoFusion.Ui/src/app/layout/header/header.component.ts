import { Component, inject, OnInit } from "@angular/core";
import { RouterLink, Router } from "@angular/router";
import { RoutePaths } from '../../shared/models/route.path';
import { AuthService } from "../../core/services/auth.service";
import { UserRoles } from '../../shared/models/user.roles';
import Swal from 'sweetalert2';

@Component({
    selector:'app-header',
    templateUrl:'./header.component.html',
    styleUrls:['./header.component.css'],
    imports: [RouterLink]
})
export class HeaderComponent implements OnInit{   
  private router = inject(Router); 
  routePaths = RoutePaths;
  authService = inject(AuthService); 
  authState = this.authService.authState;
  userRoles = UserRoles;
  
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
}