import { Link } from "react-router-dom";

export default function Signup() {
  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <div className="w-96 bg-white p-8 shadow-lg rounded-xl">
        <h2 className="text-2xl font-bold text-center mb-6">Create Account</h2>
        <form className="space-y-4">
          <input type="text" placeholder="Full Name" className="w-full border rounded-lg p-2" />
          <input type="email" placeholder="Email" className="w-full border rounded-lg p-2" />
          <input type="password" placeholder="Password" className="w-full border rounded-lg p-2" />

          <select className="w-full border rounded-lg p-2">
            <option>Select Role</option>
            <option value="admin">Admin</option>
            <option value="dealer">Dealer</option>
            <option value="beneficiary">Beneficiary</option>
          </select>

          <button className="w-full bg-green-600 text-white py-2 rounded-lg">Sign Up</button>
        </form>
        <p className="text-sm text-center mt-4">
          Already have an account? <Link to="/admin/login" className="text-blue-600">Login</Link>
        </p>
      </div>
    </div>
  );
}
