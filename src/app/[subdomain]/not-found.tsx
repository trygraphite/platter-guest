import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-white p-4">
      <div className="w-full max-w-md space-y-8 text-center">
        <div>
          <h1 className="text-6xl font-bold text-gray-900">404</h1>
          <h2 className="mt-4 text-2xl font-semibold text-gray-700">
            Restaurant Not Found
          </h2>
          <p className="mt-2 text-lg text-gray-600">
            The restaurant you&apos;re looking for doesn&apos;t exist or is no longer available.
          </p>
        </div>

        <div className="mt-8 bg-white shadow-md rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            What you can do:
          </h3>
          <ul className="text-gray-600 space-y-2 text-left">
            <li>• Check the URL for typos</li>
            <li>• Contact the restaurant directly</li>
            <li>• Visit our main website</li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => window.history.back()}
            className="flex-1 bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors"
          >
            Go Back
          </button>
          <Link
            href="https://platterng.com"
            className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Visit Platter
          </Link>
        </div>
      </div>
    </div>
  );
} 