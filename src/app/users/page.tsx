import React from 'react'

interface UsersType {
  first_name: string;
  id: string;
  last_active_at: string; 
  last_name: string;
}

const page = async() => {
    const response = await fetch(`https://api.clerk.com/v1/users`, {
        headers: {
          "Authorization": `Bearer ${process.env.CLERK_SECRET_KEY_SECOND}`,
        },
      })
    const users:UsersType[] = await response.json()
  return (
    <div className="w-full  mx-3 my-10 sm:mx-auto bg-white  overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800">User List</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((customer) => (
              <tr key={customer.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{customer.first_name}{' '}  {customer.last_name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{customer.id}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                {new Date(customer.last_active_at).toLocaleString('en-PK', {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: true,
  timeZone: 'Asia/Karachi',
})}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default page