import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { Observable } from "rxjs";
import { OrderCreate } from "../../shared/models/order.create";
import { OrderUpdate } from "../../shared/models/order.update";
import { Response } from '../../shared/models/response.model';

@Injectable({
    providedIn:'root'
})
export class OrderService{
    private baseUrl : string =  environment.apiUrl;
    private http = inject(HttpClient);

    getOrders():Observable<Response>{
        return this.http.get<Response>(this.baseUrl + "api/OrderHeader");
    }

    getOrderById(id:number):Observable<Response>{
        return this.http.get<Response>(this.baseUrl + "api/OrderHeader" + id);
    }

    createOrder(order:OrderCreate):Observable<Response>{
        return this.http.post<Response>(this.baseUrl + "api/OrderHeader/", order);        
    }

    updateOrder(order:OrderUpdate):Observable<Response>{
        return this.http.put<Response>(this.baseUrl + "api/OrderHeader/" + order.orderHeaderId, order);        
    }
}


