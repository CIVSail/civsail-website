'use client';

import { useState } from 'react';

export default function Maritime101Page() {
  const [activeSection, setActiveSection] = useState('introduction');

  const sections = [
    { id: 'introduction', title: 'What is the Merchant Marine?', icon: '🚢' },
    { id: 'history', title: 'Maritime History', icon: '📜' },
    { id: 'vessels', title: 'Major Players', icon: '🏢' },
    { id: 'careers', title: 'Career Paths', icon: '👨‍✈️' },
    { id: 'getting-started', title: 'Getting Started', icon: '🎯' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-900 via-slate-800 to-blue-800 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-serif font-bold mb-6">
              Maritime 101
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 leading-relaxed">
              Your comprehensive guide to understanding the Merchant Marine, its
              history, and career opportunities
            </p>
            <div className="flex items-center justify-center space-x-4 text-sm text-blue-200">
              <span>📖 Complete Guide</span>
              <span>•</span>
              <span>⏱️ 15 min read</span>
              <span>•</span>
              <span>🎓 Beginner Friendly</span>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-24">
              <h3 className="font-semibold text-gray-900 mb-4">
                Table of Contents
              </h3>
              <nav className="space-y-2">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full text-left px-3 py-2 rounded-md transition-colors flex items-center space-x-2 ${
                      activeSection === section.id
                        ? 'bg-blue-100 text-blue-700 font-medium'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <span>{section.icon}</span>
                    <span className="text-sm">{section.title}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            <div className="bg-white rounded-lg shadow-lg">
              {/* Introduction Section */}
              {activeSection === 'introduction' && (
                <div className="p-8">
                  <div className="flex items-center space-x-3 mb-6">
                    <span className="text-3xl">🚢</span>
                    <h2 className="text-3xl font-bold text-gray-900">
                      What is the Merchant Marine?
                    </h2>
                  </div>

                  <div className="prose prose-lg max-w-none">
                    <p className="text-lg text-gray-700 leading-relaxed mb-6">
                      The United States Merchant Marine is the fleet of
                      civilian-owned commercial vessels that operates under the
                      U.S. flag and serves both commercial and national defense
                      purposes. These ships and their crews form the backbone of
                      American maritime commerce and serve as a vital component
                      of national security.
                    </p>

                    <div className="bg-blue-50 border-l-4 border-blue-500 p-6 mb-8">
                      <h3 className="text-xl font-semibold text-blue-900 mb-3">
                        Key Functions
                      </h3>
                      <ul className="space-y-2 text-blue-800">
                        <li>
                          • <strong>Commercial Trade:</strong> Moving 90% of the
                          world's goods by sea
                        </li>
                        <li>
                          • <strong>National Defense:</strong> Supporting
                          military operations worldwide
                        </li>
                        <li>
                          • <strong>Emergency Response:</strong> Disaster relief
                          and humanitarian missions
                        </li>
                        <li>
                          • <strong>Economic Impact:</strong> Billions in
                          economic activity annually
                        </li>
                      </ul>
                    </div>

                    <p className="text-lg text-gray-700 leading-relaxed mb-6">
                      Just as an everyday person needs supplies, so does the
                      military. Unless the war is fought at home, which hasn't
                      been the case for the United States, soldiers need food,
                      clothes, ammunition, and equipment in theater. It's tough
                      to fight a war without necessary supplies, and the most
                      efficient way to get armored vehicles, tanks, and critical
                      cargo into a war zone is by sea.
                    </p>

                    <div className="grid md:grid-cols-2 gap-6 mt-8">
                      <div className="bg-gray-50 p-6 rounded-lg">
                        <h4 className="text-lg font-semibold text-gray-900 mb-3">
                          Military Sealift Command (MSC)
                        </h4>
                        <p className="text-gray-700">
                          Operates under the U.S. Navy, providing ocean
                          transportation for Department of Defense cargo and
                          personnel.
                        </p>
                      </div>
                      <div className="bg-gray-50 p-6 rounded-lg">
                        <h4 className="text-lg font-semibold text-gray-900 mb-3">
                          Commercial Fleet
                        </h4>
                        <p className="text-gray-700">
                          Privately-owned vessels that carry commercial cargo
                          and can be activated for national defense when needed.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* History Section */}
              {activeSection === 'history' && (
                <div className="p-8">
                  <div className="flex items-center space-x-3 mb-6">
                    <span className="text-3xl">📜</span>
                    <h2 className="text-3xl font-bold text-gray-900">
                      Maritime History
                    </h2>
                  </div>

                  <div className="prose prose-lg max-w-none">
                    <p className="text-lg text-gray-700 leading-relaxed mb-6">
                      With 71% of Earth's surface covered by water, it's no
                      surprise that humanity boasts a rich history of seafaring.
                      From ancient trade routes to naval dominance, maritime
                      activities have been pivotal in shaping civilizations and
                      the fortunes of empires throughout history.
                    </p>

                    <p className="text-lg text-gray-700 leading-relaxed mb-6">
                      Though modern shipping has evolved drastically from its
                      early days, mariners today are part of a profession
                      steeped in thousands of years of tradition. Maritime
                      history is rich and influential, yet it's often overlooked
                      by the general public because mariners are frequently out
                      at sea, far from everyday life.
                    </p>

                    <div className="bg-blue-50 border-l-4 border-blue-500 p-6 mb-8">
                      <p className="text-blue-900 italic">
                        "Yes, I am a pirate, two hundred years too late. The
                        cannons don't thunder, there's nothin' to plunder. I'm
                        an over-forty victim of fate. Arriving too late,
                        arriving too late"
                      </p>
                      <p className="text-sm text-blue-700 mt-2">
                        — Jimmy Buffett, "A Pirate Looks at Forty"
                      </p>
                    </div>

                    <p className="text-lg text-gray-700 leading-relaxed mb-8">
                      While today's shipping industry doesn't resemble Captain
                      Jack Sparrow dodging cannonballs, the spirit of adventure
                      still drives many to take to the seas in search of
                      excitement and financial reward. Despite technological
                      advances, the ocean remains a powerful and awe-inspiring
                      force, offering an unparalleled sense of adventure.
                    </p>

                    {/* Timeline */}
                    <div className="space-y-8">
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0 w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center">
                          <span className="text-2xl">🛶</span>
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            8040-7510 BC - The First Boat
                          </h3>
                          <p className="text-gray-700 leading-relaxed">
                            The Pesse Canoe, discovered in the Netherlands, is
                            the world's oldest known boat. Made from a single
                            pine log and measuring about 10 feet long, this
                            primitive vessel marks the beginning of humanity's
                            rich seafaring history.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0 w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
                          <span className="text-2xl">⛵</span>
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            1492 - Columbus Sailed the Ocean Blue
                          </h3>
                          <p className="text-gray-700 leading-relaxed">
                            Christopher Columbus set sail from Spain with three
                            ships—the Niña, the Pinta, and the Santa
                            María—aiming to find a westward route to Asia. His
                            expedition reached the Bahamas and began European
                            exploration and colonization of the Americas.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0 w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center">
                          <span className="text-2xl">🌍</span>
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            1519-1522 - First Circumnavigation
                          </h3>
                          <p className="text-gray-700 leading-relaxed">
                            Ferdinand Magellan began and Juan Sebastián Elcano
                            completed the first circumnavigation of the globe.
                            This monumental voyage proved the world was round
                            and vastly larger than previously thought,
                            establishing critical trade routes.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0 w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-2xl">⚔️</span>
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            1775 - Privateers and the American Revolution
                          </h3>
                          <p className="text-gray-700 leading-relaxed">
                            With no navy to face the world's most powerful naval
                            force, the Continental Congress authorized
                            privateers to attack British vessels. These private
                            mariners captured hundreds of British ships,
                            contributing significantly to American victory and
                            laying the foundation for the American Merchant
                            Marine.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0 w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                          <span className="text-2xl">⚓</span>
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            1799 - First Underway Replenishment
                          </h3>
                          <p className="text-gray-700 leading-relaxed">
                            Captain Silas Talbot conducted the first underway
                            replenishment aboard the USS Constitution, using
                            small boats to resupply the vessel. This innovation
                            allowed the ship to stay at sea for almost a year,
                            establishing a vital aspect of naval power
                            projection that continues today.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0 w-20 h-20 bg-cyan-100 rounded-full flex items-center justify-center">
                          <span className="text-2xl">🌊</span>
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            1869 - Suez Canal Opens
                          </h3>
                          <p className="text-gray-700 leading-relaxed">
                            Engineered by Ferdinand de Lesseps, the Suez Canal
                            linked the Mediterranean Sea to the Red Sea,
                            drastically shortening the maritime route between
                            Europe and Asia. This strategic waterway became
                            vital for international trade and remains one of the
                            world's most important shipping routes.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0 w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center">
                          <span className="text-2xl">⚠️</span>
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            1956-1975 - The Suez Crisis
                          </h3>
                          <p className="text-gray-700 leading-relaxed">
                            In 1956, the canal was nationalized by Egypt,
                            leading to the Suez Crisis. Later it was closed from
                            1967 to 1975 due to the Six-Day War and subsequent
                            Arab-Israeli conflict. Its closure highlighted its
                            critical importance, as ships had to navigate around
                            the southern tip of Africa, incurring higher costs
                            and longer travel times.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0 w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center">
                          <span className="text-2xl">🚢</span>
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            1914 - Panama Canal Opens
                          </h3>
                          <p className="text-gray-700 leading-relaxed">
                            Completed under President Theodore Roosevelt's
                            leadership, the Panama Canal created a critical
                            shortcut between the Atlantic and Pacific Oceans.
                            Ships could now bypass the lengthy Cape Horn route,
                            significantly reducing travel time and costs for
                            global trade.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0 w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center">
                          <span className="text-2xl">🇺🇸</span>
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            1920 - The Jones Act
                          </h3>
                          <p className="text-gray-700 leading-relaxed">
                            The Merchant Marine Act of 1920 requires goods
                            transported between U.S. ports be carried on ships
                            built, owned, and operated by American citizens.
                            This law supports the U.S. maritime industry and
                            provides protections for American seamen, including
                            compensation for injuries at sea.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0 w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
                          <span className="text-2xl">⚔️</span>
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            1939-1945 - Merchant Marines in WWII
                          </h3>
                          <p className="text-gray-700 leading-relaxed">
                            American Merchant Mariners transported troops and
                            supplies across dangerous waters under constant
                            threat. Over 1,500 merchant ships were sunk and
                            nearly 9,500 seamen lost their lives. Congress
                            granted veteran status to WWII merchant mariners in
                            1988, finally recognizing their vital contribution
                            to the war effort.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0 w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                          <span className="text-2xl">📦</span>
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            1956 - Malcolm McLean and the Shipping Container
                          </h3>
                          <p className="text-gray-700 leading-relaxed">
                            Malcolm McLean revolutionized global shipping with
                            standardized, intermodal containers that could
                            transfer between ships, trucks, and trains. This
                            innovation dramatically improved cargo handling
                            efficiency, reduced costs, and became a cornerstone
                            of modern trade infrastructure.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0 w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center">
                          <span className="text-2xl">🚢</span>
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            2016 - Panama Canal Expansion
                          </h3>
                          <p className="text-gray-700 leading-relaxed">
                            The Third Set of Locks expansion enabled passage of
                            "New Panamax" vessels carrying up to 14,000 TEUs,
                            compared to the previous 5,000 TEU limit. This
                            expansion accommodated larger, more efficient ships
                            and influenced port infrastructure worldwide.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0 w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
                          <span className="text-2xl">🦠</span>
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            2020 - COVID-19 Pandemic
                          </h3>
                          <p className="text-gray-700 leading-relaxed">
                            Mariners faced unprecedented challenges, often
                            stranded on ships for extended periods due to travel
                            restrictions. Crew rotations were disrupted, leaving
                            seafarers stuck beyond planned contracts while
                            maintaining critical global supply chains under
                            stressful conditions.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Major Players */}
              {activeSection === 'vessels' && (
                <div className="p-8">
                  <div className="flex items-center space-x-3 mb-6">
                    <span className="text-3xl">🏢</span>
                    <h2 className="text-3xl font-bold text-gray-900">
                      Major Players
                    </h2>
                  </div>

                  <div className="space-y-10">
                    {/* Opening Statement */}
                    <div className="text-center">
                      <p className="text-xl text-gray-700 leading-relaxed max-w-4xl mx-auto">
                        The maritime industry is a{' '}
                        <strong>vast global network</strong> spanning every
                        ocean and connecting every continent. From massive
                        international shipping conglomerates to specialized
                        domestic operators, from container ships the size of
                        city blocks to nimble tugboats—the world of ocean
                        transport is far bigger and more diverse than most
                        people realize.
                      </p>
                    </div>

                    {/* Scale Statistics */}
                    <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl p-8 text-white">
                      <h3 className="text-2xl font-bold text-center mb-8">
                        The Scale of Global Maritime Transport
                      </h3>
                      <div className="grid md:grid-cols-4 gap-6 text-center">
                        <div className="bg-white/10 rounded-lg p-4">
                          <div className="text-3xl font-bold mb-2">90%</div>
                          <div className="text-sm">
                            of world trade by volume moves by sea
                          </div>
                        </div>
                        <div className="bg-white/10 rounded-lg p-4">
                          <div className="text-3xl font-bold mb-2">50,000+</div>
                          <div className="text-sm">
                            merchant vessels worldwide
                          </div>
                        </div>
                        <div className="bg-white/10 rounded-lg p-4">
                          <div className="text-3xl font-bold mb-2">1.6M+</div>
                          <div className="text-sm">
                            seafarers working globally
                          </div>
                        </div>
                        <div className="bg-white/10 rounded-lg p-4">
                          <div className="text-3xl font-bold mb-2">$14T</div>
                          <div className="text-sm">
                            in goods transported annually
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* International vs Domestic */}
                    <div className="grid lg:grid-cols-2 gap-8">
                      {/* International Sector */}
                      <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-8 border-2 border-purple-200">
                        <div className="text-center mb-6">
                          <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-3xl">🌍</span>
                          </div>
                          <h3 className="text-2xl font-bold text-purple-900">
                            International Shipping
                          </h3>
                          <p className="text-purple-700 mt-2">
                            Global trade connecting continents
                          </p>
                        </div>

                        <div className="space-y-4">
                          <div className="bg-white p-4 rounded-lg shadow-sm">
                            <h4 className="font-semibold text-purple-800 mb-3">
                              Major Global Players
                            </h4>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              {[
                                'MSC (Switzerland)',
                                'Maersk (Denmark)',
                                'CMA CGM (France)',
                                'Hapag-Lloyd (Germany)',
                                'COSCO (China)',
                                'Evergreen (Taiwan)',
                                'ONE (Japan)',
                                'Yang Ming (Taiwan)',
                                'ZIM (Israel)',
                                'Wan Hai (Taiwan)',
                              ].map((company) => (
                                <div
                                  key={company}
                                  className="bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs font-medium"
                                >
                                  {company}
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="bg-white p-4 rounded-lg shadow-sm">
                            <h4 className="font-semibold text-purple-800 mb-2">
                              What They Do
                            </h4>
                            <ul className="text-sm text-purple-700 space-y-1">
                              <li>• Move containers between countries</li>
                              <li>• Operate on fixed international routes</li>
                              <li>• Handle 90% of global trade volume</li>
                              <li>• Use vessels up to 24,000 TEU capacity</li>
                            </ul>
                          </div>
                        </div>
                      </div>

                      {/* Domestic Sector */}
                      <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-8 border-2 border-blue-200">
                        <div className="text-center mb-6">
                          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-3xl">🇺🇸</span>
                          </div>
                          <h3 className="text-2xl font-bold text-blue-900">
                            U.S. Domestic Shipping
                          </h3>
                          <p className="text-blue-700 mt-2">
                            Jones Act protected coastal trade
                          </p>
                        </div>

                        <div className="space-y-4">
                          <div className="bg-white p-4 rounded-lg shadow-sm">
                            <h4 className="font-semibold text-blue-800 mb-3">
                              Major Domestic Players
                            </h4>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              {[
                                'Matson (Hawaii)',
                                'Pasha Hawaii',
                                'TOTE (Alaska/PR)',
                                'Crowley (Caribbean)',
                                'Kirby (Inland)',
                                'ARC (Great Lakes)',
                                'CSL (Great Lakes)',
                                'Interlake Steamship',
                              ].map((company) => (
                                <div
                                  key={company}
                                  className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-medium"
                                >
                                  {company}
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="bg-white p-4 rounded-lg shadow-sm">
                            <h4 className="font-semibold text-blue-800 mb-2">
                              What They Do
                            </h4>
                            <ul className="text-sm text-blue-700 space-y-1">
                              <li>
                                • Connect U.S. mainland to Alaska, Hawaii, PR
                              </li>
                              <li>• Great Lakes bulk cargo transport</li>
                              <li>
                                • Coastal petroleum and chemical transport
                              </li>
                              <li>• Must comply with Jones Act requirements</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Government & Research */}
                    <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-6 border-2 border-red-200">
                      <div className="text-center mb-6">
                        <h3 className="text-xl font-bold text-red-900">
                          Government & Research Fleets
                        </h3>
                        <p className="text-red-700">
                          Supporting national defense and scientific research
                        </p>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-white p-4 rounded-lg shadow-sm">
                          <div className="flex items-center space-x-3 mb-3">
                            <span className="text-2xl">⚔️</span>
                            <h4 className="font-semibold text-red-800">
                              Military Sealift Command (MSC)
                            </h4>
                          </div>
                          <ul className="text-sm text-red-700 space-y-1">
                            <li>
                              • 120+ vessels supporting U.S. Navy operations
                            </li>
                            <li>
                              • T-AKE cargo ships, T-AO oilers, T-AH hospital
                              ships
                            </li>
                            <li>• CIVMAR crews (civilian mariners)</li>
                            <li>
                              • Global operations supporting military missions
                            </li>
                          </ul>
                        </div>

                        <div className="bg-white p-4 rounded-lg shadow-sm">
                          <div className="flex items-center space-x-3 mb-3">
                            <span className="text-2xl">🔬</span>
                            <h4 className="font-semibold text-red-800">
                              NOAA Research Fleet
                            </h4>
                          </div>
                          <ul className="text-sm text-red-700 space-y-1">
                            <li>• 15 research vessels studying oceans</li>
                            <li>• Weather monitoring and climate research</li>
                            <li>• Fisheries assessment and marine surveys</li>
                            <li>• University partnership vessels</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    {/* Vessel Types - Expanded Visual Grid */}
                    <div className="bg-gray-50 rounded-xl p-8">
                      <div className="text-center mb-8">
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">
                          The Incredible Diversity of Vessels
                        </h3>
                        <p className="text-lg text-gray-600">
                          Each type serves a unique purpose in the global
                          maritime ecosystem
                        </p>
                      </div>

                      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {[
                          {
                            name: 'Container Ships',
                            desc: 'Standardized boxes on liner routes',
                            icon: '📦',
                            detail: 'Up to 24,000 TEU capacity',
                            color: 'blue',
                          },
                          {
                            name: 'Oil Tankers',
                            desc: 'Crude oil and petroleum products',
                            icon: '🛢️',
                            detail: 'VLCCs carry 2M+ barrels',
                            color: 'orange',
                          },
                          {
                            name: 'Bulk Carriers',
                            desc: 'Grain, coal, ore in massive holds',
                            icon: '⚱️',
                            detail: 'Capesize ships 180,000+ DWT',
                            color: 'amber',
                          },
                          {
                            name: 'Car Carriers',
                            desc: 'Vehicles rolling on and off',
                            icon: '🚗',
                            detail: 'Hold up to 8,000 vehicles',
                            color: 'green',
                          },
                          {
                            name: 'LNG Tankers',
                            desc: 'Liquefied natural gas at -162°C',
                            icon: '❄️',
                            detail: 'Spherical tanks, specialized cargo',
                            color: 'cyan',
                          },
                          {
                            name: 'Chemical Tankers',
                            desc: 'Specialized liquid chemicals',
                            icon: '🧪',
                            detail: 'Multiple segregated cargo holds',
                            color: 'purple',
                          },
                          {
                            name: 'Cruise Ships',
                            desc: 'Floating cities for passengers',
                            icon: '🛳️',
                            detail: 'Up to 9,000 passengers',
                            color: 'pink',
                          },
                          {
                            name: 'Ferries',
                            desc: 'People and cars across water',
                            icon: '⛴️',
                            detail: 'Essential coastal transport',
                            color: 'teal',
                          },
                          {
                            name: 'Research Vessels',
                            desc: 'Scientific exploration and study',
                            icon: '🔬',
                            detail: 'Advanced laboratories at sea',
                            color: 'indigo',
                          },
                          {
                            name: 'Offshore Supply',
                            desc: 'Supporting oil rigs and platforms',
                            icon: '🏗️',
                            detail: 'Dynamic positioning systems',
                            color: 'red',
                          },
                          {
                            name: 'Cable Layers',
                            desc: 'Installing undersea internet cables',
                            icon: '🌐',
                            detail: 'Connecting the digital world',
                            color: 'emerald',
                          },
                          {
                            name: 'Tugboats',
                            desc: 'Assisting larger vessels in ports',
                            icon: '🚂',
                            detail: 'Powerful engines, small size',
                            color: 'yellow',
                          },
                        ].map((vessel) => (
                          <div
                            key={vessel.name}
                            className={`bg-${vessel.color}-50 border-2 border-${vessel.color}-200 rounded-lg p-4 text-center hover:shadow-lg transition-shadow`}
                          >
                            <div className="text-3xl mb-2">{vessel.icon}</div>
                            <h4
                              className={`text-lg font-semibold text-${vessel.color}-900 mb-1`}
                            >
                              {vessel.name}
                            </h4>
                            <p
                              className={`text-sm text-${vessel.color}-700 mb-2`}
                            >
                              {vessel.desc}
                            </p>
                            <p
                              className={`text-xs text-${vessel.color}-600 font-medium`}
                            >
                              {vessel.detail}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Career Paths */}
              {activeSection === 'careers' && (
                <div className="p-8">
                  <div className="flex items-center space-x-3 mb-6">
                    <span className="text-3xl">👨‍✈️</span>
                    <h2 className="text-3xl font-bold text-gray-900">
                      Career Paths
                    </h2>
                  </div>

                  <div className="space-y-10">
                    <div className="text-center">
                      <p className="text-xl text-gray-700 leading-relaxed max-w-4xl mx-auto">
                        The maritime industry offers{' '}
                        <strong>diverse career opportunities</strong> both at
                        sea and on shore. Whether you're drawn to adventure on
                        the open ocean or prefer supporting operations from
                        land, there's a maritime career path that fits your
                        interests and lifestyle.
                      </p>
                    </div>

                    {/* Sea vs Shore Careers */}
                    <div className="grid lg:grid-cols-2 gap-8">
                      {/* Sea-Going Careers */}
                      <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-8 border-2 border-blue-200">
                        <div className="text-center mb-6">
                          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-3xl">🌊</span>
                          </div>
                          <h3 className="text-2xl font-bold text-blue-900">
                            Sea-Going Careers
                          </h3>
                          <p className="text-blue-700 mt-2">
                            Adventure awaits on the world's oceans
                          </p>
                        </div>

                        <div className="space-y-4">
                          <div className="bg-white p-4 rounded-lg shadow-sm">
                            <h4 className="font-semibold text-blue-800 mb-3">
                              Deck Department
                            </h4>
                            <div className="space-y-2 text-sm text-blue-700">
                              <div className="flex justify-between">
                                <span>• Captain/Master</span>
                                <span className="font-medium">
                                  $150K-$300K+
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span>• Chief Mate</span>
                                <span className="font-medium">$120K-$200K</span>
                              </div>
                              <div className="flex justify-between">
                                <span>• 2nd/3rd Mate</span>
                                <span className="font-medium">$80K-$120K</span>
                              </div>
                              <div className="flex justify-between">
                                <span>• Able Seaman (AB)</span>
                                <span className="font-medium">$50K-$80K</span>
                              </div>
                            </div>
                          </div>

                          <div className="bg-white p-4 rounded-lg shadow-sm">
                            <h4 className="font-semibold text-blue-800 mb-3">
                              Engine Department
                            </h4>
                            <div className="space-y-2 text-sm text-blue-700">
                              <div className="flex justify-between">
                                <span>• Chief Engineer</span>
                                <span className="font-medium">$130K-$250K</span>
                              </div>
                              <div className="flex justify-between">
                                <span>• 1st Assistant Engineer</span>
                                <span className="font-medium">$100K-$160K</span>
                              </div>
                              <div className="flex justify-between">
                                <span>• 2nd/3rd Engineer</span>
                                <span className="font-medium">$70K-$110K</span>
                              </div>
                              <div className="flex justify-between">
                                <span>• Oiler/QMED</span>
                                <span className="font-medium">$45K-$75K</span>
                              </div>
                            </div>
                          </div>

                          <div className="bg-white p-4 rounded-lg shadow-sm">
                            <h4 className="font-semibold text-blue-800 mb-3">
                              Steward Department
                            </h4>
                            <div className="space-y-2 text-sm text-blue-700">
                              <div className="flex justify-between">
                                <span>• Chief Steward</span>
                                <span className="font-medium">$60K-$90K</span>
                              </div>
                              <div className="flex justify-between">
                                <span>• Cook</span>
                                <span className="font-medium">$45K-$70K</span>
                              </div>
                              <div className="flex justify-between">
                                <span>• Steward Utility</span>
                                <span className="font-medium">$40K-$60K</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Shore-Side Careers */}
                      <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-8 border-2 border-green-200">
                        <div className="text-center mb-6">
                          <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-3xl">🏢</span>
                          </div>
                          <h3 className="text-2xl font-bold text-green-900">
                            Shore-Side Careers
                          </h3>
                          <p className="text-green-700 mt-2">
                            Supporting maritime operations from land
                          </p>
                        </div>

                        <div className="space-y-4">
                          <div className="bg-white p-4 rounded-lg shadow-sm">
                            <h4 className="font-semibold text-green-800 mb-3">
                              Port Operations
                            </h4>
                            <div className="space-y-2 text-sm text-green-700">
                              <div className="flex justify-between">
                                <span>• Port Manager</span>
                                <span className="font-medium">$100K-$180K</span>
                              </div>
                              <div className="flex justify-between">
                                <span>• Marine Superintendent</span>
                                <span className="font-medium">$90K-$150K</span>
                              </div>
                              <div className="flex justify-between">
                                <span>• Terminal Operations</span>
                                <span className="font-medium">$60K-$100K</span>
                              </div>
                              <div className="flex justify-between">
                                <span>• Longshoreman</span>
                                <span className="font-medium">$50K-$120K</span>
                              </div>
                            </div>
                          </div>

                          <div className="bg-white p-4 rounded-lg shadow-sm">
                            <h4 className="font-semibold text-green-800 mb-3">
                              Maritime Services
                            </h4>
                            <div className="space-y-2 text-sm text-green-700">
                              <div className="flex justify-between">
                                <span>• Ship Broker</span>
                                <span className="font-medium">$80K-$200K+</span>
                              </div>
                              <div className="flex justify-between">
                                <span>• Marine Surveyor</span>
                                <span className="font-medium">$70K-$120K</span>
                              </div>
                              <div className="flex justify-between">
                                <span>• Port Agent</span>
                                <span className="font-medium">$50K-$90K</span>
                              </div>
                              <div className="flex justify-between">
                                <span>• Maritime Lawyer</span>
                                <span className="font-medium">
                                  $120K-$300K+
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="bg-white p-4 rounded-lg shadow-sm">
                            <h4 className="font-semibold text-green-800 mb-3">
                              Engineering & Design
                            </h4>
                            <div className="space-y-2 text-sm text-green-700">
                              <div className="flex justify-between">
                                <span>• Naval Architect</span>
                                <span className="font-medium">$80K-$140K</span>
                              </div>
                              <div className="flex justify-between">
                                <span>• Marine Engineer</span>
                                <span className="font-medium">$75K-$130K</span>
                              </div>
                              <div className="flex justify-between">
                                <span>• Ship Designer</span>
                                <span className="font-medium">$70K-$120K</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Work-Life Balance */}
                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6">
                      <h3 className="text-xl font-semibold text-yellow-900 mb-4">
                        Understanding Maritime Work Schedules
                      </h3>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-medium text-yellow-800 mb-2">
                            Sea-Going Schedules
                          </h4>
                          <ul className="text-sm text-yellow-700 space-y-1">
                            <li>
                              • <strong>Deep Sea:</strong> 4-6 months on, 2-3
                              months off
                            </li>
                            <li>
                              • <strong>Domestic:</strong> 2-3 months on, 1
                              month off
                            </li>
                            <li>
                              • <strong>Great Lakes:</strong> 2-3 months on, 1-2
                              months off
                            </li>
                            <li>
                              • <strong>Coastal:</strong> Various rotations,
                              some home weekly
                            </li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-medium text-yellow-800 mb-2">
                            Benefits of Sea Time
                          </h4>
                          <ul className="text-sm text-yellow-700 space-y-1">
                            <li>• Extended time off between contracts</li>
                            <li>• All meals and accommodation provided</li>
                            <li>• No commuting or daily expenses</li>
                            <li>• Travel to international ports</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    {/* Education Pathways */}
                    <div className="bg-gray-50 rounded-xl p-8">
                      <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                        Education and Training Pathways
                      </h3>

                      <div className="grid md:grid-cols-3 gap-6">
                        <div className="bg-white p-6 rounded-lg shadow-sm border-2 border-blue-200">
                          <div className="text-center mb-4">
                            <span className="text-3xl">🎓</span>
                            <h4 className="text-lg font-semibold text-blue-900 mt-2">
                              Maritime Academies
                            </h4>
                          </div>
                          <ul className="text-sm text-gray-700 space-y-2">
                            <li>
                              • U.S. Merchant Marine Academy (Kings Point)
                            </li>
                            <li>• California Maritime Academy</li>
                            <li>• Maine Maritime Academy</li>
                            <li>• Massachusetts Maritime Academy</li>
                            <li>• SUNY Maritime</li>
                            <li>• Texas A&M Maritime Academy</li>
                          </ul>
                          <div className="mt-4 p-3 bg-blue-50 rounded">
                            <p className="text-xs text-blue-700">
                              4-year degree programs with sea time included
                            </p>
                          </div>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow-sm border-2 border-green-200">
                          <div className="text-center mb-4">
                            <span className="text-3xl">⚓</span>
                            <h4 className="text-lg font-semibold text-green-900 mt-2">
                              Entry-Level Programs
                            </h4>
                          </div>
                          <ul className="text-sm text-gray-700 space-y-2">
                            <li>• Seafarers Harry Lundeberg School</li>
                            <li>• SIU Paul Hall Center</li>
                            <li>• Military Sealift Command</li>
                            <li>• Maritime union training</li>
                            <li>• Company-sponsored programs</li>
                            <li>• Community college maritime programs</li>
                          </ul>
                          <div className="mt-4 p-3 bg-green-50 rounded">
                            <p className="text-xs text-green-700">
                              Fast-track entry with on-the-job training
                            </p>
                          </div>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow-sm border-2 border-purple-200">
                          <div className="text-center mb-4">
                            <span className="text-3xl">📜</span>
                            <h4 className="text-lg font-semibold text-purple-900 mt-2">
                              Professional Development
                            </h4>
                          </div>
                          <ul className="text-sm text-gray-700 space-y-2">
                            <li>• USCG License Upgrades</li>
                            <li>• STCW Certifications</li>
                            <li>• Specialized Training (DPO, Tanker, etc.)</li>
                            <li>• MBA/Business Degrees</li>
                            <li>• Professional Maritime Organizations</li>
                            <li>• Continuing Education Requirements</li>
                          </ul>
                          <div className="mt-4 p-3 bg-purple-50 rounded">
                            <p className="text-xs text-purple-700">
                              Advance your career with additional credentials
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Getting Started */}
              {activeSection === 'getting-started' && (
                <div className="p-8">
                  <div className="flex items-center space-x-3 mb-6">
                    <span className="text-3xl">🎯</span>
                    <h2 className="text-3xl font-bold text-gray-900">
                      Getting Started
                    </h2>
                  </div>

                  <div className="space-y-10">
                    <div className="text-center">
                      <p className="text-xl text-gray-700 leading-relaxed max-w-4xl mx-auto">
                        Ready to start your maritime career? Here's your{' '}
                        <strong>step-by-step roadmap</strong> to joining the
                        Merchant Marine, whether you're a recent high school
                        graduate or looking for a career change.
                      </p>
                    </div>

                    {/* Step-by-Step Process */}
                    <div className="space-y-6">
                      {[
                        {
                          step: 1,
                          title: 'Get Your TWIC Card',
                          description:
                            'Transportation Worker Identification Credential required for all maritime workers',
                          details: [
                            'Apply at TSA enrollment center',
                            'Background check and fingerprinting',
                            'Takes 3-5 weeks to receive',
                            'Valid for 5 years',
                            'Cost: ~$125',
                          ],
                          color: 'blue',
                        },
                        {
                          step: 2,
                          title: 'Obtain Basic STCW Certifications',
                          description:
                            'International safety training required for all seafarers',
                          details: [
                            'Basic Safety Training (BST)',
                            'Personal Survival Techniques',
                            'Fire Prevention & Firefighting',
                            'Elementary First Aid',
                            'Personal Safety & Social Responsibility',
                          ],
                          color: 'green',
                        },
                        {
                          step: 3,
                          title: 'Get Your Merchant Mariner Credential (MMC)',
                          description:
                            'Your official license to work on U.S. flag vessels',
                          details: [
                            'Medical certificate required',
                            'Drug test and physical',
                            'Submit application to USCG',
                            'Sea time documentation (if applicable)',
                            'Processing time: 3-6 months',
                          ],
                          color: 'purple',
                        },
                        {
                          step: 4,
                          title: 'Choose Your Entry Path',
                          description:
                            'Multiple ways to start your maritime career',
                          details: [
                            'Maritime academy (4-year degree)',
                            'Entry-level unlicensed positions',
                            'Military Sealift Command',
                            'Union training programs',
                            'Company training programs',
                          ],
                          color: 'orange',
                        },
                        {
                          step: 5,
                          title: 'Gain Sea Time Experience',
                          description:
                            'Build the experience needed for advancement',
                          details: [
                            'Work entry-level positions',
                            'Document all sea time',
                            'Study for license upgrades',
                            'Network with industry professionals',
                            'Consider specialized training',
                          ],
                          color: 'red',
                        },
                      ].map((item) => (
                        <div
                          key={item.step}
                          className={`bg-${item.color}-50 border-l-4 border-${item.color}-500 p-6 rounded-lg`}
                        >
                          <div className="flex items-start space-x-4">
                            <div
                              className={`flex-shrink-0 w-12 h-12 bg-${item.color}-500 text-white rounded-full flex items-center justify-center font-bold text-lg`}
                            >
                              {item.step}
                            </div>
                            <div className="flex-1">
                              <h3
                                className={`text-xl font-semibold text-${item.color}-900 mb-2`}
                              >
                                {item.title}
                              </h3>
                              <p className={`text-${item.color}-700 mb-4`}>
                                {item.description}
                              </p>
                              <ul
                                className={`text-sm text-${item.color}-600 space-y-1`}
                              >
                                {item.details.map((detail, index) => (
                                  <li key={index}>• {detail}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Quick Start Options */}
                    <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl p-8 text-white">
                      <h3 className="text-2xl font-bold text-center mb-6">
                        Quick Start Options
                      </h3>
                      <div className="grid md:grid-cols-3 gap-6">
                        <div className="bg-white/10 rounded-lg p-6 text-center">
                          <span className="text-3xl mb-4 block">🎓</span>
                          <h4 className="text-lg font-semibold mb-3">
                            Recent Graduate?
                          </h4>
                          <p className="text-sm mb-4">
                            Consider a maritime academy for a comprehensive
                            education and guaranteed job placement.
                          </p>
                          <div className="text-xs opacity-75">
                            4-year commitment with federal financial aid
                            available
                          </div>
                        </div>
                        <div className="bg-white/10 rounded-lg p-6 text-center">
                          <span className="text-3xl mb-4 block">⚡</span>
                          <h4 className="text-lg font-semibold mb-3">
                            Want Quick Entry?
                          </h4>
                          <p className="text-sm mb-4">
                            Start as unlicensed crew while studying for your
                            officer license.
                          </p>
                          <div className="text-xs opacity-75">
                            Earn while you learn, immediate income potential
                          </div>
                        </div>
                        <div className="bg-white/10 rounded-lg p-6 text-center">
                          <span className="text-3xl mb-4 block">🇺🇸</span>
                          <h4 className="text-lg font-semibold mb-3">
                            Military Background?
                          </h4>
                          <p className="text-sm mb-4">
                            Your experience translates well to Military Sealift
                            Command positions.
                          </p>
                          <div className="text-xs opacity-75">
                            Federal benefits and familiar military structure
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Resources */}
                    <div className="bg-gray-50 rounded-xl p-8">
                      <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                        Essential Resources
                      </h3>

                      <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                          <h4 className="text-lg font-semibold text-gray-800">
                            Government Resources
                          </h4>
                          <div className="space-y-3">
                            <div className="bg-white p-4 rounded-lg shadow-sm">
                              <h5 className="font-medium text-gray-900">
                                U.S. Coast Guard National Maritime Center
                              </h5>
                              <p className="text-sm text-gray-600">
                                Official licensing and credentialing authority
                              </p>
                            </div>
                            <div className="bg-white p-4 rounded-lg shadow-sm">
                              <h5 className="font-medium text-gray-900">
                                Maritime Administration (MARAD)
                              </h5>
                              <p className="text-sm text-gray-600">
                                Federal agency promoting maritime industry
                              </p>
                            </div>
                            <div className="bg-white p-4 rounded-lg shadow-sm">
                              <h5 className="font-medium text-gray-900">
                                Transportation Security Administration
                              </h5>
                              <p className="text-sm text-gray-600">
                                TWIC card applications and renewals
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <h4 className="text-lg font-semibold text-gray-800">
                            Industry Organizations
                          </h4>
                          <div className="space-y-3">
                            <div className="bg-white p-4 rounded-lg shadow-sm">
                              <h5 className="font-medium text-gray-900">
                                American Maritime Officers (AMO)
                              </h5>
                              <p className="text-sm text-gray-600">
                                Union representing deck and engine officers
                              </p>
                            </div>
                            <div className="bg-white p-4 rounded-lg shadow-sm">
                              <h5 className="font-medium text-gray-900">
                                Seafarers International Union (SIU)
                              </h5>
                              <p className="text-sm text-gray-600">
                                Union representing unlicensed mariners
                              </p>
                            </div>
                            <div className="bg-white p-4 rounded-lg shadow-sm">
                              <h5 className="font-medium text-gray-900">
                                Marine Engineers' Beneficial Association (MEBA)
                              </h5>
                              <p className="text-sm text-gray-600">
                                Union representing licensed engineers
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Final CTA */}
                    <div className="text-center bg-gradient-to-r from-green-500 to-blue-600 rounded-xl p-8 text-white">
                      <h3 className="text-2xl font-bold mb-4">
                        Ready to Set Sail?
                      </h3>
                      <p className="text-lg mb-6 opacity-90">
                        The maritime industry offers stable careers, good pay,
                        and the adventure of a lifetime. Your journey starts
                        with a single step.
                      </p>
                      <div className="flex flex-wrap justify-center gap-4 text-sm">
                        <div className="bg-white/20 px-4 py-2 rounded-full">
                          💼 Stable Employment
                        </div>
                        <div className="bg-white/20 px-4 py-2 rounded-full">
                          💰 Competitive Pay
                        </div>
                        <div className="bg-white/20 px-4 py-2 rounded-full">
                          🌍 Travel the World
                        </div>
                        <div className="bg-white/20 px-4 py-2 rounded-full">
                          🎓 Continuous Learning
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
