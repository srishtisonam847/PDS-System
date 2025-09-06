export default function DealerStock() {
    return (
      <div className="p-6">
        <h2 className="text-xl font-bold mb-4">Manage Stock</h2>
        <form className="space-y-4 max-w-md">
          <input type="number" placeholder="Rice (kg)" className="w-full border rounded-lg p-2" />
          <input type="number" placeholder="Wheat (kg)" className="w-full border rounded-lg p-2" />
          <input type="number" placeholder="Sugar (kg)" className="w-full border rounded-lg p-2" />
          <div className="flex gap-4">
            <button className="bg-green-600 text-white px-4 py-2 rounded-lg">Update Stock</button>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg">View Stock History</button>
          </div>
        </form>
      </div>
    );
  }
  