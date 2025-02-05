import React from 'react'

const Widget = ({title, icon, value}: {title: string, icon:any, value:string|number}) => {
  return (
    <div
          className="flex items-center gap-4 p-6 bg-white shadow-md rounded-2xl w-[90%] sm:w-[300px]"
        >
          <div className={`p-2 h-12 w-12 flex justify-center items-center rounded-full text-white bg-purple-500`}>
            {icon}
          </div>
          <div>
            <p className="text-lg font-semibold">{value}</p>
            <p className="text-gray-500">{title}</p>
          </div>
        </div>
  )
}

export default Widget