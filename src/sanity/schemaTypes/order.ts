
const order = {
    name: 'order',
    type: 'document',
    title: 'Order',
    fields: [
      { name: 'orderId', type: 'string', title: 'Order ID' },
      { name: 'status', type: 'string', title: 'Status' },
      {
        name: 'products',
        type: 'array',
        title: 'Products',
        of: [
          {
            type: 'object',
            fields: [
              { name: 'quantity', type: 'number', title: 'Quantity' },
              { name: 'color', type: 'string', title: 'Color' },
              { name: 'id', type: 'string', title: 'Product ID' },
            ],
          },
        ],
      },
      {
        name: 'details',
        type: 'object',
        title: 'Details',
        fields: [
          { name: 'zipCode', type: 'string', title: 'Zip Code' },
          { name: 'address', type: 'string', title: 'Address' },
          { name: 'city', type: 'string', title: 'City' },
          { name: 'phone', type: 'string', title: 'Phone' },
          { name: 'fullName', type: 'string', title: 'Full Name' },
          { name: 'country', type: 'string', title: 'Country' },
        ],
      },
      { name: 'userId', type: 'string', title: 'User ID' },
    ],
  };

export default order;