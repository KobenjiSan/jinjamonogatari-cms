import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { ProtectedRoute } from "./routes/ProtectedRoute";
import LoginPage from "./pages/Login/LoginPage";
import DashboardPage from "./pages/Dashboard/DashboardPage";
import AppLayout from "./layouts/AppLayout";
import ShrinesPage from "./pages/Shrines/ShrinesPage";
import ShrineEditorLayout from "./layouts/ShrineEditorLayout";
import ShrineEditorPage from "./pages/ShrineEditor/ShrineEditorPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/shrines" element={<ShrinesPage />} />
          </Route>

          <Route path="/shrines/:shrineId" element={<ShrineEditorLayout />}>
            <Route index element={<ShrineEditorPage />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
