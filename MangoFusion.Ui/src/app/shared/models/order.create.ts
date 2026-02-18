export type OrderCreate = {
  pickUpName: string;
  pickUpPhoneNumber: string;
  pickUpEmail: string;
  applicationUserId: string;
  orderTotal: number;
  totalItem: number;
  orderDetailsDTO: OrderDetailsDTO[];
};

export type OrderDetailsDTO = {
  menuItemId: number;
  quantity: number;
  itemName: string;
  price: number;
};