// /* 'use client';
// /**
//  * =============================
//  * CIVSail Port Page Template
//  * =============================
//  * Copy this file into: app/ports/<region>/<country>/<port>/page.tsx
//  * and fill in the TODO items.
//  *
//  * What this template gives you:
//  * - Consistent layout + sections for every port
//  * - Interactive Mapbox map with clickable pins
//  * - Live weather/time (optional) and USD↔Local currency converter (optional)
//  * - Prebuilt UI for Operations, Food, Nightlife, Transportation, Safety
//  *
//  * Beginner-friendly notes:
//  * - Look for lines that start with `TODO:` — those are things you should edit.
//  * - If you don't need a feature (weather, converter, etc.), set the toggle to false in the CONFIG area.
//  * - If something breaks, open your browser console (Right click → Inspect → Console) for hints.
//  */

// // =============================
// // GLOBAL WINDOW TYPE (for popup scroll helper)
// // =============================
// declare global {
//   interface Window {
//     scrollToSection?: (sectionId: string) => void;
//   }
// }

// // =============================
// // IMPORTS
// // =============================
// import Link from 'next/link';
// import mapboxgl from 'mapbox-gl';
// import 'mapbox-gl/dist/mapbox-gl.css';
// import { useEffect, useRef, useState } from 'react';
// import {
//   ChevronRight,
//   MapPin,
//   Users,
//   Thermometer,
//   Anchor,
//   Ship,
//   Utensils,
//   Wine,
//   Car,
//   AlertTriangle,
// } from 'lucide-react';

// // =============================
// // CONFIG — TURN FEATURES ON/OFF
// // =============================
// const CONFIG = {
//   ENABLE_WEATHER_TIME: true, // set to false to hide live weather/time
//   ENABLE_CURRENCY_CONVERTER: true, // set to false to hide converter
//   DEFAULT_CURRENCY: 'JPY', // TODO: Replace with local currency code for this port (e.g., 'EUR', 'KRW')
//   LOCAL_TIMEZONE: 'Asia/Tokyo', // TODO: Replace with IANA timezone for this port
//   MAP_STYLE: 'mapbox://styles/mapbox/satellite-streets-v12',
// };

// // =============================
// // TYPES
// // =============================
// interface QuickStat {
//   icon: React.ReactNode;
//   label: string;
//   value: string;
// }

// interface Section {
//   id: string;
//   title: string;
//   icon: React.ReactNode;
// }

// // =============================
// // MAIN COMPONENT — COPY/RENAME FOR EACH PORT
// // =============================
// // export default function PortPageTemplate() {
//   // ====== STATE ======
//   const [activeSection, setActiveSection] = useState<string>('overview');
//   const [weatherData, setWeatherData] = useState<{ temp: string; time: string }>({ temp: '--', time: '--:--' });
//   const [exchangeRate, setExchangeRate] = useState<number>(0);
//   const [usdAmount, setUsdAmount] = useState<string>('');
//   const [localAmount, setLocalAmount] = useState<string>('');
//   const mapContainer = useRef<HTMLDivElement>(null);
//   const map = useRef<mapboxgl.Map | null>(null);

//   // Carousels (leave as-is, just fill the arrays below)
//   const [localSpotsIndex, setLocalSpotsIndex] = useState(0);
//   const [tasteOfHomeIndex, setTasteOfHomeIndex] = useState(0);
//   const [hangsIndex, setHangsIndex] = useState(0);
//   const [highEnergyIndex, setHighEnergyIndex] = useState(0);

//   // =============================
//   // TODO: PORT METADATA
//   // Replace all placeholder strings for each port
//   // =============================
//   const PORT = {
//     name: 'PORT NAME', // TODO: e.g., 'Sasebo'
//     regionHref: '/ports/REGION', // TODO: e.g., '/ports/far-east'
//     countryHref: '/ports/REGION/COUNTRY', // TODO: e.g., '/ports/far-east/japan'
//     countryLabel: 'COUNTRY', // TODO: e.g., 'Japan'
//     breadcrumbRegion: 'REGION', // TODO: e.g., 'Far East'
//     heroBadge: 'BADGE TEXT', // TODO: e.g., 'Naval Base • 7th Fleet Hub'
//     // Center the map on this port
//     center: [0, 0] as [number, number], // TODO: e.g., [129.7233, 33.1594]
//     defaultZoom: 13, // adjust as needed per port
//     vesselTypes: 'INSERT VESSEL TYPES HERE', // e.g., 'T-AKE, T-AO, Navy Vessels'
//     typicalStay: 'INSERT TYPICAL STAY', // e.g., '2-5 days'
//     portType: 'INSERT PORT TYPE', // e.g., 'Military • Naval Base'
//     description:
//       'INSERT PORT DESCRIPTION HERE — a short 1–2 sentence overview tailored to mariners.',
//   };

//   // =============================
//   // TODO: MAP LOCATIONS
//   // Add pins for base, landings, and notable places
//   // Use coordinates as [lng, lat]
//   // =============================
//   type LocationPin = {
//     name: string;
//     coordinates: [number, number];
//     type: 'base' | 'landing' | 'restaurant' | 'bar' | 'other';
//     description: string;
//     color: string; // hex or css color
//   };

//   const locations: LocationPin[] = [
//     // Example entries (delete or replace):
//     // {
//     //   name: 'Base Gate',
//     //   coordinates: [0, 0], // TODO: Add Base Coordinates Here
//     //   type: 'base',
//     //   description: 'Main base facility',
//     //   color: '#3b82f6',
//     // },
//     // {
//     //   name: 'Fleet Landing',
//     //   coordinates: [0, 0], // TODO: Add Landing Coordinates Here
//     //   type: 'landing',
//     //   description: 'Primary liberty launch drop-off point',
//     //   color: '#10b981',
//     // },
//     // {
//     //   name: 'Add Bar Name',
//     //   coordinates: [0, 0], // TODO: Add Bar Coordinates Here
//     //   type: 'bar',
//     //   description: 'Short description',
//     //   color: '#ef4444',
//     // },
//   ];

