import { Component, computed, input, output } from "@angular/core";
import { Order } from "../../../shared/models/order";
import { DatePipe } from "@angular/common";
import { OrderStatusOptions } from "../../../shared/models/order.status";

@Component({
    selector:'[app-order-list]',
    templateUrl: './order-list.component.html',
    styleUrls: ['./order-list.component.css'],
    imports:[DatePipe]
})
export class OrderListComponent {
    order = input.required<Order>();
    orderDetails = output<Order>();

    orderStatusColor = computed(() => {
        const status = this.order().status;
        return OrderStatusOptions.find(s => s.value === status)?.color ?? '';
    });

    onEdit(){
        this.orderDetails.emit(this.order());
    }
    
}