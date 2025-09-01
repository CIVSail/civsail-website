'use client';

import Link from 'next/link';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useState, useEffect, useRef } from 'react';
import {
  ChevronRight,
  MapPin,
  Users,
  DollarSign,
  Thermometer,
  Anchor,
  Ship,
  Utensils,
  Wine,
  Wifi,
  Car,
  AlertTriangle,
} from 'lucide-react';

interface QuickStat {
  icon: React.ReactNode;
  label: string;
  value: string;
}

interface Section {
  id: string;
  title: string;
  icon: React.ReactNode;
}

export default function SaseboPortPage() {
  const [activeSection, setActiveSection] = useState('overview');
  const [weatherData, setWeatherData] = useState({ temp: '--', time: '--:--' });
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [usdAmount, setUsdAmount] = useState('');
  const [yenAmount, setYenAmount] = useState('');
  const [exchangeRate, setExchangeRate] = useState(0);
  const [localSpotsIndex, setLocalSpotsIndex] = useState(0);
  const [tasteOfHomeIndex, setTasteOfHomeIndex] = useState(0);
  // Weather useEffect
  useEffect(() => {
    const fetchWeatherAndTime = async () => {
      try {
        // Fetch weather for Sasebo coordinates
        const weatherResponse = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=33.1594&lon=129.7233&appid=${process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY}&units=imperial`
        );
        const weather = await weatherResponse.json();

        // Fetch time for Japan
        const timeResponse = await fetch(
          'http://worldtimeapi.org/api/timezone/Asia/Tokyo'
        );
        const timeData = await timeResponse.json();
        const localTime = new Date(timeData.datetime).toLocaleTimeString(
          'en-US',
          {
            timeZone: 'Asia/Tokyo',
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
          }
        );

        setWeatherData({
          temp: Math.round(weather.main.temp).toString(),
          time: localTime,
        });
      } catch (error) {
        console.error('Error fetching weather/time:', error);
      }
    };

    fetchWeatherAndTime();
    // Refresh every 10 minutes
    const interval = setInterval(fetchWeatherAndTime, 600000);
    return () => clearInterval(interval);
  }, []);

  // Map useEffect - separate from weather
  useEffect(() => {
    if (map.current) return;
    if (!mapContainer.current) return;

    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/satellite-streets-v12',
      center: [129.7233, 33.1594],
      zoom: 12,
    });

    // Add marker
    new mapboxgl.Marker({ color: '#3b82f6' })
      .setLngLat([129.7233, 33.1594])
      .setPopup(
        new mapboxgl.Popup().setHTML(
          '<h3>Sasebo Naval Base</h3><p>Primary port facility</p>'
        )
      )
      .addTo(map.current);
  }, []);

  // Currency exchange rate useEffect - separate from map
  useEffect(() => {
    const fetchExchangeRate = async () => {
      try {
        const response = await fetch(
          'https://api.exchangerate-api.com/v4/latest/USD'
        );
        const data = await response.json();
        setExchangeRate(data.rates.JPY);
      } catch (error) {
        console.error('Error fetching exchange rate:', error);
        setExchangeRate(130);
      }
    };

    fetchExchangeRate();
    const interval = setInterval(fetchExchangeRate, 3600000);
    return () => clearInterval(interval);
  }, []);

  // Move conversion functions here, outside all useEffects
  const convertUsdToYen = (usd: string) => {
    if (!usd || !exchangeRate) return '';
    const usdValue = parseFloat(usd);
    if (isNaN(usdValue)) return '';
    return (usdValue * exchangeRate).toLocaleString('en-US', {
      maximumFractionDigits: 0,
    });
  };

  const convertYenToUsd = (yen: string) => {
    if (!yen || !exchangeRate) return '';
    const yenValue = parseFloat(yen.replace(/,/g, ''));
    if (isNaN(yenValue)) return '';
    return (yenValue / exchangeRate).toFixed(2);
  };
  const quickStats: QuickStat[] = [
    {
      icon: <Anchor className="w-5 h-5" />,
      label: 'Port Type',
      value: 'Military • Naval Base',
    },
    {
      icon: <Ship className="w-5 h-5" />,
      label: 'Vessel Types',
      value: 'T-AKE, T-AO, Navy Vessels',
    },
    {
      icon: <Users className="w-5 h-5" />,
      label: 'Typical Stay',
      value: '2-5 days',
    },
    {
      icon: <Thermometer className="w-5 h-5" />,
      label: 'Weather & Time',
      value: `${weatherData.temp}°F • JST ${weatherData.time}`,
    },
  ];
  const localSpots = [
    {
      id: 1,
      name: 'DDD Ramen',
      type: 'Ramen Shop',
      description:
        'Popular ramen spot with excellent gyoza. Great atmosphere and authentic Japanese flavors.',
      highlights: ['Tonkotsu Ramen', 'Gyoza', 'Local Favorite'],
      priceRange: '¥800-1,500',
      location: 'Off Ginza Street',
    },
    {
      id: 2,
      name: 'Ra-Ra-ramen',
      type: 'Ramen Shop',
      description:
        'Second popular ramen location with great wings and chuhai. Compete with DDD for best ramen.',
      highlights: ['Miso Ramen', 'Chicken Wings', 'Chuhai'],
      priceRange: '¥900-1,600',
      location: 'Off Ginza Street',
    },
    {
      id: 3,
      name: 'Sushi Go-Round',
      type: 'Sushi Restaurant',
      description:
        'Unique conveyor belt sushi experience. English menu available with beer selection.',
      highlights: ['Conveyor Belt', 'English Menu', 'Beer Available'],
      priceRange: '¥200-500 per plate',
      location: '10-15 min walk from base',
    },
    {
      id: 4,
      name: 'Kunimatsu Coffee',
      type: 'Coffee Shop',
      description:
        'Must-visit coffee shop owned by sharply dressed Hiro. Look for the sailor statue out front.',
      highlights: ['Great Coffee', 'Friendly Owner', 'Sailor Statue'],
      priceRange: '¥300-800',
      location: 'Near Ginza',
    },
    {
      id: 5,
      name: 'Steak Salon',
      type: 'Steakhouse',
      description:
        'Intimate mom-and-pop steakhouse with 4-course meals. Semi-circle seating around chef.',
      highlights: ['4-Course Meals', 'Chef Performance', 'Premium Experience'],
      priceRange: '¥3,000-5,000',
      location: 'Downtown Area',
    },
  ];

  const tasteOfHome = [
    {
      id: 1,
      name: 'Galaxies Bar',
      type: 'American Bar',
      description:
        "American-style bar above Chili's with familiar comfort food, cheap drinks, and Wi-Fi.",
      highlights: ['Cheap Drinks', 'Good Wi-Fi', 'Slot Machines'],
      priceRange: '$5-15',
      location: "On Base - Above Chili's",
    },
    {
      id: 2,
      name: "Chili's",
      type: 'American Restaurant',
      description:
        'Familiar American chain restaurant on base. Standard menu with American comfort food.',
      highlights: ['American Menu', 'On Base', 'Familiar Food'],
      priceRange: '$10-20',
      location: 'On Base',
    },
    {
      id: 3,
      name: 'Starbucks',
      type: 'Coffee Chain',
      description:
        'Located on Ginza street. Popular Wi-Fi spot frequently visited by sailors.',
      highlights: ['Free Wi-Fi', 'Familiar Coffee', 'Central Location'],
      priceRange: '¥400-800',
      location: 'Ginza Street',
    },
    {
      id: 4,
      name: 'NEX Food Court',
      type: 'Food Court',
      description:
        'Multiple American fast food options in one location. Convenient and familiar.',
      highlights: ['Multiple Options', 'Fast Service', 'On Base'],
      priceRange: '$8-15',
      location: 'Fleet Landing - On Base',
    },
  ];
  // Rest of your component continues here...

  const sections: Section[] = [
    { id: 'overview', title: 'Overview', icon: <MapPin className="w-5 h-5" /> },
    {
      id: 'operations',
      title: 'Port Operations',
      icon: <Ship className="w-5 h-5" />,
    },
    {
      id: 'food',
      title: 'Food & Dining',
      icon: <Utensils className="w-5 h-5" />,
    },
    {
      id: 'nightlife',
      title: 'Bars & Nightlife',
      icon: <Wine className="w-5 h-5" />,
    },
    {
      id: 'transportation',
      title: 'Transportation',
      icon: <Car className="w-5 h-5" />,
    },
    {
      id: 'safety',
      title: 'Safety & Tips',
      icon: <AlertTriangle className="w-5 h-5" />,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Breadcrumb */}
          <div className="flex items-center text-white/70 text-sm mb-8">
            <Link href="/ports" className="hover:text-white transition-colors">
              Ports
            </Link>
            <ChevronRight className="w-4 h-4 mx-2" />
            <Link
              href="/ports/far-east"
              className="hover:text-white transition-colors"
            >
              Far East
            </Link>
            <ChevronRight className="w-4 h-4 mx-2" />
            <Link
              href="/ports/far-east/japan"
              className="hover:text-white transition-colors"
            >
              Japan
            </Link>
            <ChevronRight className="w-4 h-4 mx-2" />
            <span className="text-white">Sasebo</span>
          </div>

          {/* Hero Content */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center bg-blue-500/20 text-blue-300 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Anchor className="w-4 h-4 mr-2" />
                Naval Base • 7th Fleet Hub
              </div>
              <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6">
                Sasebo
              </h1>
              <p className="text-xl text-white/80 leading-relaxed mb-8">
                One of the most efficient loading ports in the world, located in
                southern Japan. Known for its professional operations, vibrant
                nightlife, and incredible food scene.
              </p>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-4">
                {quickStats.map((stat, index) => (
                  <div
                    key={index}
                    className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4"
                  >
                    <div className="flex items-center text-blue-300 mb-2">
                      {stat.icon}
                      <span className="ml-2 text-sm font-medium">
                        {stat.label}
                      </span>
                    </div>
                    <div className="text-white font-semibold">{stat.value}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation Menu */}
            <div className="lg:pl-8">
              <div className="bg-white/5 backdrop-blur-lg border border-white/20 rounded-2xl p-6">
                <h3 className="text-white font-semibold mb-4 text-lg">
                  Port Information
                </h3>
                <nav className="space-y-2">
                  {sections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full flex items-center p-3 rounded-xl transition-all duration-300 ${
                        activeSection === section.id
                          ? 'bg-blue-500/30 text-white border border-blue-400/50'
                          : 'text-white/70 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      {section.icon}
                      <span className="ml-3 font-medium">{section.title}</span>
                      <ChevronRight className="w-4 h-4 ml-auto" />
                    </button>
                  ))}
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Sections */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white/5 backdrop-blur-lg border border-white/20 rounded-2xl p-8 lg:p-12">
          {/* Overview Section */}
          {activeSection === 'overview' && (
            <div className="space-y-8">
              <div className="flex items-center mb-8">
                <MapPin className="w-8 h-8 text-blue-400 mr-4" />
                <h2 className="text-3xl font-bold text-white">Port Overview</h2>
              </div>

              {/* Map Container */}
              <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl p-6 border border-white/10">
                <h3 className="text-xl font-semibold text-white mb-4">
                  Port Map
                </h3>
                <div
                  ref={mapContainer}
                  className="w-full h-64 rounded-lg"
                  style={{ minHeight: '300px' }}
                />
              </div>

              {/* Port Description */}
              <div className="prose prose-invert max-w-none">
                <p className="text-lg text-white/80 leading-relaxed">
                  Sasebo, Japan, affectionately known as "Sas-Vegas", is in
                  southern Japan on the outskirts of Nagasaki. Hosting a large,
                  overseas US Navy base, Sasebo is a common loading port for
                  T-AKEs and T-AOs in the 7th fleet AOR.
                </p>

                {/* Updated Cards: Port Highlights and Quick Facts */}
                <div className="grid md:grid-cols-2 gap-8 mt-8">
                  <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl p-6 border border-white/10">
                    <h3 className="text-xl font-semibold text-white mb-4">
                      Port Highlights
                    </h3>
                    <ul className="space-y-3 text-white/80">
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        Most efficient loading port in the world
                      </li>
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        Walking distance to vibrant nightlife
                      </li>
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        Incredible Japanese cuisine scene
                      </li>
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        Professional, courteous port workers
                      </li>
                    </ul>
                  </div>

                  <div className="bg-gradient-to-br from-green-500/20 to-teal-500/20 rounded-xl p-6 border border-white/10">
                    <h3 className="text-xl font-semibold text-white mb-4">
                      Quick Facts
                    </h3>
                    <ul className="space-y-3 text-white/80">
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-green-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        English widely spoken in town
                      </li>
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-green-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        15-20 minute liberty launch transit
                      </li>
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-green-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        Well-equipped naval base facilities
                      </li>
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-green-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        Cash preferred, cards limited
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Currency Converter */}
              <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-xl p-6 border border-white/10">
                <h3 className="text-xl font-semibold text-white mb-4">
                  Currency Converter
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">
                      USD Amount
                    </label>
                    <input
                      type="number"
                      placeholder="100"
                      value={usdAmount}
                      onChange={(e) => {
                        setUsdAmount(e.target.value);
                        setYenAmount(convertUsdToYen(e.target.value));
                      }}
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    />
                  </div>
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">
                      Japanese Yen (¥)
                    </label>
                    <input
                      type="text"
                      placeholder="13,000"
                      value={yenAmount}
                      onChange={(e) => {
                        setYenAmount(e.target.value);
                        setUsdAmount(convertYenToUsd(e.target.value));
                      }}
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    />
                  </div>
                </div>
                <div className="flex justify-between items-center mt-4">
                  <p className="text-white/60 text-sm">
                    Current rate: 1 USD = ¥{exchangeRate.toFixed(2)}
                  </p>
                  <p className="text-white/60 text-sm">Rates update hourly</p>
                </div>
              </div>

              {/* Know Before You Go */}
              <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl p-6 border border-white/10">
                <h3 className="text-xl font-semibold text-white mb-6">
                  Know Before You Go
                </h3>

                <div className="grid md:grid-cols-2 gap-8">
                  {/* Weather & Clothing */}
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-4">
                      Weather & What to Pack
                    </h4>
                    <div className="space-y-3 text-white/80">
                      <div className="bg-white/10 rounded-lg p-4">
                        <h5 className="font-medium text-white mb-2">
                          Spring/Fall (Mar-May, Sep-Nov)
                        </h5>
                        <p className="text-sm">
                          Mild temps 60-75°F. Pack layers, light jacket,
                          comfortable walking shoes.
                        </p>
                      </div>
                      <div className="bg-white/10 rounded-lg p-4">
                        <h5 className="font-medium text-white mb-2">
                          Summer (Jun-Aug)
                        </h5>
                        <p className="text-sm">
                          Hot & humid 75-90°F. Light breathable clothes,
                          umbrella for rain season.
                        </p>
                      </div>
                      <div className="bg-white/10 rounded-lg p-4">
                        <h5 className="font-medium text-white mb-2">
                          Winter (Dec-Feb)
                        </h5>
                        <p className="text-sm">
                          Cool 40-60°F. Warm jacket essential, especially for
                          evening liberty.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Connectivity */}
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-4">
                      Stay Connected
                    </h4>
                    <div className="bg-white/10 rounded-lg p-4 mb-4">
                      <p className="text-white/80 text-sm mb-4">
                        Skip expensive roaming charges with a local eSIM. Get
                        data plans starting at $4.50 for Japan coverage.
                      </p>
                      <a
                        href="https://airalo.pxf.io/zxkLzG"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                      >
                        Get Japan eSIM →
                      </a>
                    </div>

                    <div className="space-y-2">
                      <h5 className="font-medium text-white">
                        Recommended Plans:
                      </h5>
                      <ul className="space-y-2 text-sm text-white/70">
                        <li>
                          • <strong>Japan 7 Days:</strong> 1GB for $4.50
                        </li>
                        <li>
                          • <strong>Japan 14 Days:</strong> 3GB for $11.00
                        </li>
                        <li>
                          • <strong>Asia Regional:</strong> 5GB for $16.00
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Operations Section */}
          {activeSection === 'operations' && (
            <div className="space-y-8">
              <div className="flex items-center mb-8">
                <Ship className="w-8 h-8 text-blue-400 mr-4" />
                <h2 className="text-3xl font-bold text-white">
                  Port Operations
                </h2>
              </div>

              {/* Typical Operations */}
              <div className="bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-xl p-6 border border-white/10">
                <h3 className="text-xl font-semibold text-white mb-4">
                  Typical Operations
                </h3>
                <p className="text-white/80 mb-4">
                  Sasebo serves as a major naval logistics hub for routine port
                  visits, loading, and fueling operations. The port specializes
                  in military vessel support with some of the most efficient
                  loading operations globally.
                </p>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-white mb-3">
                      Primary Functions
                    </h4>
                    <ul className="space-y-2 text-white/70">
                      <li>• Routine T-AKE and T-AO port visits</li>
                      <li>• Fuel and supplies loading</li>
                      <li>• Occasional Voyage Repair (VR) periods</li>
                      <li>• Navy vessel maintenance support</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-3">
                      Operation Notes
                    </h4>
                    <ul className="space-y-2 text-white/70">
                      <li>• Workers and trucks always punctual</li>
                      <li>• Professional, efficient cargo handling</li>
                      <li>• 24/7 security and base operations</li>
                      <li>• Harbor rarely experiences weather delays</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Pier Locations */}
              <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl p-6 border border-white/10">
                <h3 className="text-xl font-semibold text-white mb-4">
                  Pier Locations
                </h3>

                <div className="space-y-6">
                  {/* Anchoring Information */}
                  <div className="bg-white/10 rounded-lg p-4">
                    <h4 className="font-semibold text-white mb-3">
                      Anchoring Areas
                    </h4>
                    <p className="text-white/80 mb-3">
                      Most T-AKEs anchor in Sasebo harbor rather than pier-side.
                      Liberty launches provide reliable transportation to shore.
                    </p>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h5 className="font-medium text-white mb-2">
                          Anchor Details
                        </h5>
                        <ul className="space-y-1 text-white/70 text-sm">
                          <li>• 15-20 minute liberty launch transit</li>
                          <li>• Launches operate 0600-0100 (ship dependent)</li>
                          <li>• Well-maintained harbor with good holding</li>
                          <li>• Protected from most weather conditions</li>
                        </ul>
                      </div>
                      <div>
                        <h5 className="font-medium text-white mb-2">
                          Launch Operations
                        </h5>
                        <ul className="space-y-1 text-white/70 text-sm">
                          <li>• Multiple ships = multiple launch schedules</li>
                          <li>• Punctual and reliable service</li>
                          <li>• Two main drop-off points available</li>
                          <li>• Weather rarely impacts operations</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Pier Information */}
                  <div className="bg-white/10 rounded-lg p-4">
                    <h4 className="font-semibold text-white mb-3">
                      Pier Facilities
                    </h4>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="border-l-4 border-blue-400 pl-4">
                        <h5 className="font-semibold text-white mb-2">
                          Fuel Pier
                        </h5>
                        <p className="text-white/70 text-sm mb-2">
                          Primary fuel pier available for T-AO operations and
                          fuel transfers.
                        </p>
                        <ul className="space-y-1 text-white/60 text-xs">
                          <li>• Direct shore access when pier-side</li>
                          <li>• Full fuel loading capabilities</li>
                          <li>• Shore power and utilities available</li>
                        </ul>
                      </div>
                      <div className="border-l-4 border-green-400 pl-4">
                        <h5 className="font-semibold text-white mb-2">
                          Cargo Areas
                        </h5>
                        <p className="text-white/70 text-sm mb-2">
                          Multiple cargo handling areas for supplies and
                          equipment loading.
                        </p>
                        <ul className="space-y-1 text-white/60 text-xs">
                          <li>• Heavy-lift crane capabilities</li>
                          <li>• Container and break-bulk handling</li>
                          <li>• Secure storage areas available</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Liberty Drop-off Points */}
                  <div className="bg-yellow-500/20 rounded-lg border border-yellow-400/30 p-4">
                    <h4 className="font-semibold text-yellow-300 mb-3">
                      Liberty Drop-off Points
                    </h4>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="border-l-4 border-blue-400 pl-4">
                        <h5 className="font-semibold text-white mb-2">
                          Fleet Landing
                        </h5>
                        <p className="text-white/70 text-sm">
                          Primary drop-off point near USO and NEX food court.
                          Most convenient for base facilities access.
                        </p>
                      </div>
                      <div className="border-l-4 border-green-400 pl-4">
                        <h5 className="font-semibold text-white mb-2">
                          Flag Landing
                        </h5>
                        <p className="text-white/70 text-sm">
                          Alternative drop-off point by Navy Lodge. Good access
                          to lodging and alternate base facilities.
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 p-3 bg-red-500/20 rounded-lg border border-red-400/30">
                      <p className="text-red-300 text-sm font-medium">
                        Important: Take a picture of your ship's launch schedule
                        before departing. Multiple ships = multiple launches -
                        get on the right one!
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Food Section */}
          {activeSection === 'food' && (
            <div className="space-y-8">
              <div className="flex items-center mb-8">
                <Utensils className="w-8 h-8 text-blue-400 mr-4" />
                <h2 className="text-3xl font-bold text-white">Food & Dining</h2>
              </div>

              {/* Local Food and Drink */}
              <div className="bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-xl p-6 border border-white/10">
                <h3 className="text-xl font-semibold text-white mb-4">
                  Local Food & Drink
                </h3>
                <p className="text-lg text-white/80 leading-relaxed mb-6">
                  Sasebo offers incredible Japanese cuisine with something for
                  every palate. From authentic ramen shops to fresh sushi
                  experiences, the food scene here is unforgettable.
                </p>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-white/10 rounded-lg p-4">
                    <h4 className="font-semibold text-white mb-3">
                      Must-Try Local Specialties
                    </h4>
                    <ul className="space-y-2 text-white/80">
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-red-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <div>
                          <strong>Ramen:</strong> Rich tonkotsu and miso broths
                          with perfect noodles
                        </div>
                      </li>
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-red-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <div>
                          <strong>Fresh Sushi:</strong> Daily catch from local
                          waters, expertly prepared
                        </div>
                      </li>
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-red-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <div>
                          <strong>Gyoza:</strong> Perfectly pan-fried dumplings,
                          crispy and flavorful
                        </div>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-white/10 rounded-lg p-4">
                    <h4 className="font-semibold text-white mb-3">
                      Local Drinks to Try
                    </h4>
                    <ul className="space-y-2 text-white/80">
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <div>
                          <strong>Chuhai:</strong> 9% ABV mixed drink,
                          deceptively strong
                        </div>
                      </li>
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <div>
                          <strong>Habusake:</strong> Snake-infused sake, unique
                          local experience
                        </div>
                      </li>
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <div>
                          <strong>Local Beer:</strong> Asahi, Kirin, and Sapporo
                          on tap
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Local Spots Carousel */}
              <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl p-6 border border-white/10">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-white">
                    Local Spots
                  </h3>
                  <div className="flex space-x-2">
                    <button
                      onClick={() =>
                        setLocalSpotsIndex(Math.max(0, localSpotsIndex - 4))
                      }
                      disabled={localSpotsIndex === 0}
                      className="p-2 rounded-lg bg-white/10 text-white hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      ←
                    </button>
                    <button
                      onClick={() =>
                        setLocalSpotsIndex(
                          Math.min(localSpots.length - 4, localSpotsIndex + 4)
                        )
                      }
                      disabled={localSpotsIndex >= localSpots.length - 4}
                      className="p-2 rounded-lg bg-white/10 text-white hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      →
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {localSpots
                    .slice(localSpotsIndex, localSpotsIndex + 4)
                    .map((spot) => (
                      <div
                        key={spot.id}
                        className="bg-white/10 rounded-lg p-4 hover:bg-white/15 transition-all cursor-pointer group"
                      >
                        <h4 className="font-semibold text-white mb-1 group-hover:text-blue-300 transition-colors">
                          {spot.name}
                        </h4>
                        <p className="text-blue-300 text-sm mb-2">
                          {spot.type}
                        </p>
                        <p className="text-white/70 text-sm mb-3 line-clamp-2">
                          {spot.description}
                        </p>

                        <div className="space-y-2">
                          <div className="flex flex-wrap gap-1">
                            {spot.highlights
                              .slice(0, 2)
                              .map((highlight, idx) => (
                                <span
                                  key={idx}
                                  className="text-xs bg-blue-500/30 text-blue-200 px-2 py-1 rounded"
                                >
                                  {highlight}
                                </span>
                              ))}
                          </div>
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-green-300">
                              {spot.priceRange}
                            </span>
                            <span className="text-white/50">
                              {spot.location}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>

                <div className="flex justify-center mt-4">
                  <div className="flex space-x-2">
                    {Array.from({
                      length: Math.ceil(localSpots.length / 4),
                    }).map((_, idx) => (
                      <div
                        key={idx}
                        className={`w-2 h-2 rounded-full transition-all ${
                          Math.floor(localSpotsIndex / 4) === idx
                            ? 'bg-blue-400'
                            : 'bg-white/30'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* A Taste of Home Carousel */}
              <div className="bg-gradient-to-br from-green-500/20 to-teal-500/20 rounded-xl p-6 border border-white/10">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-white">
                    A Taste of Home
                  </h3>
                  <div className="flex space-x-2">
                    <button
                      onClick={() =>
                        setTasteOfHomeIndex(Math.max(0, tasteOfHomeIndex - 4))
                      }
                      disabled={tasteOfHomeIndex === 0}
                      className="p-2 rounded-lg bg-white/10 text-white hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      ←
                    </button>
                    <button
                      onClick={() =>
                        setTasteOfHomeIndex(
                          Math.min(tasteOfHome.length - 4, tasteOfHomeIndex + 4)
                        )
                      }
                      disabled={tasteOfHomeIndex >= tasteOfHome.length - 4}
                      className="p-2 rounded-lg bg-white/10 text-white hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      →
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {tasteOfHome
                    .slice(tasteOfHomeIndex, tasteOfHomeIndex + 4)
                    .map((spot) => (
                      <div
                        key={spot.id}
                        className="bg-white/10 rounded-lg p-4 hover:bg-white/15 transition-all cursor-pointer group"
                      >
                        <h4 className="font-semibold text-white mb-1 group-hover:text-green-300 transition-colors">
                          {spot.name}
                        </h4>
                        <p className="text-green-300 text-sm mb-2">
                          {spot.type}
                        </p>
                        <p className="text-white/70 text-sm mb-3 line-clamp-2">
                          {spot.description}
                        </p>

                        <div className="space-y-2">
                          <div className="flex flex-wrap gap-1">
                            {spot.highlights
                              .slice(0, 2)
                              .map((highlight, idx) => (
                                <span
                                  key={idx}
                                  className="text-xs bg-green-500/30 text-green-200 px-2 py-1 rounded"
                                >
                                  {highlight}
                                </span>
                              ))}
                          </div>
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-green-300">
                              {spot.priceRange}
                            </span>
                            <span className="text-white/50">
                              {spot.location}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>

                <div className="flex justify-center mt-4">
                  <div className="flex space-x-2">
                    {Array.from({
                      length: Math.ceil(tasteOfHome.length / 4),
                    }).map((_, idx) => (
                      <div
                        key={idx}
                        className={`w-2 h-2 rounded-full transition-all ${
                          Math.floor(tasteOfHomeIndex / 4) === idx
                            ? 'bg-green-400'
                            : 'bg-white/30'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Nightlife Section */}
          {activeSection === 'nightlife' && (
            <div className="space-y-8">
              <div className="flex items-center mb-8">
                <Wine className="w-8 h-8 text-blue-400 mr-4" />
                <h2 className="text-3xl font-bold text-white">
                  Bars & Nightlife
                </h2>
              </div>

              <div className="bg-red-500/20 border border-red-400/30 rounded-xl p-6 mb-8">
                <h3 className="text-xl font-semibold text-red-300 mb-4">
                  ⚠️ The Last Liberty Launch Warning
                </h3>
                <p className="text-white/80 mb-4">
                  <strong>DO NOT</strong> miss the last liberty launch! Finding
                  last-minute hotels is difficult and expensive.
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-white mb-2">
                      What Happens If You Miss It:
                    </h4>
                    <ul className="space-y-1 text-white/70 text-sm">
                      <li>• Sleep in Liberty Park (not recommended)</li>
                      <li>• Sleep in Fleet Landing bathroom</li>
                      <li>• Expensive last-minute hotels</li>
                      <li>• Cold nights in winter</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-2">Remember:</h4>
                    <ul className="space-y-1 text-white/70 text-sm">
                      <li>• You cannot swim to your ship</li>
                      <li>• Japan is farther north than you think</li>
                      <li>• Winter nights are brutally cold</li>
                      <li>• Get on the RIGHT launch</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="grid lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-xl p-6 border border-white/10">
                    <h3 className="text-xl font-semibold text-white mb-4">
                      🛣️ Sailor Town/Snake Alley
                    </h3>
                    <p className="text-white/80 mb-4">
                      Look for yellow Pele&apos;s sign off Ginza - great wings
                      and chuhai!
                    </p>

                    <h4 className="font-semibold text-white mb-2">
                      Sailor Town Bars:
                    </h4>
                    <div className="grid grid-cols-2 gap-2 text-sm text-white/70 mb-4">
                      <div>• G-rock</div>
                      <div>• Gramophones</div>
                      <div>• Jumble Saloon</div>
                      <div>• Shooters</div>
                      <div>• Playmates</div>
                      <div>• Greenies (3-story pool hall)</div>
                    </div>

                    <h4 className="font-semibold text-white mb-2">
                      Snake Alley (Around the Corner):
                    </h4>
                    <p className="text-white/70 text-sm mb-2">
                      Literal alley with Filipino karaoke bars.
                    </p>
                    <div className="grid grid-cols-2 gap-2 text-sm text-white/70">
                      <div>• Video Game Bar</div>
                      <div>• Garden Bar</div>
                      <div>• River Run</div>
                      <div>• Kings</div>
                      <div>• AA&apos;s</div>
                    </div>

                    <div className="mt-4 p-3 bg-yellow-500/20 rounded-lg border border-yellow-400/30">
                      <p className="text-yellow-300 text-sm">
                        <strong>Caution:</strong> Girls may try to get you to
                        buy them drinks. Be aware of this common practice.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl p-6 border border-white/10">
                    <h3 className="text-xl font-semibold text-white mb-4">
                      🍶 Sake Town
                    </h3>
                    <p className="text-white/80 mb-4">
                      Located on the other side of Ginza. More local clientele
                      compared to Sailor Town&apos;s MSC/Navy crowd.
                    </p>
                    <div className="p-3 bg-red-500/20 rounded-lg border border-red-400/30">
                      <p className="text-red-300 text-sm">
                        <strong>Note:</strong> Some establishments are
                        &quot;Japanese only&quot; - please respect these
                        policies.
                      </p>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-xl p-6 border border-white/10">
                    <h3 className="text-xl font-semibold text-white mb-4">
                      🏢 Lions Tower
                    </h3>
                    <p className="text-white/80 mb-4">
                      Building near Ginza that looks like apartments but
                      contains small bars.
                    </p>
                    <ul className="space-y-2 text-white/70 text-sm">
                      <li>• Golf-themed bars</li>
                      <li>• More karaoke bars</li>
                      <li>• Names change frequently</li>
                      <li>• Multiple floors of entertainment</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mt-8">
                <div className="bg-gradient-to-br from-green-500/20 to-teal-500/20 rounded-xl p-6 border border-white/10">
                  <h3 className="text-xl font-semibold text-white mb-4">
                    🍹 Chuhai
                  </h3>
                  <p className="text-white/80 mb-4">
                    &quot;Shochu&quot; + &quot;Highball&quot; = Popular Japanese
                    mixed drink
                  </p>
                  <ul className="space-y-2 text-white/70 text-sm">
                    <li>
                      • <strong>9% ABV</strong> but doesn&apos;t taste like it
                    </li>
                    <li>• Available in cans and on tap</li>
                    <li>
                      • Multiple flavors: lemon, lime, grapefruit, apple, etc.
                    </li>
                    <li>
                      • <strong>Warning:</strong> Often the &quot;jet fuel on
                      the Sasebo fire&quot;
                    </li>
                  </ul>
                </div>

                <div className="bg-gradient-to-br from-red-500/20 to-orange-500/20 rounded-xl p-6 border border-white/10">
                  <h3 className="text-xl font-semibold text-white mb-4">
                    🐍 Habusake
                  </h3>
                  <p className="text-white/80 mb-4">
                    Sake with preserved pit viper snake - most unique drink in
                    the world
                  </p>
                  <ul className="space-y-2 text-white/70 text-sm">
                    <li>• Rice wine with snake in bottle</li>
                    <li>• Served as shots ladled from mason jars</li>
                    <li>• Local legend about 24-hour mating snakes</li>
                    <li>• Available at small liquor stores to buy</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Transportation Section */}
          {activeSection === 'transportation' && (
            <div className="space-y-8">
              <div className="flex items-center mb-8">
                <Car className="w-8 h-8 text-blue-400 mr-4" />
                <h2 className="text-3xl font-bold text-white">
                  Transportation
                </h2>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-xl p-6 border border-white/10">
                    <h3 className="text-xl font-semibold text-white mb-4">
                      🚤 Liberty Launches
                    </h3>
                    <p className="text-white/80 mb-4">
                      Primary transportation between ship and shore.
                    </p>
                    <ul className="space-y-2 text-white/70">
                      <li>
                        • <strong>Operating Hours:</strong> 0600-0100 (varies by
                        ship)
                      </li>
                      <li>
                        • <strong>Transit Time:</strong> 15-20 minutes each way
                      </li>
                      <li>
                        • <strong>Drop-off Points:</strong> Fleet Landing or
                        Flag Landing
                      </li>
                      <li>• Well-maintained and punctual service</li>
                    </ul>

                    <div className="mt-4 p-3 bg-red-500/20 rounded-lg border border-red-400/30">
                      <p className="text-red-300 text-sm">
                        <strong>Critical:</strong> Take a photo of your
                        ship&apos;s launch schedule! Multiple ships = multiple
                        launches.
                      </p>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-green-500/20 to-teal-500/20 rounded-xl p-6 border border-white/10">
                    <h3 className="text-xl font-semibold text-white mb-4">
                      🚌 Local Transportation
                    </h3>
                    <ul className="space-y-2 text-white/70">
                      <li>
                        • <strong>Walking:</strong> Most attractions within
                        walking distance
                      </li>
                      <li>
                        • <strong>Local Buses:</strong> Connect to nearby areas
                      </li>
                      <li>
                        • <strong>Taxis:</strong> Available but more expensive
                      </li>
                      <li>
                        • <strong>Base Shuttle:</strong> Limited routes on base
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl p-6 border border-white/10">
                    <h3 className="text-xl font-semibold text-white mb-4">
                      🗺️ Getting Around Town
                    </h3>
                    <p className="text-white/80 mb-4">
                      Sasebo&apos;s compact layout makes it very walkable for
                      sailors.
                    </p>

                    <div className="space-y-3">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-blue-400 rounded-full mr-3"></div>
                        <span className="text-white/80">
                          <strong>Ginza:</strong> Main shopping/dining street
                        </span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-green-400 rounded-full mr-3"></div>
                        <span className="text-white/80">
                          <strong>Sailor Town:</strong> 5-min walk from base
                        </span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-purple-400 rounded-full mr-3"></div>
                        <span className="text-white/80">
                          <strong>Snake Alley:</strong> Adjacent to Sailor Town
                        </span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-orange-400 rounded-full mr-3"></div>
                        <span className="text-white/80">
                          <strong>Sake Town:</strong> Other side of Ginza
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-xl p-6 border border-white/10">
                    <h3 className="text-xl font-semibold text-white mb-4">
                      🚆 Regional Travel
                    </h3>
                    <p className="text-white/80 mb-4">
                      Explore beyond Sasebo during longer port visits.
                    </p>
                    <ul className="space-y-2 text-white/70">
                      <li>
                        • <strong>Nagasaki:</strong> 1.5 hours by train
                      </li>
                      <li>
                        • <strong>Fukuoka:</strong> 2 hours by train
                      </li>
                      <li>
                        • <strong>Local JR Station:</strong> Near downtown area
                      </li>
                      <li>• Consider day trips for 3+ day visits</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Safety Section */}
          {activeSection === 'safety' && (
            <div className="space-y-8">
              <div className="flex items-center mb-8">
                <AlertTriangle className="w-8 h-8 text-blue-400 mr-4" />
                <h2 className="text-3xl font-bold text-white">Safety & Tips</h2>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-red-500/20 to-orange-500/20 rounded-xl p-6 border border-white/10">
                    <h3 className="text-xl font-semibold text-white mb-4">
                      ⚠️ Critical Safety Reminders
                    </h3>

                    <div className="space-y-4">
                      <div className="p-3 bg-red-600/30 rounded-lg border border-red-400/50">
                        <h4 className="font-semibold text-red-200 mb-2">
                          🚤 Liberty Launch Safety
                        </h4>
                        <ul className="space-y-1 text-white/80 text-sm">
                          <li>• Never miss the last launch</li>
                          <li>• Verify your ship&apos;s schedule</li>
                          <li>• Get on the correct launch</li>
                          <li>• Have backup communication plan</li>
                        </ul>
                      </div>

                      <div className="p-3 bg-yellow-600/30 rounded-lg border border-yellow-400/50">
                        <h4 className="font-semibold text-yellow-200 mb-2">
                          🍺 Drinking Responsibly
                        </h4>
                        <ul className="space-y-1 text-white/80 text-sm">
                          <li>• Chuhai is stronger than it tastes (9% ABV)</li>
                          <li>• Pace yourself throughout the day</li>
                          <li>• Stay hydrated with water</li>
                          <li>• Never drink and swim</li>
                        </ul>
                      </div>

                      <div className="p-3 bg-blue-600/30 rounded-lg border border-blue-400/50">
                        <h4 className="font-semibold text-blue-200 mb-2">
                          ❄️ Weather Awareness
                        </h4>
                        <ul className="space-y-1 text-white/80 text-sm">
                          <li>• Japan is farther north than expected</li>
                          <li>• Winter nights can be brutally cold</li>
                          <li>• Dress appropriately for season</li>
                          <li>• Pack layers for temperature changes</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-green-500/20 to-teal-500/20 rounded-xl p-6 border border-white/10">
                    <h3 className="text-xl font-semibold text-white mb-4">
                      🤝 Cultural Respect
                    </h3>
                    <p className="text-white/80 mb-4">
                      Japan has a strong culture of respect and politeness.
                    </p>

                    <div className="space-y-3">
                      <div>
                        <h4 className="font-semibold text-white mb-2">
                          Do&apos;s:
                        </h4>
                        <ul className="space-y-1 text-white/70 text-sm">
                          <li>• Bow as a greeting</li>
                          <li>• Remove shoes when required</li>
                          <li>• Be quiet on public transport</li>
                          <li>
                            • Respect &quot;Japanese only&quot; establishments
                          </li>
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-semibold text-white mb-2">
                          Don&apos;ts:
                        </h4>
                        <ul className="space-y-1 text-white/70 text-sm">
                          <li>• Don&apos;t tip (it&apos;s not customary)</li>
                          <li>• Don&apos;t eat while walking</li>
                          <li>• Don&apos;t be loud in public</li>
                          <li>• Don&apos;t point with chopsticks</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl p-6 border border-white/10">
                    <h3 className="text-xl font-semibold text-white mb-4">
                      💡 Pro Tips
                    </h3>

                    <ul className="space-y-3 text-white/80">
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        Download Google Translate with camera feature for menus
                      </li>
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        Carry cash - many places don&apos;t accept cards
                      </li>
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        Learn basic Japanese phrases (arigatou, sumimasen)
                      </li>
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        Exchange money at base before going to town
                      </li>
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        Keep your military ID accessible
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-600/20 to-indigo-600/20 rounded-xl p-6 border border-white/10">
                <h3 className="text-xl font-semibold text-white mb-4">
                  📞 Emergency Information
                </h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <h4 className="font-semibold text-blue-300 mb-2">
                      Base Security
                    </h4>
                    <p className="text-white/70 text-sm">
                      Contact base security for any incidents or emergencies on
                      base
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-blue-300 mb-2">
                      Local Emergency
                    </h4>
                    <p className="text-white/70 text-sm">
                      110 (Police) / 119 (Fire/Ambulance) - Japanese emergency
                      numbers
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-blue-300 mb-2">
                      Ship Contact
                    </h4>
                    <p className="text-white/70 text-sm">
                      Always have your ship&apos;s emergency contact information
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center text-white/60">
          <p className="mb-2">
            Information compiled from sailor experiences and port visits
          </p>
          <p className="text-sm">
            Always verify current information with your ship&apos;s port brief
          </p>
        </div>
      </div>
    </div>
  );
}
