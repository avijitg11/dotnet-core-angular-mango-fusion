export type Order = {
  orderHeaderId: number;
  pickUpName: string;
  pickUpPhoneNumber: string;
  pickUpEmail: string;
  orderDate: string;
  applicationUserId: string;
  applicationUser: string;
  orderTotal: number;
  status: string;
  totalItem: number;
  orderDetails: OrderDetail[];
};

export type OrderDetail = {
  orderDetailId: number;
  orderHeaderId: number;
  menuItemId: number;
  menuItem: MenuItem;
  quantity: number;
  itemName: string;
  price: number;
  rating: string;
};

export type MenuItem = {
  id: number;
  name: string;
  description: string;
  category: string;
  specialTag: string;
  price: number;
  image: string;
  rating: number;
};
