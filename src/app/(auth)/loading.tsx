import { UniversityLoader } from "@/components/shared/university-loader";

export default function AuthLoading() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background">
      <UniversityLoader
        message="Verifying Institutional Credentials..."
        subMessage="Authenticating against University of Hyderabad LDAP / SAML Directory"
      />
    </div>
  );
}
