import { Component, computed, DestroyRef, inject, input, output, signal } from "@angular/core";
import { Order } from "../../../shared/models/order";
import { OrderStatus } from "../../../shared/models/order.status";
import { DatePipe } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { OrderService } from "../../../core/services/order.service";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import Swal from 'sweetalert2';
import { OrderUpdate } from "../../../shared/models/order.update";
import { OrderStatusOptions } from "../../../shared/models/order.status";
import { environment } from "../../../../environments/environment";

@Component({
    selector:'app-rating',
    templateUrl:'./rating.component.html',
    styleUrls:['./rating.component.css'],
    imports:[DatePipe,FormsModule]
})
export class RatingComponent{
    private destroyRef = inject(DestroyRef);
    isModalShow = output<boolean>();
    orderDetails = input.required<Order>();
    isLoadOrders = output<boolean>();
    orderStatus = OrderStatus;
    selectedStatus:string = '';
    orderService = inject(OrderService);
    baseUrl = environment.apiUrl;
    
    orderStatusColor = computed(() => {
        const status = this.orderDetails().status;
        return OrderStatusOptions.find(s => s.value === status)?.color ?? '';
    });

    hideModal(){
        this.isModalShow.emit(false);
    }

    onSubmit(){
        if(this.selectedStatus!==''){
            let orderUpdate : OrderUpdate = {
                orderHeaderId: this.orderDetails().orderHeaderId,
                pickUpName: this.orderDetails().pickUpName,
                pickUpPhoneNumber: this.orderDetails().pickUpPhoneNumber,
                pickUpEmail: this.orderDetails().pickUpEmail,
                status: this.selectedStatus
            }
            this.orderService.updateOrder(orderUpdate)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next:(response)=> {
                    if(response.isSuccess)
                    {
                        Swal.fire({
                            title:"Order status updated",
                            text:"Order status updated successfully",
                            icon: "success",
                            confirmButtonColor: '#0d6efd'
                        });
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
                    this.isModalShow.emit(false);
                    this.isLoadOrders.emit(true);
                },
                complete:()=>{
                    this.isModalShow.emit(false);
                    this.isLoadOrders.emit(true);
                }
            });
        }        
    }
}