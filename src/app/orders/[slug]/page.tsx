import OrderStatus from "@/components/OrderStatus"
import { client } from "@/sanity/lib/client"
import { OrderType } from "@/types/order"
import { ProductType } from "@/types/Products"
import { ArrowLeft, Package, Truck, CreditCard, User } from "lucide-react"
import Link from "next/link"


export default async function Page({
    params,
  }: {
    params: Promise<{ slug: string }>
  }) {
    const slug = (await params).slug
    const order:OrderType = await client.fetch(`*[_type == 'order' && orderId == $slug] | order(_createdAt desc)[0] `, {slug})
    const product:ProductType[] = await client.fetch(`*[_type == 'products']`) 
    const filteredProducts = product.filter((item) => order.products.some((cartItem) => cartItem.id === item._id));

  return (
    <div className="container mx-auto py-10 px-4 w-full ">
      <Link href="/orders" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Orders
      </Link>
      <div className="bg-white shadow-lg rounded-lg overflow-hidden w-full">
        <div className="p-6 bg-gray-50 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900 break-words w-[80%]">Order ID: {order._id}</h1>
            <div className="relative">
              <OrderStatus status={order.status.charAt(0).toUpperCase() + order.status.slice(1)} id={order._id}/>
            </div>
          </div>
          <p className="text-sm text-gray-600 mt-2">Placed on {new Date(order._createdAt).toLocaleDateString()}</p>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h2 className="text-lg font-semibold mb-2 flex items-center">
                <User className="h-5 w-5 mr-2 text-gray-500" />
                Customer Details
              </h2>
              <p className="text-gray-700">{order.details.fullName}</p>
              <p className="text-gray-700">{order.details.phone}</p>
            </div>
            <div>
              <h2 className="text-lg font-semibold mb-2 flex items-center">
                <Truck className="h-5 w-5 mr-2 text-gray-500" />
                Shipping Address
              </h2>
              <p className="text-gray-700">{order.details.address}</p>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <Package className="h-5 w-5 mr-2 text-gray-500" />
              Order Items
            </h2>
            <div className="bg-gray-50 rounded-lg overflow-x-scroll">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr className="bg-gray-100">
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Product
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Quantity
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Price
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Cost
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {order.products.map((item, index) => (
                    <tr key={item.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{filteredProducts[index].name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.quantity}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${item.price.toFixed(2)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ${filteredProducts[index].cost}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="flex justify-between items-center border-t border-gray-300 py-2">
            <div>
              <h2 className="text-lg font-semibold mb-2 flex items-center">
                <CreditCard className="h-5 w-5 mr-2 text-gray-500" />
                Payment Method
              </h2>
              <p className="text-gray-700">COD</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-900">${order.products.reduce((total, item) => total + item.quantity * item.price, 0).toFixed(2)}</p>
            </div>
            
          </div>
          <div className="flex justify-between items-center border-t border-gray-300 py-2">
            <div>
              <h2 className="text-lg font-semibold mb-2 flex items-center">
                Total Cost
              </h2>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-gray-900">${order.products.reduce((total, item, index) => total + item.quantity * filteredProducts[index].cost, 0).toFixed(2)}</p>
            </div>
            
          </div>
          <div className="flex justify-between items-center border-t border-gray-300 py-2">
            <div>
              <h2 className="text-lg font-semibold mb-2 flex items-center">
                Total Profit
              </h2>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-gray-900">${(order.products.reduce((total, item) => total + item.quantity * item.price, 0) - order.products.reduce((total, item, index) => total + item.quantity * filteredProducts[index].cost, 0)).toFixed(2)}</p>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  )
  }