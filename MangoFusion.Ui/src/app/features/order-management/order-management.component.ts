import { Component, computed, DestroyRef, inject, OnInit, signal } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { OrderComponent } from "./order/order.component";
import { OrderService } from "../../core/services/order.service";
import { Order } from "../../shared/models/order";
import { OrderStatusOptions } from "../../shared/models/order.status";
import { OrderDetailsComponent } from "./order-details/order-details.component";

@Component({
    selector:'app-order-management',
    templateUrl: './order-management.component.html',
    styleUrls: ['./order-management.component.css'],
    imports:[OrderComponent,OrderDetailsComponent]
})
export class OrderManagementComponent implements OnInit {
    private destroyRef = inject(DestroyRef);
    orderService = inject(OrderService);
    orders = signal<Order[]>([]);
    isError = signal(false);
    showLoader = signal(true);
    orderStatusOptions = OrderStatusOptions;
    selectedStatus = signal('');
    searchText = signal('');
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
        this.orderService.getOrders()
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

    searchCustomer(event: Event) {
        this.searchText.set(
            (event.target as HTMLInputElement).value
        );
    }


    filteredOrders = computed(() => {
        const status = this.selectedStatus();
        const searchText = this.searchText().toLowerCase();

        return this.orders().filter(item => {
            const matchStatus = !status || item.status === status;
            const text = !searchText || item.pickUpName.toLowerCase().includes(searchText)
            || item.pickUpEmail.toLowerCase().includes(searchText)
            || item.pickUpPhoneNumber.toLowerCase().includes(searchText);

            return matchStatus && text;
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