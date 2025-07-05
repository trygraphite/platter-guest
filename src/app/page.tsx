export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">
            Platter Guest App
          </h1>
          <p className="mt-3 text-lg text-gray-600">
            Restaurant guest ordering system
          </p>
        </div>

        <div className="mt-8 bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">For Development</h2>
          <p className="text-gray-600 mb-4">
            To test the restaurant pages, visit a subdomain like:
          </p>
          <div className="bg-gray-100 p-3 rounded-md font-mono text-sm">
            http://restaurant-name.localhost:3000
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Replace &quot;restaurant-name&quot; with any restaurant subdomain
          </p>
        </div>
      </div>
    </div>
  );
}