//   // =============================
//   // EFFECT: WEATHER + LOCAL TIME (optional)
//   // Requires env var: NEXT_PUBLIC_OPENWEATHER_API_KEY
//   // =============================
//   useEffect(() => {
//     if (!CONFIG.ENABLE_WEATHER_TIME) return;

//     const fetchWeatherAndTime = async () => {
//       try {
//         // TODO: Replace with this port's lat/lon
//         const [lng, lat] = PORT.center;
//         const weatherResponse = await fetch(
//           `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY}&units=imperial`
//         );
//         const weather = await weatherResponse.json();

//         const timeResponse = await fetch(
//           `https://worldtimeapi.org/api/timezone/${CONFIG.LOCAL_TIMEZONE}`
//         );
//         const timeData = await timeResponse.json();
//         const localTime = new Date(timeData.datetime).toLocaleTimeString('en-US', {
//           timeZone: CONFIG.LOCAL_TIMEZONE,
//           hour12: false,
//           hour: '2-digit',
//           minute: '2-digit',
//         });

//         setWeatherData({ temp: Math.round(weather.main.temp).toString(), time: localTime });
//       } catch (e) {
//         console.error('Weather/Time fetch error', e);
//       }
//     };

//     fetchWeatherAndTime();
//     const i = setInterval(fetchWeatherAndTime, 600_000); // every 10 min
//     return () => clearInterval(i);
//   }, [PORT.center]);

//   // =============================
//   // EFFECT: MAP INIT + MARKERS
//   // Requires env var: NEXT_PUBLIC_MAPBOX_TOKEN
//   // =============================
//   useEffect(() => {
//     if (map.current || !mapContainer.current) return;
//     mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';

//     map.current = new mapboxgl.Map({
//       container: mapContainer.current,
//       style: CONFIG.MAP_STYLE,
//       center: PORT.center,
//       zoom: PORT.defaultZoom,
//     });

//     locations.forEach((location) => {
//       const popupHTML = `
//         <div class="p-2">
//           <h3 class="font-semibold text-gray-900 mb-1">${location.name}</h3>
//           <p class="text-gray-600 text-sm mb-2">${location.description}</p>
//           <button
//             onclick="window.scrollToSection && window.scrollToSection('${
//               location.type === 'restaurant' || location.type === 'bar' ? 'food' : 'operations'
//             }')"
//             class="text-blue-600 hover:text-blue-800 text-sm font-medium"
//           >
//             ${location.type === 'restaurant' || location.type === 'bar' ? 'View Food Section →' : 'View Operations →'}
//           </button>
//         </div>
//       `;

//       new mapboxgl.Marker({ color: location.color, scale: 0.9 })
//         .setLngLat(location.coordinates)
//         .setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML(popupHTML))
//         .addTo(map.current!);
//     });
//   }, [locations]);

//   // Resize map when returning to Overview tab
//   useEffect(() => {
//     if (map.current && activeSection === 'overview') setTimeout(() => map.current?.resize(), 100);
//   }, [activeSection]);

//   // =============================
//   // EFFECT: CURRENCY EXCHANGE (optional)
//   // Shows USD ↔ LOCAL converter
//   // =============================
//   useEffect(() => {
//     if (!CONFIG.ENABLE_CURRENCY_CONVERTER) return;

//     const fetchExchangeRate = async () => {
//       try {
//         const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
//         const data = await response.json();
//         const rate = data.rates?.[CONFIG.DEFAULT_CURRENCY];
//         if (rate) setExchangeRate(rate);
//       } catch (e) {
//         console.error('Exchange rate fetch error', e);
//         // Fallback: reasonable default if API fails
//         setExchangeRate(130);
//       }
//     };

//     fetchExchangeRate();
//     const i = setInterval(fetchExchangeRate, 3_600_000); // every hour
//     return () => clearInterval(i);
//   }, []);

//   // ===== Converters =====
//   const convertUsdToLocal = (usd: string) => {
//     if (!usd || !exchangeRate) return '';
//     const n = parseFloat(usd);
//     if (Number.isNaN(n)) return '';
//     return (n * exchangeRate).toLocaleString('en-US', { maximumFractionDigits: 0 });
//   };
//   const convertLocalToUsd = (val: string) => {
//     if (!val || !exchangeRate) return '';
//     const n = parseFloat(val.replace(/,/g, ''));
//     if (Number.isNaN(n)) return '';
//     return (n / exchangeRate).toFixed(2);
//   };

//   // =============================
//   // QUICK STATS — edit labels/values per port
//   // =============================
//   const quickStats: QuickStat[] = [
//     { icon: <Anchor className="w-5 h-5" />, label: 'Port Type', value: PORT.portType },
//     { icon: <Ship className="w-5 h-5" />, label: 'Vessel Types', value: PORT.vesselTypes },
//     { icon: <Users className="w-5 h-5" />, label: 'Typical Stay', value: PORT.typicalStay },
//     ...(CONFIG.ENABLE_WEATHER_TIME
//       ? [{ icon: <Thermometer className="w-5 h-5" />, label: 'Weather & Time', value: `${weatherData.temp}°F • ${PORT.name} ${weatherData.time}` }]
//       : []),
//   ];

