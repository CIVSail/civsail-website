'use client';
// Add this type declaration at the top of your file
declare global {
  interface Window {
    scrollToSection?: (sectionId: string) => void;
  }
}
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
  const [hangsIndex, setHangsIndex] = useState(0);
  const [highEnergyIndex, setHighEnergyIndex] = useState(0);
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
          'https://worldtimeapi.org/api/timezone/Asia/Tokyo'
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

  // Update your existing map useEffect
  useEffect(() => {
    if (map.current) return;
    if (!mapContainer.current) return;

    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/satellite-streets-v12',
      center: [129.7233, 33.1594],
      zoom: 14, // Increased zoom to better show the pins
    });

    // Define all locations with their data - coordinates typed as tuples
    const locations: Array<{
      name: string;
      coordinates: [number, number]; // Explicitly type as tuple
      type: string;
      description: string;
      color: string;
    }> = [
      {
        name: 'Sasebo Naval Base',
        coordinates: [129.7233, 33.1594],
        type: 'base',
        description: 'Primary port facility',
        color: '#3b82f6',
      },
      {
        name: 'Fleet Landing',
        coordinates: [129.71432, 33.16628],
        type: 'landing',
        description: 'Primary liberty launch drop-off point',
        color: '#10b981',
      },
      {
        name: 'Flag Landing',
        coordinates: [129.71702, 33.16571],
        type: 'landing',
        description: 'Alternative liberty launch drop-off point',
        color: '#10b981',
      },
      {
        name: 'Steak Salon',
        coordinates: [129.72305, 33.16701],
        type: 'restaurant',
        description: 'Intimate steakhouse with 4-course meals',
        color: '#f59e0b',
      },
      {
        name: 'Ra Ra Ramen',
        coordinates: [129.72356, 33.16735],
        type: 'restaurant',
        description: 'Popular ramen spot with great gyoza',
        color: '#f59e0b',
      },
      {
        name: 'Kunimatsu Coffee',
        coordinates: [129.72265, 33.17007],
        type: 'restaurant',
        description: 'Must-visit coffee shop owned by Hiro',
        color: '#f59e0b',
      },
      {
        name: "McDonald's",
        coordinates: [129.72145, 33.17107],
        type: 'restaurant',
        description: 'Familiar American fast food',
        color: '#ef4444',
      },
      {
        name: "Chili's & Galaxies",
        coordinates: [129.71145, 33.16662],
        type: 'restaurant',
        description: 'On-base American dining and bar',
        color: '#ef4444',
      },
    ];

    // Add markers for each location
    locations.forEach((location) => {
      // Create popup content with click handler
      const popupHTML = `
      <div class="p-2">
        <h3 class="font-semibold text-gray-900 mb-1">${location.name}</h3>
        <p class="text-gray-600 text-sm mb-2">${location.description}</p>
        <button 
          onclick="window.scrollToSection && window.scrollToSection('${
            location.type === 'restaurant' ? 'food' : 'operations'
          }')"
          class="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          ${
            location.type === 'restaurant'
              ? 'View Food Section →'
              : 'View Operations →'
          }
        </button>
      </div>
    `;

      new mapboxgl.Marker({
        color: location.color,
        scale: 0.8, // Make pins slightly smaller since there are many
      })
        .setLngLat(location.coordinates)
        .setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML(popupHTML))
        .addTo(map.current!); // Add non-null assertion here
    });
  }, []);

  // Add this NEW useEffect to handle map resize when switching tabs
  useEffect(() => {
    if (map.current && activeSection === 'overview') {
      // Small delay to ensure container is visible
      setTimeout(() => {
        map.current?.resize();
      }, 100);
    }
  }, [activeSection]);

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
  const hangsAndDives = [
    {
      id: 1,
      name: 'Kunimatsu Coffee',
      type: 'Coffee & Conversation',
      description:
        'Must-visit coffee shop owned by sharply dressed Hiro. Perfect for quiet conversation.',
      highlights: ['Great Coffee', 'Friendly Owner', 'Quiet Atmosphere'],
      priceRange: '¥300-800',
      location: 'Near Ginza',
    },
    {
      id: 2,
      name: 'Steak Salon',
      type: 'Intimate Steakhouse',
      description:
        'Mom-and-pop steakhouse with semi-circle seating. Great for dinner conversation.',
      highlights: ['4-Course Meals', 'Chef Performance', 'Intimate Setting'],
      priceRange: '¥3,000-5,000',
      location: 'Downtown Area',
    },
    {
      id: 3,
      name: 'G-rock Bar',
      type: 'Sailor Bar',
      description:
        'Popular sailor hangout in Sailor Town. Good for conversation and meeting other mariners.',
      highlights: ['Sailor Crowd', 'Good Conversation', 'Regular Hangout'],
      priceRange: '¥500-1,500',
      location: 'Sailor Town',
    },
    {
      id: 4,
      name: 'Gramophones',
      type: 'Music Bar',
      description:
        'Relaxed music bar with good atmosphere for conversation over drinks.',
      highlights: ['Music Theme', 'Relaxed Vibe', 'Good Drinks'],
      priceRange: '¥600-1,800',
      location: 'Sailor Town',
    },
  ];

  const higherEnergy = [
    {
      id: 1,
      name: 'Snake Alley Karaoke',
      type: 'Filipino Karaoke',
      description:
        'Literal alley with multiple Filipino karaoke bars. High energy and interactive.',
      highlights: ['Karaoke', 'Filipino Staff', 'Interactive'],
      priceRange: '¥800-2,000',
      location: 'Snake Alley',
    },
    {
      id: 2,
      name: 'Greenies Pool Hall',
      type: '3-Story Pool Hall',
      description:
        '3-story entertainment complex with pool, games, and high-energy atmosphere.',
      highlights: ['Pool Tables', '3 Stories', 'Games'],
      priceRange: '¥1,000-2,500',
      location: 'Sailor Town',
    },
    {
      id: 3,
      name: 'Lions Tower Bars',
      type: 'Multi-Floor Entertainment',
      description:
        'Building with multiple karaoke and entertainment bars across different floors.',
      highlights: ['Multiple Floors', 'Karaoke', 'Variety'],
      priceRange: '¥700-2,000',
      location: 'Near Ginza',
    },
    {
      id: 4,
      name: 'Video Game Bar',
      type: 'Gaming Bar',
      description:
        'High-energy bar with arcade games and interactive entertainment.',
      highlights: ['Arcade Games', 'High Energy', 'Interactive'],
      priceRange: '¥600-1,800',
      location: 'Snake Alley',
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

  // Add this function to handle popup navigation
  useEffect(() => {
    // Make the scroll function available globally for popup buttons
    window.scrollToSection = (sectionId: string) => {
      setActiveSection(sectionId);
      // Small delay to ensure section loads, then scroll to top
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 100);
    };

    // Cleanup
    return () => {
      delete window.scrollToSection;
    };
  }, []);

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

              {/* Key Points - Warning Section First */}
              <div className="bg-gradient-to-br from-red-500/20 to-orange-500/20 rounded-xl p-6 border border-white/10">
                <h3 className="text-xl font-semibold text-white mb-4">
                  Key Points
                </h3>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-white/10 rounded-lg p-4">
                    <h4 className="font-semibold text-white mb-3">
                      Essential Reminders
                    </h4>
                    <ul className="space-y-2 text-white/80">
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-red-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <div>
                          <strong>Last Liberty Launch:</strong> Never miss it!
                          Hotels are expensive and limited
                        </div>
                      </li>
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-red-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <div>
                          <strong>Get on Right Launch:</strong> Multiple ships =
                          multiple schedules
                        </div>
                      </li>
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-red-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <div>
                          <strong>Chuhai Warning:</strong> 9% ABV but doesn't
                          taste like it
                        </div>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-white/10 rounded-lg p-4">
                    <h4 className="font-semibold text-white mb-3">
                      Local Etiquette & Tips
                    </h4>
                    <ul className="space-y-2 text-white/80">
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <div>
                          <strong>No Tipping:</strong> Not customary in Japan,
                          can be offensive
                        </div>
                      </li>
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <div>
                          <strong>Drink Buying:</strong> Be aware girls may ask
                          you to buy drinks
                        </div>
                      </li>
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <div>
                          <strong>Japanese Only:</strong> Respect establishments
                          with this policy
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Hangs and Dives Carousel */}
              <div className="bg-gradient-to-br from-amber-500/20 to-yellow-500/20 rounded-xl p-6 border border-white/10">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-white">
                    Hangs and Dives
                  </h3>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setHangsIndex(Math.max(0, hangsIndex - 4))}
                      disabled={hangsIndex === 0}
                      className="p-2 rounded-lg bg-white/10 text-white hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      ←
                    </button>
                    <button
                      onClick={() =>
                        setHangsIndex(
                          Math.min(hangsAndDives.length - 4, hangsIndex + 4)
                        )
                      }
                      disabled={hangsIndex >= hangsAndDives.length - 4}
                      className="p-2 rounded-lg bg-white/10 text-white hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      →
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {hangsAndDives
                    .slice(hangsIndex, hangsIndex + 4)
                    .map((spot) => (
                      <div
                        key={spot.id}
                        className="bg-white/10 rounded-lg p-4 hover:bg-white/15 transition-all cursor-pointer group"
                      >
                        <h4 className="font-semibold text-white mb-1 group-hover:text-amber-300 transition-colors">
                          {spot.name}
                        </h4>
                        <p className="text-amber-300 text-sm mb-2">
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
                                  className="text-xs bg-amber-500/30 text-amber-200 px-2 py-1 rounded"
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
                      length: Math.ceil(hangsAndDives.length / 4),
                    }).map((_, idx) => (
                      <div
                        key={idx}
                        className={`w-2 h-2 rounded-full transition-all ${
                          Math.floor(hangsIndex / 4) === idx
                            ? 'bg-amber-400'
                            : 'bg-white/30'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Higher Energy Carousel */}
              <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl p-6 border border-white/10">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-white">
                    Higher Energy
                  </h3>
                  <div className="flex space-x-2">
                    <button
                      onClick={() =>
                        setHighEnergyIndex(Math.max(0, highEnergyIndex - 4))
                      }
                      disabled={highEnergyIndex === 0}
                      className="p-2 rounded-lg bg-white/10 text-white hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      ←
                    </button>
                    <button
                      onClick={() =>
                        setHighEnergyIndex(
                          Math.min(higherEnergy.length - 4, highEnergyIndex + 4)
                        )
                      }
                      disabled={highEnergyIndex >= higherEnergy.length - 4}
                      className="p-2 rounded-lg bg-white/10 text-white hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      →
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {higherEnergy
                    .slice(highEnergyIndex, highEnergyIndex + 4)
                    .map((spot) => (
                      <div
                        key={spot.id}
                        className="bg-white/10 rounded-lg p-4 hover:bg-white/15 transition-all cursor-pointer group"
                      >
                        <h4 className="font-semibold text-white mb-1 group-hover:text-purple-300 transition-colors">
                          {spot.name}
                        </h4>
                        <p className="text-purple-300 text-sm mb-2">
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
                                  className="text-xs bg-purple-500/30 text-purple-200 px-2 py-1 rounded"
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
                      length: Math.ceil(higherEnergy.length / 4),
                    }).map((_, idx) => (
                      <div
                        key={idx}
                        className={`w-2 h-2 rounded-full transition-all ${
                          Math.floor(highEnergyIndex / 4) === idx
                            ? 'bg-purple-400'
                            : 'bg-white/30'
                        }`}
                      />
                    ))}
                  </div>
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

              {/* To Town from Berth */}
              <div className="bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-xl p-6 border border-white/10">
                <h3 className="text-xl font-semibold text-white mb-4">
                  🚤 To Town from Berth
                </h3>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-white/10 rounded-lg p-4">
                    <h4 className="font-semibold text-white mb-3">
                      Liberty Launches
                    </h4>
                    <p className="text-white/80 mb-3">
                      Primary transportation between anchored ships and shore
                      facilities.
                    </p>
                    <ul className="space-y-2 text-white/70 text-sm">
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
                      <li>
                        • <strong>Frequency:</strong> Every 30-60 minutes
                      </li>
                      <li>• Well-maintained and punctual service</li>
                    </ul>
                  </div>

                  <div className="bg-white/10 rounded-lg p-4">
                    <h4 className="font-semibold text-white mb-3">
                      Pier-Side Access
                    </h4>
                    <p className="text-white/80 mb-3">
                      When moored pier-side, direct walking access to base
                      facilities.
                    </p>
                    <ul className="space-y-2 text-white/70 text-sm">
                      <li>
                        • <strong>Walking Distance:</strong> 5-10 minutes to
                        base gate
                      </li>
                      <li>
                        • <strong>Base Facilities:</strong> NEX, commissary,
                        food court
                      </li>
                      <li>
                        • <strong>Town Access:</strong> 10-15 minute walk to
                        Ginza
                      </li>
                      <li>
                        • <strong>Security:</strong> Valid military ID required
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-red-500/20 rounded-lg border border-red-400/30">
                  <h4 className="font-semibold text-red-300 mb-2">
                    ⚠️ Critical Reminder
                  </h4>
                  <p className="text-white/80 text-sm">
                    <strong>
                      Take a photo of your ship's launch schedule!
                    </strong>{' '}
                    Multiple ships = multiple launches. Missing the last launch
                    means expensive hotels or sleeping in Liberty Park.
                  </p>
                </div>
              </div>

              {/* Around Town */}
              <div className="bg-gradient-to-br from-green-500/20 to-teal-500/20 rounded-xl p-6 border border-white/10">
                <h3 className="text-xl font-semibold text-white mb-4">
                  🚗 Around Town
                </h3>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-white/10 rounded-lg p-4">
                    <h4 className="font-semibold text-white mb-3">Walking</h4>
                    <p className="text-white/80 mb-3">
                      Sasebo's compact layout makes most attractions easily
                      walkable.
                    </p>
                    <ul className="space-y-2 text-white/70 text-sm">
                      <li>
                        • <strong>Ginza Street:</strong> Main dining/shopping
                        area
                      </li>
                      <li>
                        • <strong>Sailor Town:</strong> 5-minute walk from base
                      </li>
                      <li>
                        • <strong>Snake Alley:</strong> Adjacent to Sailor Town
                      </li>
                      <li>
                        • <strong>Sake Town:</strong> 10-minute walk from Ginza
                      </li>
                      <li>• Most attractions within 15-minute walk</li>
                    </ul>
                  </div>

                  <div className="bg-white/10 rounded-lg p-4">
                    <h4 className="font-semibold text-white mb-3">
                      Taxis & Ride Services
                    </h4>
                    <p className="text-white/80 mb-3">
                      Limited ride-sharing, but taxis are readily available.
                    </p>
                    <ul className="space-y-2 text-white/70 text-sm">
                      <li>
                        • <strong>Uber:</strong> Very limited availability in
                        Sasebo
                      </li>
                      <li>
                        • <strong>Local Taxis:</strong> Available at base and
                        town
                      </li>
                      <li>
                        • <strong>Cost:</strong> ¥500-1,500 for local trips
                      </li>
                      <li>
                        • <strong>Language:</strong> Basic English, use
                        translation app
                      </li>
                      <li>
                        • <strong>Payment:</strong> Cash preferred, some accept
                        cards
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="bg-white/10 rounded-lg p-4 mt-4">
                  <h4 className="font-semibold text-white mb-3">
                    🚌 Public Transportation
                  </h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h5 className="font-medium text-white mb-2">
                        Local Buses
                      </h5>
                      <ul className="space-y-1 text-white/70 text-xs">
                        <li>• Connect to nearby neighborhoods</li>
                        <li>• ¥200-400 per trip</li>
                        <li>• Limited English signage</li>
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-medium text-white mb-2">
                        Base Shuttle
                      </h5>
                      <ul className="space-y-1 text-white/70 text-xs">
                        <li>• Limited routes within base</li>
                        <li>• Free for military personnel</li>
                        <li>• Connects major base facilities</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Regional Travel */}
              <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl p-6 border border-white/10">
                <h3 className="text-xl font-semibold text-white mb-4">
                  🚆 Regional Travel
                </h3>

                <p className="text-white/80 mb-6">
                  Sasebo's location provides excellent access to major Japanese
                  destinations for longer port visits.
                </p>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="bg-white/10 rounded-lg p-4">
                      <div className="flex items-center mb-3">
                        <span className="text-2xl mr-3">🏮</span>
                        <div>
                          <h4 className="font-semibold text-white">Nagasaki</h4>
                          <p className="text-purple-300 text-sm">
                            1.5 hours by train
                          </p>
                        </div>
                      </div>
                      <p className="text-white/70 text-sm mb-2">
                        Historic city with Peace Park, Atomic Bomb Museum, and
                        unique culture.
                      </p>
                      <ul className="space-y-1 text-white/60 text-xs">
                        <li>• JR Sasebo Line direct connection</li>
                        <li>• ¥1,140 one-way ticket</li>
                        <li>• Perfect for day trips</li>
                      </ul>
                    </div>

                    <div className="bg-white/10 rounded-lg p-4">
                      <div className="flex items-center mb-3">
                        <span className="text-2xl mr-3">🏙️</span>
                        <div>
                          <h4 className="font-semibold text-white">Fukuoka</h4>
                          <p className="text-purple-300 text-sm">
                            2 hours by train
                          </p>
                        </div>
                      </div>
                      <p className="text-white/70 text-sm mb-2">
                        Major city with shopping, dining, and nightlife. Gateway
                        to wider Japan.
                      </p>
                      <ul className="space-y-1 text-white/60 text-xs">
                        <li>• JR Midori line to Hakata Station</li>
                        <li>• ¥2,470 one-way ticket</li>
                        <li>• International airport connections</li>
                      </ul>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-white/10 rounded-lg p-4">
                      <div className="flex items-center mb-3">
                        <span className="text-2xl mr-3">⛩️</span>
                        <div>
                          <h4 className="font-semibold text-white">
                            Local Attractions
                          </h4>
                          <p className="text-purple-300 text-sm">
                            30min - 1 hour
                          </p>
                        </div>
                      </div>
                      <ul className="space-y-1 text-white/70 text-sm">
                        <li>
                          • <strong>Huis Ten Bosch:</strong> Dutch theme park (1
                          hour)
                        </li>
                        <li>
                          • <strong>Kujukushima Islands:</strong> Scenic boat
                          tours
                        </li>
                        <li>
                          • <strong>Mount Yumihari:</strong> Hiking and views
                        </li>
                        <li>
                          • <strong>Sasebo Burgers:</strong> Local specialty
                          food
                        </li>
                      </ul>
                    </div>

                    <div className="bg-white/10 rounded-lg p-4">
                      <h4 className="font-semibold text-white mb-3">
                        Transportation Tips
                      </h4>
                      <ul className="space-y-1 text-white/70 text-sm">
                        <li>
                          • <strong>JR Pass:</strong> Worth it for 3+ day trips
                        </li>
                        <li>
                          • <strong>IC Cards:</strong> Convenient for local
                          transport
                        </li>
                        <li>
                          • <strong>Google Maps:</strong> Works well for train
                          routes
                        </li>
                        <li>
                          • <strong>Hyperdia App:</strong> Train timetables in
                          English
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Local Airports */}
              <div className="bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-xl p-6 border border-white/10">
                <h3 className="text-xl font-semibold text-white mb-4">
                  ✈️ Local Airports
                </h3>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-white/10 rounded-lg p-4">
                    <div className="flex items-center mb-4">
                      <span className="text-3xl mr-4">🛬</span>
                      <div>
                        <h4 className="font-semibold text-white">
                          Fukuoka Airport (FUK)
                        </h4>
                        <p className="text-orange-300 text-sm">
                          Primary International Gateway
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <h5 className="font-medium text-white mb-2">
                          Distance & Travel Time
                        </h5>
                        <ul className="space-y-1 text-white/70 text-sm">
                          <li>
                            • <strong>Distance:</strong> 85 km (53 miles) from
                            Sasebo
                          </li>
                          <li>
                            • <strong>By Train:</strong> 2-2.5 hours via JR
                            lines
                          </li>
                          <li>
                            • <strong>By Bus:</strong> 2 hours direct highway
                            bus
                          </li>
                          <li>
                            • <strong>By Taxi:</strong> 1.5 hours
                            (¥15,000-20,000)
                          </li>
                        </ul>
                      </div>

                      <div>
                        <h5 className="font-medium text-white mb-2">
                          Flight Connections
                        </h5>
                        <ul className="space-y-1 text-white/70 text-sm">
                          <li>
                            • <strong>International:</strong> Seoul, Shanghai,
                            Manila, etc.
                          </li>
                          <li>
                            • <strong>Domestic:</strong> Tokyo, Osaka, Okinawa
                          </li>
                          <li>
                            • <strong>Airlines:</strong> ANA, JAL, Korean Air,
                            Cebu Pacific
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-white/10 rounded-lg p-4">
                      <h4 className="font-semibold text-white mb-3">
                        Crew Change Logistics
                      </h4>
                      <ul className="space-y-2 text-white/70 text-sm">
                        <li>
                          • <strong>Advance Booking:</strong> Reserve transport
                          24-48 hours ahead
                        </li>
                        <li>
                          • <strong>Highway Bus:</strong> Most economical option
                          (¥2,000-3,000)
                        </li>
                        <li>
                          • <strong>Shared Taxi:</strong> Coordinate with other
                          crew members
                        </li>
                        <li>
                          • <strong>Luggage:</strong> All transport options
                          accommodate seabags
                        </li>
                      </ul>
                    </div>

                    <div className="bg-white/10 rounded-lg p-4">
                      <h4 className="font-semibold text-white mb-3">
                        Alternative Airports
                      </h4>
                      <ul className="space-y-2 text-white/70 text-sm">
                        <li>
                          • <strong>Nagasaki Airport:</strong> 1.5 hours,
                          limited international
                        </li>
                        <li>
                          • <strong>Kumamoto Airport:</strong> 2.5 hours, some
                          international
                        </li>
                        <li>
                          • <strong>Saga Airport:</strong> 1.5 hours, budget
                          domestic flights
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-blue-500/20 rounded-lg border border-blue-400/30">
                  <h4 className="font-semibold text-blue-300 mb-2">
                    💡 Pro Tips for Crew Changes
                  </h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <ul className="space-y-1 text-white/80 text-sm">
                      <li>• Book transportation when flight is confirmed</li>
                      <li>• Allow 3+ hours for domestic connections</li>
                      <li>• Keep ship contact info for schedule changes</li>
                    </ul>
                    <ul className="space-y-1 text-white/80 text-sm">
                      <li>• Download Google Translate offline</li>
                      <li>• Carry cash for local transport</li>
                      <li>• Confirm pickup times day before travel</li>
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

              {/* How People Get in Trouble */}
              <div className="bg-gradient-to-br from-red-500/20 to-orange-500/20 rounded-xl p-6 border border-white/10">
                <h3 className="text-xl font-semibold text-white mb-4">
                  ⚠️ How People Get in Trouble
                </h3>

                <p className="text-white/80 mb-6">
                  Learn from others' mistakes. These are the most common liberty
                  incidents that can ruin your port visit or career.
                </p>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="bg-white/10 rounded-lg p-4">
                      <h4 className="font-semibold text-red-300 mb-3">
                        🚤 Missing Liberty Launch
                      </h4>
                      <p className="text-white/80 text-sm mb-2">
                        The #1 liberty incident. Missing the last launch leads
                        to expensive hotels or sleeping rough.
                      </p>
                      <ul className="space-y-1 text-white/70 text-xs">
                        <li>• Getting on wrong ship's launch</li>
                        <li>• Losing track of time at bars</li>
                        <li>• Not knowing launch schedule changes</li>
                        <li>• Weather delays without backup plan</li>
                      </ul>
                    </div>

                    <div className="bg-white/10 rounded-lg p-4">
                      <h4 className="font-semibold text-red-300 mb-3">
                        🍺 Alcohol-Related Incidents
                      </h4>
                      <p className="text-white/80 text-sm mb-2">
                        Chuhai and other local drinks are stronger than they
                        taste. Overindulging leads to problems.
                      </p>
                      <ul className="space-y-1 text-white/70 text-xs">
                        <li>• Underestimating 9% ABV chuhai</li>
                        <li>• Drinking competitions with locals</li>
                        <li>• Public intoxication and disturbances</li>
                        <li>• Getting rolled or overcharged</li>
                      </ul>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-white/10 rounded-lg p-4">
                      <h4 className="font-semibold text-red-300 mb-3">
                        💸 Financial Incidents
                      </h4>
                      <p className="text-white/80 text-sm mb-2">
                        Money problems can escalate quickly in foreign ports,
                        especially with language barriers.
                      </p>
                      <ul className="space-y-1 text-white/70 text-xs">
                        <li>• Buying drinks for bar girls repeatedly</li>
                        <li>• Not understanding pricing at clubs</li>
                        <li>• Credit card fraud or overcharges</li>
                        <li>• Falling for tourist scams</li>
                      </ul>
                    </div>

                    <div className="bg-white/10 rounded-lg p-4">
                      <h4 className="font-semibold text-red-300 mb-3">
                        🚫 Cultural Missteps
                      </h4>
                      <p className="text-white/80 text-sm mb-2">
                        Disrespecting local customs can escalate from
                        embarrassing to serious quickly.
                      </p>
                      <ul className="space-y-1 text-white/70 text-xs">
                        <li>• Ignoring "Japanese only" policies</li>
                        <li>• Being loud or disruptive in public</li>
                        <li>• Inappropriate behavior in sacred spaces</li>
                        <li>• Disrespecting local customs or people</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Critical Reminders */}
              <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-xl p-6 border border-white/10">
                <h3 className="text-xl font-semibold text-white mb-4">
                  🛡️ Critical Reminders
                </h3>

                <p className="text-white/80 mb-6">
                  Follow these guidelines to stay safe and avoid incidents that
                  could impact your career or liberty.
                </p>

                <div className="grid md:grid-cols-3 gap-6">
                  <div className="bg-white/10 rounded-lg p-4">
                    <h4 className="font-semibold text-yellow-300 mb-3">
                      🕒 Time Management
                    </h4>
                    <ul className="space-y-2 text-white/80 text-sm">
                      <li>• Set multiple alarms for launch times</li>
                      <li>• Take photo of ship's launch schedule</li>
                      <li>• Account for travel time back to landing</li>
                      <li>• Have backup plan if you miss launch</li>
                      <li>• Know which launch is yours</li>
                    </ul>
                  </div>

                  <div className="bg-white/10 rounded-lg p-4">
                    <h4 className="font-semibold text-yellow-300 mb-3">
                      💰 Money Safety
                    </h4>
                    <ul className="space-y-2 text-white/80 text-sm">
                      <li>• Carry cash, cards have limited acceptance</li>
                      <li>• Set spending limits before going out</li>
                      <li>• Don't flash large amounts of cash</li>
                      <li>• Understand pricing before ordering</li>
                      <li>• Never leave drinks unattended</li>
                    </ul>
                  </div>

                  <div className="bg-white/10 rounded-lg p-4">
                    <h4 className="font-semibold text-yellow-300 mb-3">
                      🤝 Cultural Respect
                    </h4>
                    <ul className="space-y-2 text-white/80 text-sm">
                      <li>• Bow as greeting, don't tip</li>
                      <li>• Respect "Japanese only" establishments</li>
                      <li>• Keep voices down in public</li>
                      <li>• Remove shoes when required</li>
                      <li>• Learn basic phrases: arigatou, sumimasen</li>
                    </ul>
                  </div>
                </div>

                <div className="mt-6 grid md:grid-cols-2 gap-6">
                  <div className="bg-blue-500/20 rounded-lg border border-blue-400/30 p-4">
                    <h4 className="font-semibold text-blue-300 mb-3">
                      📱 Communication & Documentation
                    </h4>
                    <ul className="space-y-2 text-white/80 text-sm">
                      <li>• Keep military ID accessible at all times</li>
                      <li>• Download Google Translate offline</li>
                      <li>• Share location with shipmates</li>
                      <li>• Keep ship contact info handy</li>
                      <li>• Take photos of important addresses</li>
                    </ul>
                  </div>

                  <div className="bg-purple-500/20 rounded-lg border border-purple-400/30 p-4">
                    <h4 className="font-semibold text-purple-300 mb-3">
                      🌡️ Weather & Health
                    </h4>
                    <ul className="space-y-2 text-white/80 text-sm">
                      <li>• Japan is farther north than expected</li>
                      <li>• Winter nights are brutally cold</li>
                      <li>• Pack layers for temperature changes</li>
                      <li>• Stay hydrated, especially when drinking</li>
                      <li>• Know location of nearest medical facilities</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Key Contacts */}
              <div className="bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-xl p-6 border border-white/10">
                <h3 className="text-xl font-semibold text-white mb-4">
                  📞 Key Contacts
                </h3>

                <p className="text-white/80 mb-6">
                  Keep these contact numbers accessible. Save them in your phone
                  before going on liberty.
                </p>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="bg-white/10 rounded-lg p-4">
                      <h4 className="font-semibold text-blue-300 mb-3">
                        🚨 Emergency Numbers
                      </h4>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center p-2 bg-red-500/20 rounded border border-red-400/30">
                          <span className="text-white font-medium">Police</span>
                          <span className="text-red-300 font-bold text-lg">
                            110
                          </span>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-red-500/20 rounded border border-red-400/30">
                          <span className="text-white font-medium">
                            Fire/Ambulance
                          </span>
                          <span className="text-red-300 font-bold text-lg">
                            119
                          </span>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-blue-500/20 rounded border border-blue-400/30">
                          <span className="text-white font-medium">
                            Base Security
                          </span>
                          <span className="text-blue-300 font-medium">
                            Contact via base operator
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white/10 rounded-lg p-4">
                      <h4 className="font-semibold text-blue-300 mb-3">
                        🇺🇸 U.S. Embassy & Consulate
                      </h4>
                      <div className="space-y-2 text-white/80 text-sm">
                        <div>
                          <strong>U.S. Consulate Fukuoka</strong>
                          <p className="text-white/70">
                            5-26 Ohori 2-chome, Chuo-ku, Fukuoka 810-0052
                          </p>
                          <p className="text-blue-300">+81-92-751-9331</p>
                        </div>
                        <div className="mt-3">
                          <strong>U.S. Embassy Tokyo (24/7 Emergency)</strong>
                          <p className="text-blue-300">+81-3-3224-5000</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-white/10 rounded-lg p-4">
                      <h4 className="font-semibold text-blue-300 mb-3">
                        🏥 Medical Facilities
                      </h4>
                      <div className="space-y-3 text-white/80 text-sm">
                        <div>
                          <strong>U.S. Naval Hospital Sasebo</strong>
                          <p className="text-white/70">
                            On base - Primary medical care
                          </p>
                          <p className="text-green-300">
                            Emergency: Dial base operator
                          </p>
                        </div>
                        <div>
                          <strong>Sasebo City General Hospital</strong>
                          <p className="text-white/70">
                            Off-base emergency facility
                          </p>
                          <p className="text-white/60">
                            9-3 Hirase-cho, Sasebo
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white/10 rounded-lg p-4">
                      <h4 className="font-semibold text-blue-300 mb-3">
                        🚢 Ship & Base Contacts
                      </h4>
                      <div className="space-y-2 text-white/80 text-sm">
                        <div className="p-2 bg-yellow-500/20 rounded border border-yellow-400/30">
                          <strong className="text-yellow-300">
                            Your Ship:
                          </strong>
                          <p className="text-white/70">
                            Always keep your ship's emergency contact number
                          </p>
                        </div>
                        <div>
                          <strong>Base Information:</strong>
                          <p className="text-white/70">
                            +81-956-50-3000 (main base number)
                          </p>
                        </div>
                        <div>
                          <strong>Shore Patrol:</strong>
                          <p className="text-white/70">
                            Contact through base security
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-green-500/20 rounded-lg border border-green-400/30">
                  <h4 className="font-semibold text-green-300 mb-3">
                    💡 Contact Tips
                  </h4>
                  <div className="grid md:grid-cols-3 gap-4 text-white/80 text-sm">
                    <ul className="space-y-1">
                      <li>• Save all numbers in your phone</li>
                      <li>• Screenshot important contacts</li>
                      <li>• Share emergency contacts with shipmates</li>
                    </ul>
                    <ul className="space-y-1">
                      <li>• Keep written backup in wallet</li>
                      <li>• Know your ship's name in Japanese</li>
                      <li>• Learn basic emergency phrases</li>
                    </ul>
                    <ul className="space-y-1">
                      <li>• Always carry military ID</li>
                      <li>• Know base address in Japanese</li>
                      <li>• Download offline translation app</li>
                    </ul>
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
