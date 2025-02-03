export default {
    name: 'products',
    title: 'Product',
    type: 'document',
    fields: [
      {
        name: 'category',
        title: 'Category',
        type: 'string',
      },
      {
        name: 'discountPercent',
        title: 'Discount Percent',
        type: 'number',
      },
      {
        name: 'isNew',
        title: 'Is New?',
        type: 'boolean',
      },
      
      {
        name: 'name',
        title: 'Name',
        type: 'string',
      },
      {
        name: 'description',
        title: 'Description',
        type: 'text',
      },
      {
        name: 'price',
        title: 'Price',
        type: 'number',
      },
      {
        name: 'cost',
        title: 'Cost',
        type: 'number',
      },
      {
        name: 'images',
        title: 'Images',
        type: 'array',
        of: [
          {
            type: 'object',
            fields: [
              {
                name: 'color',
                title: 'Color',
                type: 'string',
              },
              {
                name: 'image',
                title: 'Image',
                type: 'array',
                of: [{ type: 'image' }],
              },
            ],
          },
        ],
      },
      {
        name: 'sizes',
        title: 'Sizes',
        type: 'array',
        of: [{ type: 'string' }],
      },
      {
        name: 'colors',
        title: 'Colors',
        type: 'array',
        of: [{ type: 'string' }],
      },
      {
        name: 'slug',
        title: 'Slug',
        type: 'string',
        
      },
      
      {
        name: 'stock',
        title: 'Stock',
        type: 'number',
      },
      {
        name: 'tags',
        title: 'Tags',
        type: 'array',
        of: [{ type: 'string' }],
      },
      {
        name: 'rating',
        title: 'Rating',
        type: 'number',
      },
    ],
  };
  