//   // =============================
//   // TODO: CONTENT ARRAYS (cards/carousels)
//   // Replace items with your local picks. You can remove/keep as many as you like.
//   // =============================
//   const localSpots = [
//     // { id: 1, name: 'INSERT NAME', type: 'Ramen Shop', description: 'INSERT DESCRIPTION', highlights: ['Example A', 'Example B'], priceRange: 'INSERT PRICE', location: 'INSERT AREA' },
//   ];

//   const tasteOfHome = [
//     // { id: 1, name: 'INSERT NAME', type: 'American Restaurant', description: 'INSERT DESCRIPTION', highlights: ['Wi-Fi', 'Large portions'], priceRange: '$$', location: 'On Base/Center' },
//   ];

//   const hangsAndDives = [
//     // { id: 1, name: 'INSERT NAME', type: 'Sailor Bar', description: 'INSERT DESCRIPTION', highlights: ['Music', 'Pool'], priceRange: '$-$$', location: 'Sailor Town' },
//   ];

//   const higherEnergy = [
//     // { id: 1, name: 'INSERT NAME', type: 'Karaoke', description: 'INSERT DESCRIPTION', highlights: ['Karaoke', 'Late night'], priceRange: '$$', location: 'Entertainment District' },
//   ];

//   // =============================
//   // SECTION NAVIGATION — don't change
//   // =============================
//   const sections: Section[] = [
//     { id: 'overview', title: 'Overview', icon: <MapPin className="w-5 h-5" /> },
//     { id: 'operations', title: 'Port Operations', icon: <Ship className="w-5 h-5" /> },
//     { id: 'food', title: 'Food & Dining', icon: <Utensils className="w-5 h-5" /> },
//     { id: 'nightlife', title: 'Bars & Nightlife', icon: <Wine className="w-5 h-5" /> },
//     { id: 'transportation', title: 'Transportation', icon: <Car className="w-5 h-5" /> },
//     { id: 'safety', title: 'Safety & Tips', icon: <AlertTriangle className="w-5 h-5" /> },
//   ];

//   // Make popup button able to switch tabs + scroll to top
//   useEffect(() => {
//     window.scrollToSection = (sectionId: string) => {
//       setActiveSection(sectionId);
//       setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 100);
//     };
//     return () => { delete window.scrollToSection; };
//   }, []);

//   // =============================
//   // RENDER
//   // =============================
//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
//       {/* ================= HERO + BREADCRUMBS ================= */}
//       <div className="relative overflow-hidden">
//         <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20" />
//         <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
//           {/* Breadcrumb */}
//           <div className="flex items-center text-white/70 text-sm mb-8">
//             <Link href="/ports" className="hover:text-white transition-colors">Ports</Link>
//             <ChevronRight className="w-4 h-4 mx-2" />
//             <Link href={PORT.regionHref} className="hover:text-white transition-colors">{PORT.breadcrumbRegion}</Link>
//             <ChevronRight className="w-4 h-4 mx-2" />
//             <Link href={PORT.countryHref} className="hover:text-white transition-colors">{PORT.countryLabel}</Link>
//             <ChevronRight className="w-4 h-4 mx-2" />
//             <span className="text-white">{PORT.name}</span>
//           </div>

//           <div className="grid lg:grid-cols-2 gap-12 items-center">
//             <div>
//               <div className="inline-flex items-center bg-blue-500/20 text-blue-300 px-4 py-2 rounded-full text-sm font-medium mb-6">
//                 <Anchor className="w-4 h-4 mr-2" />
//                 {PORT.heroBadge}
//               </div>
//               <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6">{PORT.name}</h1>
//               <p className="text-xl text-white/80 leading-relaxed mb-8">{PORT.description}</p>

//               {/* Quick Stats */}
//               <div className="grid grid-cols-2 gap-4">
//                 {quickStats.map((stat, i) => (
//                   <div key={i} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4">
//                     <div className="flex items-center text-blue-300 mb-2">{stat.icon}<span className="ml-2 text-sm font-medium">{stat.label}</span></div>
//                     <div className="text-white font-semibold">{stat.value}</div>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* Section Nav */}
//             <div className="lg:pl-8">
//               <div className="bg-white/5 backdrop-blur-lg border border-white/20 rounded-2xl p-6">
//                 <h3 className="text-white font-semibold mb-4 text-lg">Port Information</h3>
//                 <nav className="space-y-2">
//                   {sections.map((s) => (
//                     <button key={s.id} onClick={() => setActiveSection(s.id)}
//                       className={`w-full flex items-center p-3 rounded-xl transition-all duration-300 ${
//                         activeSection === s.id ? 'bg-blue-500/30 text-white border border-blue-400/50' : 'text-white/70 hover:text-white hover:bg-white/10'
//                       }`}>
//                       {s.icon}
//                       <span className="ml-3 font-medium">{s.title}</span>
//                       <ChevronRight className="w-4 h-4 ml-auto" />
//                     </button>
//                   ))}
//                 </nav>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* ================= CONTENT SECTIONS ================= */}
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
//         <div className="bg-white/5 backdrop-blur-lg border border-white/20 rounded-2xl p-8 lg:p-12">

//           {/* ===== OVERVIEW ===== */}
//           {activeSection === 'overview' && (
//             <div className="space-y-8">
//               <div className="flex items-center mb-8"><MapPin className="w-8 h-8 text-blue-400 mr-4" /><h2 className="text-3xl font-bold text-white">Port Overview</h2></div>

//               {/* Map */}
//               <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl p-6 border border-white/10">
//                 <h3 className="text-xl font-semibold text-white mb-4">Port Map</h3>
//                 <div ref={mapContainer} className="w-full h-64 rounded-lg" style={{ minHeight: '300px' }} />
//               </div>

