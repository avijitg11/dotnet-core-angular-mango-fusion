import { Component, computed, inject, signal } from "@angular/core";
import { CartService } from "../../core/services/cart.service";
import { RouterLink } from "@angular/router";
import { RoutePaths } from "../../shared/models/route.path";
import { CartItemComponent } from "./cart-item/cart-item.component";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { PickupDetails } from "../../shared/models/pickup.details";
import { ToastrService } from "ngx-toastr";
import { AuthService } from "../../core/services/auth.service";


@Component({
    selector:'app-cart',
    templateUrl:'./cart.component.html',
    styleUrls:['./cart.component.css'],
    imports:[RouterLink,CartItemComponent,ReactiveFormsModule]
})
export class CartComponent{
    private toastr = inject(ToastrService);
    authService = inject(AuthService); 
    cartService = inject(CartService);
    authState = this.authService.authState;
    routePaths = RoutePaths;
    isShowSpinner = signal(false);
    pickupDetailsForm: FormGroup;

    constructor(){
        const auth = this.authState();
        const fullName = auth.isAuthenticated ? auth.user?.fullname ?? '' : '';
        const email = auth.isAuthenticated ? auth.user?.email ?? '' : '';

        this.pickupDetailsForm = new FormGroup({
            fullName: new FormControl(fullName,Validators.required),
            phoneNumber: new FormControl('',[Validators.required,Validators.pattern(/^\+?[1-9]\d{7,14}$/)]),
            email: new FormControl(email,[Validators.required,Validators.email])
        });
    }
    
    totalCartItem = computed(() =>
        this.cartService.cartItemList().reduce(
            (total, item) => total + item.quantity,
            0
        )
    );
    
    totalCartAmount = computed(() =>
        this.cartService.cartItemList().reduce(
            (total, item) => total + (item.quantity*item.price),
            0
        )
    );

    onClearCart(){
        this.cartService.clearCart();
    }

    onSubmit(){
        console.log(this.pickupDetailsForm.value);
    }

    onBlur(formInput:string){
        const form = this.pickupDetailsForm;
        if (form?.invalid && form?.touched)
        {
            switch (formInput) {
                case 'fullName':
                    if (form.get('fullName')?.hasError('required')) {
                        this.toastr.error('Full name is required.', 'Error');
                    }
                    break;

                case 'email':
                    const emailCtrl = form.get('email');
                    if (emailCtrl?.hasError('required')) {
                        this.toastr.error('Email is required.', 'Error');
                    } else if (emailCtrl?.hasError('email')) {
                        this.toastr.error('Please enter a valid email address.', 'Error');
                    }
                    break;

                case 'phoneNumber':
                    const phoneCtrl = form.get('phoneNumber');
                    if (phoneCtrl?.hasError('required')) {
                        this.toastr.error('Phone number is required.', 'Error');
                    }else if (phoneCtrl?.hasError('pattern')) {
                        this.toastr.error('Invalid phone number format.', 'Error');
                    }
                    break;
            }
        }  
    }

}