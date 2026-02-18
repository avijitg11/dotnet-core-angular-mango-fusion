import { Component, computed, DestroyRef, inject, signal } from "@angular/core";
import { CartService } from "../../core/services/cart.service";
import { Router, RouterLink } from "@angular/router";
import { RoutePaths } from "../../shared/models/route.path";
import { CartItemComponent } from "./cart-item/cart-item.component";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { AuthService } from "../../core/services/auth.service";
import { OrderService } from "../../core/services/order.service";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import Swal from 'sweetalert2';
import { OrderCreate, OrderDetailsDTO } from "../../shared/models/order.create";

@Component({
    selector:'app-cart',
    templateUrl:'./cart.component.html',
    styleUrls:['./cart.component.css'],
    imports:[RouterLink,CartItemComponent,ReactiveFormsModule]
})
export class CartComponent{
    private destroyRef = inject(DestroyRef);
    private toastr = inject(ToastrService);
    private authService = inject(AuthService); 
    private orderService = inject(OrderService);
    private router = inject(Router); 
    cartService = inject(CartService);
    authState = this.authService.authState;
    routePaths = RoutePaths;
    showSpinner = signal(false);
    pickupDetailsForm: FormGroup;

    constructor(){
        const auth = this.authState();
        const pickUpName = auth.isAuthenticated ? auth.user?.fullname ?? '' : '';
        const pickUpEmail = auth.isAuthenticated ? auth.user?.email ?? '' : '';

        this.pickupDetailsForm = new FormGroup({
            pickUpName: new FormControl(pickUpName,Validators.required),
            pickUpPhoneNumber: new FormControl('',[Validators.required,Validators.pattern(/^\+?[1-9]\d{7,14}$/)]),
            pickUpEmail: new FormControl(pickUpEmail,[Validators.required,Validators.email])
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
        this.cartService.clearCart(true);
    }

    onSubmit(){
        this.showSpinner.set(true);
        const auth = this.authState();
        const applicationUserId = auth.isAuthenticated ? auth.user?.id ?? '' : '';
        
        let OrderDetailsDTO : OrderDetailsDTO[] = [];

        this.cartService.cartItemList().forEach(item => {
            let orderItem : OrderDetailsDTO = {
                menuItemId: item.id,
                quantity: item.quantity,
                itemName: item.name,
                price: item.price,
            }
            OrderDetailsDTO.push(orderItem);
        });

        let order : OrderCreate = {
            pickUpName: this.pickupDetailsForm.value.pickUpName,
            pickUpPhoneNumber: this.pickupDetailsForm.value.pickUpPhoneNumber,
            pickUpEmail: this.pickupDetailsForm.value.pickUpEmail,
            applicationUserId: applicationUserId,
            orderTotal: this.totalCartAmount(),
            totalItem: this.totalCartItem(),
            orderDetailsDTO: OrderDetailsDTO
        };

        this.orderService.createOrder(order)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
            next:(response)=> {
                if(response.isSuccess)
                {
                    Swal.fire({
                        title : "Order placed!",
                        text : "Order placed successfully!",
                        icon: "success",
                        confirmButtonColor: '#0d6efd'
                    });
                    this.cartService.clearCart(false);
                    this.orderService.showOrderConformation.set(true);
                    this.orderService.orderConfirmedDetails.set({
                        orderId:response.result.orderHeaderId,
                        email:order.pickUpEmail,
                        numberOfItems:order.totalItem,
                        phoneNumber:order.pickUpPhoneNumber,
                        pickupName:order.pickUpPhoneNumber
                    });
                    this.router.navigate([this.routePaths.ORDER_CONFORMATION]);  
                }                                    
            },
            error:(err)=>{
                let message = '';
                if (err.status === 401) {
                    message = "You are unauthorized.";
                } else if (Array.isArray(err.error?.errorMessage)) {
                    message = err.error.errorMessage.join(' | ');
                } else {
                    message = err.error?.errorMessage || "Something went wrong.";
                }
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: message,
                    confirmButtonColor: '#fd0d0d'
                });
                this.showSpinner.set(false);
            },
            complete:()=>{
                this.showSpinner.set(false);
            }
        });
    }

    onBlur(formInput:string){
        const form = this.pickupDetailsForm;
        if (form?.invalid && form?.touched)
        {
            switch (formInput) {
                case 'pickUpName':
                    if (form.get('pickUpName')?.hasError('required')) {
                        this.toastr.error('Full name is required.', 'Error');
                    }
                    break;

                case 'pickUpEmail':
                    const emailCtrl = form.get('pickUpEmail');
                    if (emailCtrl?.hasError('required')) {
                        this.toastr.error('Email is required.', 'Error');
                    } else if (emailCtrl?.hasError('email')) {
                        this.toastr.error('Please enter a valid email address.', 'Error');
                    }
                    break;

                case 'pickUpPhoneNumber':
                    const phoneCtrl = form.get('pickUpPhoneNumber');
                    if (phoneCtrl?.hasError('required')) {
                        this.toastr.error('Phone number is required.', 'Error');
                    }else if (phoneCtrl?.hasError('pattern')) {
                        this.toastr.error('Invalid phone number. Required format (+91XXXXXXXXXX).', 'Error');
                    }
                    break;
            }
        }  
    }

}