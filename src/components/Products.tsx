import { client } from '@/sanity/lib/client';
import { ProductType } from '@/types/Products';
import Link from 'next/link';
import React from 'react'

const Products = async() => {
    const products:ProductType[] = await client.fetch(`*[_type == 'products']`, {}, {cache: 'no-store'});
    return (
      <div className="w-full max-w-6xl mx-auto bg-white shadow-md rounded-lg overflow-hidden my-10">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Products List</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cost</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stocks</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.slice(0, 3).map((product) => (
                <tr key={product._id}>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{product.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{product.price}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{product.cost}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{product.stock}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className='flex justify-center border-t '>
          <Link href={'/products'}>
          <button className=' py-2 px-4  rounded-lg my-2 bg-black text-white font-semibold'>View All</button>
          </Link>
        </div>
      </div>
    )
}

export default Products