//               {/* Highlights / Quick Facts */}
//               <div className="grid md:grid-cols-2 gap-8 mt-2">
//                 <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl p-6 border border-white/10">
//                   <h3 className="text-xl font-semibold text-white mb-4">Port Highlights</h3>
//                   <ul className="space-y-3 text-white/80">
//                     {/* TODO: Replace bullets with this port's highlights */}
//                     <li className="flex items-start"><div className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3" />Insert highlight #1</li>
//                     <li className="flex items-start"><div className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3" />Insert highlight #2</li>
//                     <li className="flex items-start"><div className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3" />Insert highlight #3</li>
//                   </ul>
//                 </div>
//                 <div className="bg-gradient-to-br from-green-500/20 to-teal-500/20 rounded-xl p-6 border border-white/10">
//                   <h3 className="text-xl font-semibold text-white mb-4">Quick Facts</h3>
//                   <ul className="space-y-3 text-white/80">
//                     {/* TODO: Replace bullets with this port's quick facts */}
//                     <li className="flex items-start"><div className="w-2 h-2 bg-green-400 rounded-full mt-2 mr-3" />Insert fact #1</li>
//                     <li className="flex items-start"><div className="w-2 h-2 bg-green-400 rounded-full mt-2 mr-3" />Insert fact #2</li>
//                     <li className="flex items-start"><div className="w-2 h-2 bg-green-400 rounded-full mt-2 mr-3" />Insert fact #3</li>
//                   </ul>
//                 </div>
//               </div>

//               {/* Optional: Currency Converter */}
//               {CONFIG.ENABLE_CURRENCY_CONVERTER && (
//                 <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-xl p-6 border border-white/10">
//                   <h3 className="text-xl font-semibold text-white mb-4">Currency Converter</h3>
//                   <div className="grid md:grid-cols-2 gap-6">
//                     <div>
//                       <label className="block text-white/80 text-sm font-medium mb-2">USD Amount</label>
//                       <input type="number" placeholder="100" value={usdAmount}
//                         onChange={(e) => { setUsdAmount(e.target.value); setLocalAmount(convertUsdToLocal(e.target.value)); }}
//                         className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-400" />
//                     </div>
//                     <div>
//                       <label className="block text-white/80 text-sm font-medium mb-2">{CONFIG.DEFAULT_CURRENCY} Amount</label>
//                       <input type="text" placeholder="13,000" value={localAmount}
//                         onChange={(e) => { setLocalAmount(e.target.value); setUsdAmount(convertLocalToUsd(e.target.value)); }}
//                         className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-400" />
//                     </div>
//                   </div>
//                   <div className="flex justify-between items-center mt-4">
//                     <p className="text-white/60 text-sm">Current rate: 1 USD = {exchangeRate ? `${CONFIG.DEFAULT_CURRENCY} ${exchangeRate.toFixed(2)}` : '…'}</p>
//                     <p className="text-white/60 text-sm">Rates update hourly</p>
//                   </div>
//                 </div>
//               )}

//               {/* Optional: Know Before You Go */}
//               <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl p-6 border border-white/10">
//                 <h3 className="text-xl font-semibold text-white mb-6">Know Before You Go</h3>
//                 <div className="grid md:grid-cols-2 gap-8">
//                   {/* TODO: Replace with local packing/weather advice */}
//                   <div>
//                     <h4 className="text-lg font-semibold text-white mb-4">Weather & What to Pack</h4>
//                     <div className="space-y-3 text-white/80">
//                       <div className="bg-white/10 rounded-lg p-4"><h5 className="font-medium text-white mb-2">Season A</h5><p className="text-sm">Insert advice for Season A.</p></div>
//                       <div className="bg-white/10 rounded-lg p-4"><h5 className="font-medium text-white mb-2">Season B</h5><p className="text-sm">Insert advice for Season B.</p></div>
//                       <div className="bg-white/10 rounded-lg p-4"><h5 className="font-medium text-white mb-2">Season C</h5><p className="text-sm">Insert advice for Season C.</p></div>
//                     </div>
//                   </div>

//                   {/* TODO: Update or remove eSIM card */}
//                   <div>
//                     <h4 className="text-lg font-semibold text-white mb-4">Stay Connected</h4>
//                     <div className="bg-white/10 rounded-lg p-4 mb-4">
//                       <p className="text-white/80 text-sm mb-4">Optional blurb about connectivity (eSIM/Wi‑Fi).</p>
//                       <a href="https://airalo.pxf.io/zxkLzG" target="_blank" rel="noopener noreferrer" className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">Get Local eSIM →</a>
//                     </div>
//                     <div className="space-y-2">
//                       <h5 className="font-medium text-white">Recommended Plans:</h5>
//                       <ul className="space-y-2 text-sm text-white/70">
//                         <li>• Plan A</li>
//                         <li>• Plan B</li>
//                         <li>• Plan C</li>
//                       </ul>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* ===== OPERATIONS ===== */}
//           {activeSection === 'operations' && (
//             <div className="space-y-8">
//               <div className="flex items-center mb-8"><Ship className="w-8 h-8 text-blue-400 mr-4" /><h2 className="text-3xl font-bold text-white">Port Operations</h2></div>

//               {/* TODO: Replace with port-specific operations notes */}
//               <div className="bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-xl p-6 border border-white/10">
//                 <h3 className="text-xl font-semibold text-white mb-4">Typical Operations</h3>
//                 <p className="text-white/80 mb-4">Insert a short paragraph summarizing operations at this port.</p>
//                 <div className="grid md:grid-cols-2 gap-6">
//                   <div>
//                     <h4 className="font-semibold text-white mb-3">Primary Functions</h4>
//                     <ul className="space-y-2 text-white/70">
//                       <li>• Function 1</li>
//                       <li>• Function 2</li>
//                       <li>• Function 3</li>
//                     </ul>
//                   </div>
//                   <div>
//                     <h4 className="font-semibold text-white mb-3">Operation Notes</h4>
//                     <ul className="space-y-2 text-white/70">
//                       <li>• Note 1</li>
//                       <li>• Note 2</li>
//                       <li>• Note 3</li>
//                     </ul>
//                   </div>
//                 </div>
//               </div>

