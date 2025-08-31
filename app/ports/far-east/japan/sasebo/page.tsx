'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
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

              <div className="prose prose-invert max-w-none">
                <p className="text-lg text-white/80 leading-relaxed">
                  Sasebo, Japan, affectionately known as &quot;Sas-Vegas&quot;,
                  is in southern Japan on the outskirts of Nagasaki. Hosting a
                  large, overseas US Navy base, Sasebo is a common loading port
                  for T-AKEs and T-AOs in the 7th fleet AOR.
                </p>

                <div className="grid md:grid-cols-2 gap-8 mt-8">
                  <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl p-6 border border-white/10">
                    <h3 className="text-xl font-semibold text-white mb-4">
                      Why CIVMARs Love Sasebo
                    </h3>
                    <ul className="space-y-3 text-white/80">
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        Most efficient loading port in the world
                      </li>
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        Base proximity to town attractions
                      </li>
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        Incredible Japanese culture & food
                      </li>
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        Vibrant nightlife scene
                      </li>
                    </ul>
                  </div>

                  <div className="bg-gradient-to-br from-green-500/20 to-teal-500/20 rounded-xl p-6 border border-white/10">
                    <h3 className="text-xl font-semibold text-white mb-4">
                      Port Characteristics
                    </h3>
                    <ul className="space-y-3 text-white/80">
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-green-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        Professional, courteous workers
                      </li>
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-green-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        Punctual loading operations
                      </li>
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-green-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        Well-equipped naval base
                      </li>
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-green-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        Walking distance to attractions
                      </li>
                    </ul>
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

              <div className="grid lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-xl p-6 border border-white/10">
                    <h3 className="text-xl font-semibold text-white mb-4">
                      Typical Operations
                    </h3>
                    <p className="text-white/80 mb-4">
                      Sasebo is a major hub for routine port visits, loading,
                      and fueling operations. May be the most efficient port in
                      the world.
                    </p>
                    <ul className="space-y-2 text-white/70">
                      <li>• Routine T-AKE and T-AO port visits</li>
                      <li>• Loading and fueling operations</li>
                      <li>• Occasional Voyage Repair (VR) periods</li>
                      <li>• Workers and trucks always punctual</li>
                    </ul>
                  </div>

                  <div className="bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-xl p-6 border border-white/10">
                    <h3 className="text-xl font-semibold text-white mb-4">
                      Anchoring Information
                    </h3>
                    <p className="text-white/80 mb-4">
                      AKEs typically anchor in Sasebo harbor. Fuel pier
                      available primarily for AOs.
                    </p>
                    <ul className="space-y-2 text-white/70">
                      <li>• 15-20 minute liberty launch transit</li>
                      <li>• Launches operate 0600-0100 (ship dependent)</li>
                      <li>• Punctual and well-maintained boats</li>
                      <li>• Harbor rarely experiences bad weather</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl p-6 border border-white/10">
                  <h3 className="text-xl font-semibold text-white mb-4">
                    Liberty Drop-off Points
                  </h3>
                  <div className="space-y-4">
                    <div className="border-l-4 border-blue-400 pl-4">
                      <h4 className="font-semibold text-white">
                        Fleet Landing
                      </h4>
                      <p className="text-white/70 text-sm">
                        Primary drop-off point near USO and NEX food court
                      </p>
                    </div>
                    <div className="border-l-4 border-green-400 pl-4">
                      <h4 className="font-semibold text-white">Flag Landing</h4>
                      <p className="text-white/70 text-sm">
                        Alternative drop-off by Navy Lodge
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-yellow-500/20 rounded-lg border border-yellow-400/30">
                    <h4 className="font-semibold text-yellow-300 mb-2">
                      ⚠️ Important Reminder
                    </h4>
                    <p className="text-white/80 text-sm">
                      Take a picture of your ship&apos;s schedule before
                      departing. Multiple ships = multiple launches - get on the
                      right one!
                    </p>
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

              <p className="text-lg text-white/80 mb-8">
                Plain and simple, Sasebo has fantastic food. Sushi, Steak,
                Burgers, Ramen and more - Sasebo has something for everyone.
              </p>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-red-500/20 to-orange-500/20 rounded-xl p-6 border border-white/10">
                  <h3 className="text-xl font-semibold text-white mb-4">
                    🍜 Ramen
                  </h3>
                  <p className="text-white/80 mb-4">
                    Two most popular spots both located off the Ginza with great
                    gyoza.
                  </p>
                  <ul className="space-y-2 text-white/70">
                    <li>
                      • <strong>DDD Ramen</strong>
                    </li>
                    <li>
                      • <strong>Ra-Ra-ramen</strong>
                    </li>
                    <li>Try both and pick your favorite!</li>
                  </ul>
                </div>

                <div className="bg-gradient-to-br from-green-500/20 to-teal-500/20 rounded-xl p-6 border border-white/10">
                  <h3 className="text-xl font-semibold text-white mb-4">
                    🍣 Sushi
                  </h3>
                  <p className="text-white/80 mb-4">
                    Multiple spots on Ginza, plus the unique sushi go-round
                    experience.
                  </p>
                  <ul className="space-y-2 text-white/70">
                    <li>• Several Ginza locations</li>
                    <li>
                      • <strong>Sushi Go-Round</strong> (10-15 min walk)
                    </li>
                    <li>• Conveyor belt system</li>
                    <li>• English menu & beer available</li>
                  </ul>
                </div>

                <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl p-6 border border-white/10">
                  <h3 className="text-xl font-semibold text-white mb-4">
                    ☕ Kunimatsu
                  </h3>
                  <p className="text-white/80 mb-4">
                    Must-visit coffee shop owned by sharply dressed Hiro.
                  </p>
                  <ul className="space-y-2 text-white/70">
                    <li>• Great coffee</li>
                    <li>• Friendly owner Hiro</li>
                    <li>• Family-owned legacy shop</li>
                    <li>• Look for sailor statue out front</li>
                  </ul>
                </div>

                <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl p-6 border border-white/10">
                  <h3 className="text-xl font-semibold text-white mb-4">
                    🥩 Steak Salon
                  </h3>
                  <p className="text-white/80 mb-4">
                    Mom-and-pop steakhouse with 4-course meals.
                  </p>
                  <ul className="space-y-2 text-white/70">
                    <li>• Small, intimate setting</li>
                    <li>• Semi-circle seating</li>
                    <li>• Chef in center</li>
                    <li>• More expensive but worth it</li>
                  </ul>
                </div>

                <div className="bg-gradient-to-br from-indigo-500/20 to-blue-500/20 rounded-xl p-6 border border-white/10">
                  <h3 className="text-xl font-semibold text-white mb-4">
                    🏪 Local Spots
                  </h3>
                  <p className="text-white/80 mb-4">
                    Small restaurants and window-only kitchens with amazing
                    food.
                  </p>
                  <ul className="space-y-2 text-white/70">
                    <li>• Literal window kitchens</li>
                    <li>• Some of the best food in town</li>
                    <li>• Affordable prices</li>
                    <li>• Authentic local experience</li>
                  </ul>
                </div>

                <div className="bg-gradient-to-br from-gray-600/20 to-slate-600/20 rounded-xl p-6 border border-white/10">
                  <h3 className="text-xl font-semibold text-white mb-4">
                    🇺🇸 Galaxies (On Base)
                  </h3>
                  <p className="text-white/80 mb-4">
                    American-style bar above Chili&apos;s with familiar comfort.
                  </p>
                  <ul className="space-y-2 text-white/70">
                    <li>• Cheap drinks</li>
                    <li>• Good Wi-Fi</li>
                    <li>• Slot machines</li>
                    <li>• Decent food</li>
                  </ul>
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
