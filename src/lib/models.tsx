export interface Book {
  id: number;
  title: string;
  author: string;
  year: number;
  is_published: boolean;
  description: string;
  cover_url: string;
  category: string;
  synopsis: string;
}

export interface Menu {
  id: number;
  name: string;
  price: number;
  description: string;
  cover_url: string;
}

export interface Student {
  id: number;
  stu_id: number;
  name: string;
  lastname: string;
  bod: Date | string;
  gender: string;
}

export interface OrderMenu {
  id: number;
  count: number;
}
export interface OrderItem {
  order_id: number;
  menu_id: number;
  price: number;
  id: number;
  quantity: number;
  menu: {
    price: number;
    id: number;
    name: string;
    description: string;
    cover_url: null | string; // Assuming cover_url can be optional and a string
  };
}

export interface Order {
  updated_at: string;
  id: number;
  total_price: number;
  created_at: string;
  order_items: OrderItem[];
}

export interface Cart extends Menu {
  count: number;
}
