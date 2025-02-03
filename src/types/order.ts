type Product = {
    id: string;
    quantity: number;
    color: string;
    price: number;
  };
  
  export type OrderType = {
    orderId: string;
    _createdAt: string;
    _updatedAt: string;
    _id: string;
    _rev: string;
    _type: string;
    userId: string;
    details: {

      fullName: string;
      country: string;
      zipCode: string;
      address: string;
      city: string;
      phone: string;
    }
    status: string;
    products: Product[];
  };
  