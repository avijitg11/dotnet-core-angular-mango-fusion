import { Component, computed, DestroyRef, inject, OnInit, signal } from "@angular/core";
import { Order } from "../../shared/models/order";
import { OrderStatusOptions } from "../../shared/models/order.status";
import { OrderService } from "../../core/services/order.service";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { AuthService } from "../../core/services/auth.service";
import { OrderListComponent } from "./order-list/order-list.component";
import { RatingComponent } from "./rating/rating.component";

@Component({
    selector:'app-my-orders',
    templateUrl: './my-orders.component.html',
    styleUrls: ['./my-orders.component.css'],
    imports:[OrderListComponent,RatingComponent]
})
export class MyOrdersComponent implements OnInit{
    private destroyRef = inject(DestroyRef);
    private authService = inject(AuthService);
    orderService = inject(OrderService);
    orders = signal<Order[]>([]);
    isError = signal(false);
    showLoader = signal(true);
    orderStatusOptions = OrderStatusOptions;
    selectedStatus = signal('');
    isModalShow = signal(false);
    orderDetails = signal<Order>({
        orderHeaderId: 0,
        pickUpName: '',
        pickUpPhoneNumber: '',
        pickUpEmail: '',
        orderDate: '',
        applicationUserId: '',
        applicationUser: '',
        orderTotal:0,
        status:  '',
        totalItem: 0,
        orderDetails:[]
    });
    
    ngOnInit(): void {
        this.loadOrders();
    }

    private loadOrders(){
        const userId = this.authService.getAuth().user?.id ?? '';
        this.orderService.getOrderByUserId(userId)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
            next: (response) => {
                if(response.isSuccess){
                    this.orders.set(response.result);
                }
                this.showLoader.set(false);
            },
            error: (err)=>{
                this.isError.set(true);
                this.showLoader.set(false);
            },
            complete: ()=>{
                this.showLoader.set(false);
            }      
        });
    }

    editOrder(event:Order){
        this.orderDetails.set(event);
        this.isModalShow.set(true);
    }  
    
    onChangeStatus(event: Event) {
        this.selectedStatus.set(
            (event.target as HTMLSelectElement).value
        );
    }

    filteredOrders = computed(() => {
        const status = this.selectedStatus();

        return this.orders().filter(item => {
            const matchStatus = !status || item.status === status;
            return matchStatus;
        });
    });


    reloadOrders(event:boolean){
        if(event){
            this.loadOrders();
        }
    }

    hideModal(event:boolean){
        this.isModalShow.set(event);
    }
}