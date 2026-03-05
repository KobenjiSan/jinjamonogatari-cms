import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthProvider";

export default function DashboardPage() {
  const { user, signOut, isLoading } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await signOut();
    navigate("/login");
  }

  return (
    <div>
      <h1>Dashboard</h1>

      {user && (
        <div>
          <p>Welcome, {user.username}</p>
          <p>Email: {user.email}</p>
        </div>
      )}

      <button onClick={handleLogout} disabled={isLoading}>
        {isLoading ? "Logging out..." : "Logout"}
      </button>
    </div>
  );
}