//               {/* TODO: Replace with actual anchoring/pier/landing details */}
//               <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl p-6 border border-white/10">
//                 <h3 className="text-xl font-semibold text-white mb-4">Pier & Anchoring</h3>
//                 <div className="space-y-6">
//                   <div className="bg-white/10 rounded-lg p-4">
//                     <h4 className="font-semibold text-white mb-3">Anchoring Areas</h4>
//                     <p className="text-white/80 mb-3">Insert anchoring overview.</p>
//                     <div className="grid md:grid-cols-2 gap-4">
//                       <div>
//                         <h5 className="font-medium text-white mb-2">Anchor Details</h5>
//                         <ul className="space-y-1 text-white/70 text-sm">
//                           <li>• Detail A</li>
//                           <li>• Detail B</li>
//                           <li>• Detail C</li>
//                         </ul>
//                       </div>
//                       <div>
//                         <h5 className="font-medium text-white mb-2">Launch Operations</h5>
//                         <ul className="space-y-1 text-white/70 text-sm">
//                           <li>• Launch note A</li>
//                           <li>• Launch note B</li>
//                           <li>• Launch note C</li>
//                         </ul>
//                       </div>
//                     </div>
//                   </div>

//                   <div className="bg-white/10 rounded-lg p-4">
//                     <h4 className="font-semibold text-white mb-3">Pier Facilities</h4>
//                     <div className="grid md:grid-cols-2 gap-4">
//                       <div className="border-l-4 border-blue-400 pl-4">
//                         <h5 className="font-semibold text-white mb-2">Fuel Pier</h5>
//                         <p className="text-white/70 text-sm mb-2">Insert fuel pier details.</p>
//                         <ul className="space-y-1 text-white/60 text-xs">
//                           <li>• Capability A</li>
//                           <li>• Capability B</li>
//                           <li>• Capability C</li>
//                         </ul>
//                       </div>
//                       <div className="border-l-4 border-green-400 pl-4">
//                         <h5 className="font-semibold text-white mb-2">Cargo Areas</h5>
//                         <p className="text-white/70 text-sm mb-2">Insert cargo area details.</p>
//                         <ul className="space-y-1 text-white/60 text-xs">
//                           <li>• Capability A</li>
//                           <li>• Capability B</li>
//                           <li>• Capability C</li>
//                         </ul>
//                       </div>
//                     </div>
//                   </div>

//                   <div className="bg-yellow-500/20 rounded-lg border border-yellow-400/30 p-4">
//                     <h4 className="font-semibold text-yellow-300 mb-3">Liberty Drop-off Points</h4>
//                     <div className="grid md:grid-cols-2 gap-4">
//                       <div className="border-l-4 border-blue-400 pl-4">
//                         <h5 className="font-semibold text-white mb-2">Fleet Landing</h5>
//                         <p className="text-white/70 text-sm">Insert fleet landing notes.</p>
//                       </div>
//                       <div className="border-l-4 border-green-400 pl-4">
//                         <h5 className="font-semibold text-white mb-2">Flag Landing</h5>
//                         <p className="text-white/70 text-sm">Insert flag landing notes.</p>
//                       </div>
//                     </div>
//                     <div className="mt-4 p-3 bg-red-500/20 rounded-lg border border-red-400/30">
//                       <p className="text-red-300 text-sm font-medium">Important: Insert any critical launch schedule reminder here.</p>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* ===== FOOD ===== */}
//           {activeSection === 'food' && (
//             <div className="space-y-8">
//               <div className="flex items-center mb-8"><Utensils className="w-8 h-8 text-blue-400 mr-4" /><h2 className="text-3xl font-bold text-white">Food & Dining</h2></div>

//               {/* Local Food */}
//               <div className="bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-xl p-6 border border-white/10">
//                 <h3 className="text-xl font-semibold text-white mb-4">Local Food & Drink</h3>
//                 <p className="text-lg text-white/80 leading-relaxed mb-6">Insert a short description of the local food scene.</p>
//                 {/* TODO: Replace bullets */}
//                 <div className="grid md:grid-cols-2 gap-6">
//                   <div className="bg-white/10 rounded-lg p-4">
//                     <h4 className="font-semibold text-white mb-3">Must-Try Local Specialties</h4>
//                     <ul className="space-y-2 text-white/80">
//                       <li className="flex items-start"><div className="w-2 h-2 bg-red-400 rounded-full mt-2 mr-3" />Specialty A</li>
//                       <li className="flex items-start"><div className="w-2 h-2 bg-red-400 rounded-full mt-2 mr-3" />Specialty B</li>
//                       <li className="flex items-start"><div className="w-2 h-2 bg-red-400 rounded-full mt-2 mr-3" />Specialty C</li>
//                     </ul>
//                   </div>
//                   <div className="bg-white/10 rounded-lg p-4">
//                     <h4 className="font-semibold text-white mb-3">Local Drinks to Try</h4>
//                     <ul className="space-y-2 text-white/80">
//                       <li className="flex items-start"><div className="w-2 h-2 bg-orange-400 rounded-full mt-2 mr-3" />Drink A</li>
//                       <li className="flex items-start"><div className="w-2 h-2 bg-orange-400 rounded-full mt-2 mr-3" />Drink B</li>
//                       <li className="flex items-start"><div className="w-2 h-2 bg-orange-400 rounded-full mt-2 mr-3" />Drink C</li>
//                     </ul>
//                   </div>
//                 </div>
//               </div>

