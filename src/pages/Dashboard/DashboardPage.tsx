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
      <div className="page-header">
        <div className="page-title-group">
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">CMS overview and account access.</p>
        </div>

        <button
          className="btn btn-outline"
          onClick={handleLogout}
          disabled={isLoading}
        >
          {isLoading ? "Logging out..." : "Logout"}
        </button>
      </div>

      {user && (
        <div className="p-xl">
          <section className="card">
            <div className="column gap-md">
              <div>
                <div className="text-sm text-secondary font-semibold">
                  Username
                </div>
                <div className="text-md text-primary">{user.username}</div>
              </div>

              <div>
                <div className="text-sm text-secondary font-semibold">Email</div>
                <div className="text-md text-primary">{user.email}</div>
              </div>

              <div>
                <div className="text-sm text-secondary font-semibold">Role</div>
                <div className="text-md text-primary">{user.role}</div>
              </div>
            </div>
          </section>
        </div>
      )}
    </div> 
  );
}
