import { Component, inject, OnInit } from "@angular/core";
import { RoutePaths } from "../../shared/models/route.path";
import { RouterLink } from "@angular/router";
import { OrderService } from "../../core/services/order.service";
import { OrderConfirmedDetails } from "../../shared/models/order.confirmed.details";

@Component({
    selector:'app-order-conformation',
    templateUrl:'./order-conformation.component.html',
    styleUrls:['./order-conformation.component.css'],
    imports:[RouterLink]
})
export class OrderConformationComponent implements OnInit{
    routePaths = RoutePaths;
    orderService = inject(OrderService);
    orderConfirmedDetails : OrderConfirmedDetails = this.orderService.orderConfirmedDetails();
    
    ngOnInit(): void {
        this.orderService.setOrderConfirmedDetailsDefault();
    }
    
}