//               {/* Local Spots Carousel */}
//               <Carousel title="Local Spots" items={localSpots} index={localSpotsIndex} setIndex={setLocalSpotsIndex} badgeClass="bg-blue-500/30 text-blue-200" dotActiveClass="bg-blue-400" />

//               {/* Taste of Home Carousel */}
//               <Carousel title="A Taste of Home" items={tasteOfHome} index={tasteOfHomeIndex} setIndex={setTasteOfHomeIndex} badgeClass="bg-green-500/30 text-green-200" dotActiveClass="bg-green-400" />
//             </div>
//           )}

//           {/* ===== NIGHTLIFE ===== */}
//           {activeSection === 'nightlife' && (
//             <div className="space-y-8">
//               <div className="flex items-center mb-8"><Wine className="w-8 h-8 text-blue-400 mr-4" /><h2 className="text-3xl font-bold text-white">Bars & Nightlife</h2></div>

//               {/* TODO: Replace key points */}
//               <div className="bg-gradient-to-br from-red-500/20 to-orange-500/20 rounded-xl p-6 border border-white/10">
//                 <h3 className="text-xl font-semibold text-white mb-4">Key Points</h3>
//                 <div className="grid md:grid-cols-2 gap-6">
//                   <div className="bg-white/10 rounded-lg p-4">
//                     <h4 className="font-semibold text-white mb-3">Essential Reminders</h4>
//                     <ul className="space-y-2 text-white/80">
//                       <li>• Reminder A</li>
//                       <li>• Reminder B</li>
//                       <li>• Reminder C</li>
//                     </ul>
//                   </div>
//                   <div className="bg-white/10 rounded-lg p-4">
//                     <h4 className="font-semibold text-white mb-3">Local Etiquette & Tips</h4>
//                     <ul className="space-y-2 text-white/80">
//                       <li>• Tip A</li>
//                       <li>• Tip B</li>
//                       <li>• Tip C</li>
//                     </ul>
//                   </div>
//                 </div>
//               </div>

//               {/* Hangs and Dives */}
//               <Carousel title="Hangs and Dives" items={hangsAndDives} index={hangsIndex} setIndex={setHangsIndex} badgeClass="bg-amber-500/30 text-amber-200" dotActiveClass="bg-amber-400" />

//               {/* Higher Energy */}
//               <Carousel title="Higher Energy" items={higherEnergy} index={highEnergyIndex} setIndex={setHighEnergyIndex} badgeClass="bg-purple-500/30 text-purple-200" dotActiveClass="bg-purple-400" />
//             </div>
//           )}

//           {/* ===== TRANSPORTATION ===== */}
//           {activeSection === 'transportation' && (
//             <div className="space-y-8">
//               <div className="flex items-center mb-8"><Car className="w-8 h-8 text-blue-400 mr-4" /><h2 className="text-3xl font-bold text-white">Transportation</h2></div>

//               {/* TODO: Replace details for launches / pier-side / taxis / buses / trains */}
//               <div className="bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-xl p-6 border border-white/10">
//                 <h3 className="text-xl font-semibold text-white mb-4">🚤 To Town from Berth</h3>
//                 <div className="grid md:grid-cols-2 gap-6">
//                   <div className="bg-white/10 rounded-lg p-4">
//                     <h4 className="font-semibold text-white mb-3">Liberty Launches</h4>
//                     <ul className="space-y-2 text-white/70 text-sm">
//                       <li>• Operating Hours: INSERT</li>
//                       <li>• Transit Time: INSERT</li>
//                       <li>• Drop-off Points: INSERT</li>
//                     </ul>
//                   </div>
//                   <div className="bg-white/10 rounded-lg p-4">
//                     <h4 className="font-semibold text-white mb-3">Pier-Side Access</h4>
//                     <ul className="space-y-2 text-white/70 text-sm">
//                       <li>• Walking Distance: INSERT</li>
//                       <li>• Base Facilities: INSERT</li>
//                       <li>• Town Access: INSERT</li>
//                     </ul>
//                   </div>
//                 </div>
//                 <div className="mt-6 p-4 bg-red-500/20 rounded-lg border border-red-400/30">
//                   <h4 className="font-semibold text-red-300 mb-2">⚠️ Critical Reminder</h4>
//                   <p className="text-white/80 text-sm">Insert an important transportation warning/tip.</p>
//                 </div>
//               </div>

