export default function ShipsPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">
          Ships by Sector
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Select a maritime sector to explore different vessel types and what life is like aboard each ship class.
        </p>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <a 
            href="/ships/msc"
            className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow border-l-4 border-blue-600"
          >
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">MSC</h2>
            <p className="text-gray-600">
              Military Sealift Command vessels supporting Navy operations worldwide
            </p>
          </a>
          
          <div className="bg-white p-6 rounded-lg shadow-lg opacity-75 border-l-4 border-gray-400">
            <h2 className="text-2xl font-semibold text-gray-600 mb-3">NOAA</h2>
            <p className="text-gray-500">
              National Oceanic and Atmospheric Administration research vessels
            </p>
            <p className="text-sm text-gray-400 mt-2">Coming Soon</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-lg opacity-75 border-l-4 border-gray-400">
            <h2 className="text-2xl font-semibold text-gray-600 mb-3">Deep Sea</h2>
            <p className="text-gray-500">
              Commercial deep sea vessels and international shipping
            </p>
            <p className="text-sm text-gray-400 mt-2">Coming Soon</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-lg opacity-75 border-l-4 border-gray-400">
            <h2 className="text-2xl font-semibold text-gray-600 mb-3">Tug and Barge</h2>
            <p className="text-gray-500">
              Inland waterways and coastal towing operations
            </p>
            <p className="text-sm text-gray-400 mt-2">Coming Soon</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-lg opacity-75 border-l-4 border-gray-400">
            <h2 className="text-2xl font-semibold text-gray-600 mb-3">Oil Rig</h2>
            <p className="text-gray-500">
              Offshore oil and gas platform support vessels
            </p>
            <p className="text-sm text-gray-400 mt-2">Coming Soon</p>
          </div>
        </div>
      </div>
    </div>
  );
}