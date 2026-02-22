export const OrderStatus = {
    Confirmed:"Confirmed",
    ReadyForPickup:"Ready for Pickup",
    Completed:"Completed",
    Cancelled:"Cancelled"
}

export const OrderStatusOptions = [
    {
        value: OrderStatus.Confirmed,
        color: "bg-warning"
    },
    {
        value: OrderStatus.ReadyForPickup,
        color: "bg-info"
    },
    {
        value: OrderStatus.Completed,
        color: "bg-success"
    },
    {
        value: OrderStatus.Cancelled,
        color: "bg-danger"
    }
]