import { UniversityLoader } from "@/components/shared/university-loader";

export default function DashboardLoading() {
  return (
    <div className="w-full py-12 flex items-center justify-center">
      <UniversityLoader
        message="Loading Dashboard Workspace..."
        subMessage="Synchronizing live attendance sessions, curriculum records & compliance stats"
      />
    </div>
  );
}
