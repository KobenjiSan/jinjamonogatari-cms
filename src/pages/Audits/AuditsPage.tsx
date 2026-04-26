import { useState } from "react";
import AuditFilters, {
  type AuditSearchFilters,
} from "../../features/audits/components/AuditFilters/AuditFilters";
import AuditHeader from "../../features/audits/components/AuditHeader/AuditHeader";
import AuditList from "../../features/audits/components/AuditList/AuditList";

export default function AuditsPage() {
  const [filters, setFilters] = useState<AuditSearchFilters | null>(null);

  return (
    <div>
      <AuditHeader />
      <div className="p-xl">
        <AuditFilters onSearch={setFilters} />
        <AuditList filters={filters} />
      </div>
    </div>
  );
}
