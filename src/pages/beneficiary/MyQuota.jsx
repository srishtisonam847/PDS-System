import { Progress } from "antd";

export default function MyQuota() {
  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Your Monthly Quota</h2>
      <div className="space-y-4 max-w-lg">
        <div>
          <p>Rice - 75% used</p>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div className="bg-green-600 h-4 rounded-full w-3/4"></div>
          </div>
        </div>
        <div>
          <p>Wheat - 50% used</p>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div className="bg-yellow-500 h-4 rounded-full w-1/2"></div>
          </div>
        </div>
        <div>
          <p>Sugar - 25% used</p>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div className="bg-blue-600 h-4 rounded-full w-1/4"></div>
          </div>
        </div>
        <button className="bg-green-600 text-white px-4 py-2 rounded-lg">Download QR Code</button>
      </div>
    </div>
  );
}
