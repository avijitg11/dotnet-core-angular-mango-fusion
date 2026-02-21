export const OrderStatus = {
    Confirmed:"Confirmed",
    ReadyForPickup:"Ready for Pickup",
    Completed:"Completed",
    Cancelled:"Cancelled"
}

export const OrderStatusOptions = [
    {
        value: OrderStatus.Confirmed,
        color: "warning"
    },
    {
        value: OrderStatus.ReadyForPickup,
        color: "info"
    },
    {
        value: OrderStatus.Completed,
        color: "success"
    },
    {
        value: OrderStatus.Cancelled,
        color: "danger"
    }
]