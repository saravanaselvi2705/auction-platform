import { Link } from "react-router-dom";
import PageTitle from "../../components/common/PageTitle";
import Button from "../../components/ui/Button";

export default function Unauthorized() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-6 py-12">
      <PageTitle title="403 - Unauthorized Access" />
      <div className="text-center max-w-md space-y-6">
        <span className="text-8xl">🚫</span>
        <h1 className="text-4xl font-black text-gray-900 tracking-tight">403 - Access Denied</h1>
        <p className="text-gray-500 font-semibold leading-relaxed">
          You do not have the required permissions or roles to view this page. If you believe this is an error, please contact your administrator.
        </p>
        <div className="pt-4">
          <Link to="/" className="inline-block">
            <Button variant="primary" size="lg">
              Return to Safety
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
