
import React from 'react'
import { client } from '@/sanity/lib/client'
import { OrderType } from '@/types/order'
import { Edit} from "lucide-react"
import Link from 'next/link'



const page = async() => {
    const orders:OrderType[] = await client.fetch(`*[_type == 'order'] | order(_createdAt desc)`)
  return (
    <div className="container mx-auto w-full  py-10">
      <h1 className="text-2xl font-bold mb-5 mx-3">Orders</h1>
      <div className="flex flex-wrap gap-4 justify-around">
        
            {orders.map((order) => (
              <div key={order._id} className="bg-white rounded-lg shadow-md overflow-hidden w-[95%] sm:w-[350px]">
              <div className="p-4">
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-lg font-semibold w-[80%] break-words line-clamp-1">{order.orderId}</h2>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      order.status === "Completed"
                        ? "bg-green-100 text-green-800"
                        : order.status === "Processing"
                          ? "bg-blue-100 text-blue-800"
                          : order.status === "Shipped"
                            ? "bg-purple-100 text-purple-800"
                            : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
                <p className="text-gray-600 mb-2">{order.details.fullName}</p>
                <p className="text-gray-600 mb-2">{new Date(order._createdAt).toLocaleDateString()}</p>
                <p className="text-lg font-bold">${order.products.reduce((total, item) => total + item.quantity * item.price, 0).toFixed(2)}</p>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 flex justify-end space-x-2">
               <Link href={`/orders/${order.orderId}`}>
                <button className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-green-700 bg-green-100 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500" >
                  <Edit className="h-4 w-4 mr-1" />
                  Manage
                </button>
                </Link>
                
              </div>
            </div>
            ))}
          
      </div>
    </div>
  )
}

export default page