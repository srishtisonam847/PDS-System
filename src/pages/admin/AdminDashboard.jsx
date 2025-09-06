export default function AdminDashboard() {
    const activities = [
      { shop: "#SHP-0451", activity: "Stock updated: Rice - 500kg", status: "Completed" },
      { shop: "#SHP-0823", activity: "Anomaly flagged: Wheat mismatch", status: "Pending Review" },
      { shop: "#SHP-0112", activity: "New user registered", status: "Ongoing" }
    ];
  
    return (
      <div className="p-6 bg-gray-900 text-white h-screen">
        <h2 className="text-2xl font-bold mb-6">Admin Overview</h2>
        <div className="grid grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-800 p-6 rounded-xl">Total Shops: 1250</div>
          <div className="bg-gray-800 p-6 rounded-xl">Total Stock: 5000 Tons</div>
          <div className="bg-gray-800 p-6 rounded-xl">Flagged Anomalies: 15</div>
        </div>
        <h3 className="text-xl mb-4">Recent Activity</h3>
        <div className="bg-gray-800 rounded-xl p-4">
          {activities.map((a, i) => (
            <div key={i} className="flex justify-between py-2 border-b border-gray-700">
              <span>{a.shop} - {a.activity}</span>
              <span className="text-green-400">{a.status}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  