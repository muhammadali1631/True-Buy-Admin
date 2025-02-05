import { client } from '@/sanity/lib/client'
import { OrderType } from '@/types/order'
import Link from 'next/link';
import React from 'react'

const Orders = async() => {
    const orders:OrderType[] = await client.fetch(`*[_type == 'order']`, {}, {cache: 'no-store'});
  return (
    <div className="w-full max-w-6xl mx-auto bg-white shadow-md rounded-lg overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800">Order List</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orders.slice(0, 3).map((order) => (
              <tr key={order._id}>
                
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{order.details.fullName}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{new Date(order._createdAt).toLocaleDateString()}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">${order.products.reduce((total, item) => total + item.quantity * item.price, 0).toFixed(2)}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      order.status === "Delivered"
                        ? "bg-green-100 text-green-800"
                        : order.status === "Shipped"
                          ? "bg-blue-100 text-blue-800"
                          : order.status === "Processing"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {order.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className='flex justify-center border-t '>
        <Link href={'/orders'}>
        <button className=' py-2 px-4  rounded-lg my-2 bg-black text-white font-semibold'>View All</button>
        </Link>
      </div>
    </div>
  )
}

export default Orders