//               {/* TODO: Around Town (walking, taxis, buses) */}
//               <div className="bg-gradient-to-br from-green-500/20 to-teal-500/20 rounded-xl p-6 border border-white/10">
//                 <h3 className="text-xl font-semibold text-white mb-4">🚗 Around Town</h3>
//                 <div className="grid md:grid-cols-2 gap-6">
//                   <div className="bg-white/10 rounded-lg p-4">
//                     <h4 className="font-semibold text-white mb-3">Walking</h4>
//                     <ul className="space-y-2 text-white/70 text-sm">
//                       <li>• Area A</li>
//                       <li>• Area B</li>
//                     </ul>
//                   </div>
//                   <div className="bg-white/10 rounded-lg p-4">
//                     <h4 className="font-semibold text-white mb-3">Taxis & Ride Services</h4>
//                     <ul className="space-y-2 text-white/70 text-sm">
//                       <li>• Uber/Local Apps</li>
//                       <li>• Cost Range</li>
//                       <li>• Payment Notes</li>
//                     </ul>
//                   </div>
//                 </div>
//                 <div className="bg-white/10 rounded-lg p-4 mt-4">
//                   <h4 className="font-semibold text-white mb-3">🚌 Public Transportation</h4>
//                   <div className="grid md:grid-cols-2 gap-4">
//                     <div>
//                       <h5 className="font-medium text-white mb-2">Local Buses</h5>
//                       <ul className="space-y-1 text-white/70 text-xs">
//                         <li>• Notes</li>
//                       </ul>
//                     </div>
//                     <div>
//                       <h5 className="font-medium text-white mb-2">Base Shuttle</h5>
//                       <ul className="space-y-1 text-white/70 text-xs">
//                         <li>• Notes</li>
//                       </ul>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* TODO: Regional Travel & Airports */}
//               <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl p-6 border border-white/10">
//                 <h3 className="text-xl font-semibold text-white mb-4">🚆 Regional Travel</h3>
//                 <p className="text-white/80 mb-6">Insert regional travel overview (nearby cities/attractions).</p>
//                 <div className="grid md:grid-cols-2 gap-6">
//                   <div className="bg-white/10 rounded-lg p-4"><h4 className="font-semibold text-white mb-3">Nearby City A</h4><p className="text-white/70 text-sm">Insert travel time and highlights.</p></div>
//                   <div className="bg-white/10 rounded-lg p-4"><h4 className="font-semibold text-white mb-3">Nearby City B</h4><p className="text-white/70 text-sm">Insert travel time and highlights.</p></div>
//                 </div>
//               </div>

//               <div className="bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-xl p-6 border border-white/10">
//                 <h3 className="text-xl font-semibold text-white mb-4">✈️ Local Airports</h3>
//                 <div className="grid md:grid-cols-2 gap-6">
//                   <div className="bg-white/10 rounded-lg p-4">
//                     <h4 className="font-semibold text-white mb-3">Primary International Gateway</h4>
//                     <ul className="space-y-1 text-white/70 text-sm">
//                       <li>• Distance: INSERT</li>
//                       <li>• By Train: INSERT</li>
//                       <li>• By Bus: INSERT</li>
//                       <li>• By Taxi: INSERT</li>
//                     </ul>
//                   </div>
//                   <div className="bg-white/10 rounded-lg p-4">
//                     <h4 className="font-semibold text-white mb-3">Crew Change Logistics</h4>
//                     <ul className="space-y-1 text-white/70 text-sm">
//                       <li>• Advance Booking: INSERT</li>
//                       <li>• Best Option: INSERT</li>
//                       <li>• Luggage Notes: INSERT</li>
//                     </ul>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* ===== SAFETY ===== */}
// {activeSection === 'safety' && (
//   <div className="space-y-8">
//     <div className="flex items-center mb-8">
//       <AlertTriangle className="w-8 h-8 text-blue-400 mr-4" />
//       <h2 className="text-3xl font-bold text-white">Safety & Tips</h2>
//     </div>

//     {/* TODO: Replace with common incidents + cultural tips */}
//     <div className="bg-gradient-to-br from-red-500/20 to-orange-500/20 rounded-xl p-6 border border-white/10">
//       <h3 className="text-xl font-semibold text-white mb-4">
//         ⚠️ How People Get in Trouble
//       </h3>
//       <p className="text-white/80 mb-6">
//         Insert an intro sentence here (e.g., “These are the most common liberty
//         incidents at this port that can ruin your visit or career.”).
//       </p>

//       <div className="grid md:grid-cols-2 gap-6">
//         <div className="space-y-4">
//           <div className="bg-white/10 rounded-lg p-4">
//             <h4 className="font-semibold text-red-300 mb-3">Issue A</h4>
//             <p className="text-white/80 text-sm mb-2">Insert details/tips.</p>
//             <ul className="space-y-1 text-white/70 text-xs">
//               <li>• Sub-point 1</li>
//               <li>• Sub-point 2</li>
//               <li>• Sub-point 3</li>
//             </ul>
//           </div>

//           <div className="bg-white/10 rounded-lg p-4">
//             <h4 className="font-semibold text-red-300 mb-3">Issue B</h4>
//             <p className="text-white/80 text-sm mb-2">Insert details/tips.</p>
//             <ul className="space-y-1 text-white/70 text-xs">
//               <li>• Sub-point 1</li>
//               <li>• Sub-point 2</li>
//               <li>• Sub-point 3</li>
//             </ul>
//           </div>
//         </div>

//         <div className="space-y-4">
//           <div className="bg-white/10 rounded-lg p-4">
//             <h4 className="font-semibold text-red-300 mb-3">Issue C</h4>
//             <p className="text-white/80 text-sm mb-2">Insert details/tips.</p>
//             <ul className="space-y-1 text-white/70 text-xs">
//               <li>• Sub-point 1</li>
//               <li>• Sub-point 2</li>
//               <li>• Sub-point 3</li>
//             </ul>
//           </div>

//           <div className="bg-white/10 rounded-lg p-4">
//             <h4 className="font-semibold text-red-300 mb-3">Issue D</h4>
//             <p className="text-white/80 text-sm mb-2">Insert details/tips.</p>
//             <ul className="space-y-1 text-white/70 text-xs">
//               <li>• Sub-point 1</li>
//               <li>• Sub-point 2</li>
//               <li>• Sub-point 3</li>
//             </ul>
//           </div>
//         </div>
//       </div>
//     </div>

//     {/* Critical Reminders */}
//     <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-xl p-6 border border-white/10">
//       <h3 className="text-xl font-semibold text-white mb-4">
//         🛡️ Critical Reminders
//       </h3>
//       <p className="text-white/80 mb-6">
//         Insert an intro sentence here (e.g., “Follow these to stay safe and
//         avoid career-ending incidents.”).
//       </p>

