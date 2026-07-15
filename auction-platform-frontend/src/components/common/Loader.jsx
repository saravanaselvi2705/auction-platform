
import Spinner from "./Spinner";

export default function Loader({ message = "Loading, please wait..." }) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-3">
        <Spinner className="h-10 w-10 text-blue-600" />
        <p className="text-gray-600 font-medium animate-pulse">{message}</p>
      </div>
    </div>
  );
}
