import { Component, computed, DestroyRef, effect, inject, input, output, signal } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { OrderService } from "../../../../core/services/order.service";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { OrderDetails } from "../../../../shared/models/order.details";
import { RatingComponent } from "../../../../shared/components/rating/rating.component";
import { OrderDetail } from "../../../../shared/models/order";
import { environment } from "../../../../../environments/environment";
import { OrderStatus } from "../../../../shared/models/order.status";


@Component({
    selector:'app-item',
    templateUrl:'./item.component.html',
    imports:[RatingComponent]
})
export class ItemComponent{
    private destroyRef = inject(DestroyRef);
    private toastr = inject(ToastrService);
    private orderService = inject(OrderService);
    baseUrl = environment.apiUrl;    
    orderDetail = input.required<OrderDetail>();    
    rating = signal(0);
    status = input.required<string>();
    orderStatus = OrderStatus;
    isDisabled = computed(() => this.status() !== this.orderStatus.Completed);
    loadOrders = output<boolean>();

    constructor() {
        effect(() => {
            const detail = this.orderDetail();
            this.rating.set(
                detail?.rating == null ? 0 : +detail.rating
            );
        });
    }

    onClick(){
        if(!this.isDisabled()){
            let orderDetails : OrderDetails = {
                orderDetailId : this.orderDetail().orderDetailId,
                rating:this.rating()
            }
            
            this.orderService.updateOrderDetails(orderDetails)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next:(response)=> {
                    if(response.isSuccess)
                    {
                        this.toastr.success(
                            `Order rating updated.`,
                            'Success'
                        );
                        this.loadOrders.emit(true);
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
                    this.toastr.error(
                        message,
                        'Error'
                    );
                }
            });   
        }            
    }
}