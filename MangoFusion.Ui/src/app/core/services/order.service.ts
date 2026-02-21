import { HttpClient } from "@angular/common/http";
import { inject, Injectable, signal } from "@angular/core";
import { environment } from "../../../environments/environment";
import { Observable } from "rxjs";
import { OrderCreate } from "../../shared/models/order.create";
import { OrderUpdate } from "../../shared/models/order.update";
import { Response } from '../../shared/models/response.model';
import { OrderConfirmedDetails } from "../../shared/models/order.confirmed.details";

@Injectable({
    providedIn:'root'
})
export class OrderService{
    private baseUrl : string =  environment.apiUrl;
    private http = inject(HttpClient);
    showOrderConformation = signal(false);
    orderConfirmedDetailsDefault : OrderConfirmedDetails = {
        orderId:0,
        email:'',
        numberOfItems:0,
        phoneNumber:'',
        pickupName:''
    };
    orderConfirmedDetails = signal<OrderConfirmedDetails>(this.orderConfirmedDetailsDefault);

    getOrders():Observable<Response>{
        return this.http.get<Response>(this.baseUrl + "api/OrderHeader");
    }

    getOrderById(id:number):Observable<Response>{
        return this.http.get<Response>(this.baseUrl + "api/OrderHeader/?orderId=" + id);
    }

    getOrderByUserId(userId:string):Observable<Response>{
        return this.http.get<Response>(this.baseUrl + "api/OrderHeader/?userId=" + userId);
    }

    createOrder(order:OrderCreate):Observable<Response>{
        return this.http.post<Response>(this.baseUrl + "api/OrderHeader/", order);        
    }

    updateOrder(order:OrderUpdate):Observable<Response>{
        return this.http.put<Response>(this.baseUrl + "api/OrderHeader/" + order.orderHeaderId, order);        
    }

    setOrderConfirmedDetailsDefault(){
        this.orderConfirmedDetails.set(this.orderConfirmedDetailsDefault);
    }
}