//       <div className="grid md:grid-cols-3 gap-6">
//         <div className="bg-white/10 rounded-lg p-4">
//           <h4 className="font-semibold text-yellow-300 mb-3">
//             🕒 Time Management
//           </h4>
//           <ul className="space-y-2 text-white/80 text-sm">
//             <li>• Insert tip</li>
//             <li>• Insert tip</li>
//             <li>• Insert tip</li>
//           </ul>
//         </div>

//         <div className="bg-white/10 rounded-lg p-4">
//           <h4 className="font-semibold text-yellow-300 mb-3">
//             💰 Money Safety
//           </h4>
//           <ul className="space-y-2 text-white/80 text-sm">
//             <li>• Insert tip</li>
//             <li>• Insert tip</li>
//             <li>• Insert tip</li>
//           </ul>
//         </div>

//         <div className="bg-white/10 rounded-lg p-4">
//           <h4 className="font-semibold text-yellow-300 mb-3">
//             🤝 Cultural Respect
//           </h4>
//           <ul className="space-y-2 text-white/80 text-sm">
//             <li>• Insert tip</li>
//             <li>• Insert tip</li>
//             <li>• Insert tip</li>
//           </ul>
//         </div>
//       </div>

//       {/* TODO: Replace contact numbers/addresses */}
//       <div className="mt-6 grid md:grid-cols-2 gap-6">
//         <div className="bg-blue-500/20 rounded-lg border border-blue-400/30 p-4">
//           <h4 className="font-semibold text-blue-300 mb-3">
//             📱 Communication & Documentation
//           </h4>
//           <ul className="space-y-2 text-white/80 text-sm">
//             <li>• Insert tip</li>
//           </ul>
//         </div>

//         <div className="bg-purple-500/20 rounded-lg border border-purple-400/30 p-4">
//           <h4 className="font-semibold text-purple-300 mb-3">
//             🌡️ Weather & Health
//           </h4>
//           <ul className="space-y-2 text-white/80 text-sm">
//             <li>• Insert tip</li>
//           </ul>
//         </div>
//       </div>
//     </div>

//     {/* Key Contacts */}
//     <div className="bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-xl p-6 border border-white/10">
//       <h3 className="text-xl font-semibold text-white mb-4">📞 Key Contacts</h3>
//       <p className="text-white/80 mb-6">
//         Insert guidance text here (e.g., “Save these numbers before going on
//         liberty.”).
//       </p>

//       <div className="grid md:grid-cols-2 gap-6">
//         <div className="space-y-4">
//           <div className="bg-white/10 rounded-lg p-4">
//             <h4 className="font-semibold text-blue-300 mb-3">
//               🚨 Emergency Numbers
//             </h4>
//             <div className="space-y-2">
//               <div className="flex justify-between items-center p-2 bg-red-500/20 rounded border border-red-400/30">
//                 <span className="text-white font-medium">Police</span>
//                 <span className="text-red-300 font-bold text-lg">INSERT</span>
//               </div>
//               <div className="flex justify-between items-center p-2 bg-red-500/20 rounded border border-red-400/30">
//                 <span className="text-white font-medium">Fire/Ambulance</span>
//                 <span className="text-red-300 font-bold text-lg">INSERT</span>
//               </div>
//             </div>
//           </div>

//           <div className="bg-white/10 rounded-lg p-4">
//             <h4 className="font-semibold text-blue-300 mb-3">
//               🇺🇸 U.S. Embassy / Consulate
//             </h4>
//             <div className="space-y-2 text-white/80 text-sm">
//               <div>
//                 <strong>Nearest U.S. Consulate</strong>
//                 <p className="text-white/70">INSERT ADDRESS</p>
//                 <p className="text-blue-300">INSERT PHONE</p>
//               </div>
//               <div className="mt-3">
//                 <strong>U.S. Embassy (24/7)</strong>
//                 <p className="text-blue-300">INSERT PHONE</p>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="space-y-4">
//           <div className="bg-white/10 rounded-lg p-4">
//             <h4 className="font-semibold text-blue-300 mb-3">
//               🏥 Medical Facilities
//             </h4>
//             <div className="space-y-3 text-white/80 text-sm">
//               <div>
//                 <strong>On-Base Medical</strong>
//                 <p className="text-white/70">INSERT</p>
//               </div>
//               <div>
//                 <strong>Nearest Hospital</strong>
//                 <p className="text-white/70">INSERT</p>
//               </div>
//             </div>
//           </div>

//           <div className="bg-white/10 rounded-lg p-4">
//             <h4 className="font-semibold text-blue-300 mb-3">
//               🚢 Ship & Base Contacts
//             </h4>
//             <div className="space-y-2 text-white/80 text-sm">
//               <div className="p-2 bg-yellow-500/20 rounded border border-yellow-400/30">
//                 <strong className="text-yellow-300">Your Ship:</strong>
//                 <p className="text-white/70">Insert emergency contact routine.</p>
//               </div>
//               <div>
//                 <strong>Base Information:</strong>
//                 <p className="text-white/70">INSERT</p>
//               </div>
//               <div>
//                 <strong>Shore Patrol:</strong>
//                 <p className="text-white/70">INSERT</p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   </div>
// )}

// {/* ================= FOOTER ================= */}
// <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//   <div className="text-center text-white/60">
//     <p className="mb-2">
//       Information compiled from sailor experiences and port visits
//     </p>
//     <p className="text-sm">
//       Always verify current information with your ship&apos;s port brief
//     </p>
//     {/* TODO: Add any port-specific disclaimer if needed */}
//   </div>
// </div>
// </div>
