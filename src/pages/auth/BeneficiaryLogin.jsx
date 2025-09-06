import { Link } from "react-router-dom";

export default function BeneficiaryLogin() {
  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <div className="w-96 bg-white p-8 shadow-lg rounded-xl">
        <h2 className="text-2xl font-bold text-center mb-6">Beneficiary Login</h2>
        <form className="space-y-4">
          <input type="text" placeholder="Username or Email" className="w-full border rounded-lg p-2" />
          <input type="password" placeholder="Password" className="w-full border rounded-lg p-2" />
          <div className="flex items-center justify-between">
            <label className="text-sm flex items-center gap-1">
              <input type="checkbox" /> Remember me
            </label>
            <a href="#" className="text-sm text-blue-600">Forgot password?</a>
          </div>
          <button className="w-full bg-green-600 text-white py-2 rounded-lg">Login</button>
        </form>
        <p className="text-sm text-center mt-4">
          Don’t have an account? <Link to="/signup" className="text-blue-600">Sign Up</Link>
        </p>
      </div>
    </div>
  );
}
