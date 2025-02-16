'use client'
import { client } from '@/sanity/lib/client';
import { ChevronDown } from 'lucide-react'
import React, { useState } from 'react'
import { ToastContainer, toast } from 'react-toastify';





const statusOptions = ["Processing", "Shipped", "Completed", "Cancelled"]
const OrderStatus = ({status , id}: {status: string, id:string}) => {
    const [Status, setStatus] = useState(status)
  const [isEditingStatus, setIsEditingStatus] = useState(false)
  const [showSave, setShowSave] = useState(false)

  const handleStatusChange = (newStatus: string) => {
    setStatus(newStatus)
    setIsEditingStatus(false)
    setShowSave(true)
  }

  async function updateStatus(status: string, id:string) {
    try {

      await client
        .patch(id) 
        .set({status,})
        .commit();
      setShowSave(false)
      toast.success('Status has been updated',{
        position: "top-right",
        autoClose: 2000,  
      })

    } catch (error) {
      console.error("Update failed:", error);
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800"
      case "Processing":
        return "bg-blue-100 text-blue-800"
      case "Shipped":
        return "bg-purple-100 text-purple-800"
      case "Cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-yellow-100 text-yellow-800"
    }
  }

  return (
    <div>
    <ToastContainer />

        {isEditingStatus ? (
                <div className="relative">
                  <select
                    value={Status}
                    onChange={(e) => handleStatusChange(e.target.value)}
                    className="block appearance-none w-full bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  >
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <ChevronDown className="h-4 w-4" />
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setIsEditingStatus(true)}
                  className={`px-3 py-1 rounded-full flex text-sm font-semibold ${getStatusColor(Status)}`}
                >
                  {Status}<ChevronDown/>
                </button>
              )}

        {showSave && <div className='left-0 w-screen flex justify-center fixed top-8 z-10'>
          <button className='bg-black font-semibold shadow-lg text-white text-2xl py-2 px-4 rounded-lg  ' onClick={()=> updateStatus(Status, id)}>Save</button>
        </div>}
    </div>
  )
}

export default OrderStatus