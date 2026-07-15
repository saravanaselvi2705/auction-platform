import { Link } from "react-router-dom";
import PageTitle from "../../components/common/PageTitle";
import Button from "../../components/ui/Button";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-6 py-12">
      <PageTitle title="404 - Page Not Found" />
      <div className="text-center max-w-md space-y-6">
        <span className="text-8xl">🔍</span>
        <h1 className="text-4xl font-black text-gray-900 tracking-tight">404 - Page Not Found</h1>
        <p className="text-gray-500 font-semibold leading-relaxed">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <div className="pt-4">
          <Link to="/" className="inline-block">
            <Button variant="primary" size="lg">
              Return to Homepage
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
