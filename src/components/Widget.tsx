import { FaChartBar, FaGift, FaShoppingCart, FaWallet, FaTasks, FaHome } from "react-icons/fa";

const stats = [
  { title: "Earnings", value: "$340.5", icon: <FaChartBar />, bgColor: "bg-purple-500" },
  { title: "Spend this month", value: "$642.39", icon: <FaGift />, bgColor: "bg-purple-500" },
  { title: "Sales", value: "$574.34", icon: <FaShoppingCart />, bgColor: "bg-purple-500" },
  { title: "Your Balance", value: "$1,000", icon: <FaWallet />, bgColor: "bg-purple-500" },
  { title: "New Tasks", value: "145", icon: <FaTasks />, bgColor: "bg-purple-500" },
  { title: "Total Projects", value: "$2433", icon: <FaHome />, bgColor: "bg-purple-500" },
];

const DashboardStats = () => {
  return (
    <div className="w-full flex flex-wrap gap-4 justify-around my-10">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="flex items-center gap-4 p-6 bg-white shadow-md rounded-2xl w-[90%] sm:w-[300px]"
        >
          <div className={`p-3 rounded-full text-white ${stat.bgColor}`}>
            {stat.icon}
          </div>
          <div>
            <p className="text-gray-500">{stat.title}</p>
            <p className="text-lg font-semibold">{stat.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardStats;
