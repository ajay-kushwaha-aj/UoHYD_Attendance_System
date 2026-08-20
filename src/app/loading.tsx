import { UniversityLoader } from "@/components/shared/university-loader";

export default function GlobalLoading() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background">
      <UniversityLoader
        message="Loading University of Hyderabad Attendance Portal..."
        subMessage="Initialising digital identity, secure cryptographic tokens & timetables"
      />
    </div>
  );
}
