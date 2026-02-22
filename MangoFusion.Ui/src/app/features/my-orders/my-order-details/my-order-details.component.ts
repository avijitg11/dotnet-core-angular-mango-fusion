import { Component, computed, input, output, signal } from "@angular/core";
import { Order } from "../../../shared/models/order";
import { OrderStatus } from "../../../shared/models/order.status";
import { DatePipe } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { OrderStatusOptions } from "../../../shared/models/order.status";
import { ItemComponent } from "./items/item.component";

@Component({
    selector:'app-my-order-details',
    templateUrl:'./my-order-details.component.html',
    imports: [DatePipe, FormsModule, ItemComponent]
})
export class MyOrderDetailsComponent{
    isModalShow = output<boolean>();
    orderDetails = input.required<Order>();
    orderStatus = OrderStatus;
    loadOrders = output<boolean>();
    isDisabled = computed(() => this.orderDetails().status !== this.orderStatus.Completed);

    orderStatusColor = computed(() => {
        const status = this.orderDetails().status;
        return OrderStatusOptions.find(s => s.value === status)?.color ?? '';
    });

    hideModal(){
        this.isModalShow.emit(false);
    }  
    
    reloadOrder(event:boolean){
        this.loadOrders.emit(event);
    }
}