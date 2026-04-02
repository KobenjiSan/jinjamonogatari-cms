import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { ProtectedRoute } from "./routes/ProtectedRoute";
import LoginPage from "./pages/Login/LoginPage";
import DashboardPage from "./pages/Dashboard/DashboardPage";
import AppLayout from "./layouts/AppLayout";
import ShrinesPage from "./pages/Shrines/ShrinesPage";
import ShrineEditorLayout from "./layouts/ShrineEditorLayout";
import ShrineEditorPage from "./pages/ShrineEditor/ShrineEditorPage";
import EtiquettePage from "./pages/Etiquette/EtiquettePage";
import KamiPage from "./pages/Kami/KamiPage";
import ShrineReviewPage from "./pages/ShrineReview/ShrineReview";
import UsersPage from "./pages/Users/Users";
import AuditsPage from "./pages/Audits/Audits";
import TagsPage from "./pages/Tags/TagsPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/shrines" element={<ShrinesPage />} />
            <Route path="/etiquette" element={<EtiquettePage />} />
            <Route path="/kami" element={<KamiPage />} />
            <Route path="/tags" element={<TagsPage />} />
            <Route path="/admin-review" element={<ShrineReviewPage />} />
            <Route path="/users" element={<UsersPage />} />
            <Route path="/audits" element={<AuditsPage />} />
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
