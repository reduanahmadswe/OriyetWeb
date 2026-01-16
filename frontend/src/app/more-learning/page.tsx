'use client';

import { useState } from 'react';
import { TrendingUp, GraduationCap, Briefcase, Users, ChevronRight } from 'lucide-react';

const educationData = [
    { level: 'None', income: 13000, multiplier: '1x', employment: 48, color: 'from-gray-400 to-gray-500', icon: '📚' },
    { level: 'Primary', income: 16000, multiplier: '1.2x', employment: 55, color: 'from-red-400 to-red-500', icon: '📖' },
    { level: 'SSC', income: 20000, multiplier: '1.5x', employment: 62, color: 'from-green-400 to-green-500', icon: '📗' },
    { level: 'HSC', income: 25000, multiplier: '2x', employment: 68, color: 'from-blue-400 to-blue-500', icon: '📘' },
    { level: "Bachelor's", income: 38000, multiplier: '3.04x', employment: 72, color: 'from-purple-500 to-purple-600', icon: '🎓' },
    { level: "Master's", income: 55000, multiplier: '4.4x', employment: 78, color: 'from-indigo-500 to-indigo-600', icon: '🎯' },
    { level: 'PhD', income: 95000, multiplier: '7.6x', employment: 85, color: 'from-orange-500 to-orange-600', icon: '🏆' },
];

export default function MoreLearningPage() {
    const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
    const maxIncome = Math.max(...educationData.map(d => d.income));

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
            {/* Hero Section */}
            <section className="relative overflow-hidden py-8 sm:py-12 md:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    {/* Badge */}
                    <div className="flex justify-center mb-4 sm:mb-6 md:mb-8">
                        <div className="inline-flex items-center gap-2 px-3 sm:px-4 md:px-6 py-1.5 sm:py-2 md:py-2.5 bg-white rounded-full shadow-md border border-blue-100">
                            <span className="text-xs sm:text-sm md:text-base font-semibold text-blue-600">BD</span>
                            <span className="text-xs sm:text-sm md:text-base text-gray-600">Bangladesh Real Data</span>
                        </div>
                    </div>

                    {/* Main Heading */}
                    <h1 className="text-center mb-3 sm:mb-4 md:mb-6">
                        <span className="block text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black text-gray-900 leading-tight">
                            More Learning =
                        </span>
                        <span className="block text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent leading-tight mt-1 sm:mt-2">
                            More Earning
                        </span>
                    </h1>

                    {/* Subtitle */}
                    <p className="text-center text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto px-4">
                        See how education directly increases your income potential in Bangladesh
                    </p>
                </div>
            </section>

            {/* Main Content */}
            <section className="px-4 sm:px-6 lg:px-8 pb-12 sm:pb-16 md:pb-20 lg:pb-24">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">

                        {/* Chart Section - Hidden on Mobile */}
                        <div className="hidden md:block md:col-span-2">
                            <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl border border-gray-100 p-4 sm:p-6 md:p-8 lg:p-10">
                                {/* Chart Header */}
                                <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8 md:mb-10">
                                    <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
                                        <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-gray-900">
                                            Monthly Income by Education
                                        </h2>
                                        <p className="text-xs sm:text-sm md:text-base text-gray-500 mt-0.5 sm:mt-1">
                                            📊 BBS Labour Force Survey 2022-23
                                        </p>
                                    </div>
                                </div>

                                {/* Chart */}
                                <div className="relative">
                                    {/* Y-axis labels */}
                                    <div className="absolute left-0 top-0 bottom-12 sm:bottom-16 flex flex-col justify-between text-[9px] sm:text-sm text-gray-400 pr-1 sm:pr-3 z-10 bg-white">
                                        <span>৳95k</span>
                                        <span>৳75k</span>
                                        <span>৳50k</span>
                                        <span>৳25k</span>
                                        <span>৳0</span>
                                    </div>

                                    {/* Desktop Chart - All 7 bars */}
                                    <div className="ml-10 md:ml-12">
                                        <div className="flex items-end justify-between gap-2 md:gap-3 lg:gap-4 h-80 md:h-96 lg:h-[28rem] border-b-2 border-l-2 border-gray-200 pb-2 pl-2">
                                            {educationData.map((item) => {
                                                const heightPercentage = (item.income / maxIncome) * 100;
                                                const isSelected = selectedLevel === item.level;

                                                return (
                                                    <div
                                                        key={item.level}
                                                        className="flex-1 flex flex-col items-center group cursor-pointer"
                                                        onMouseEnter={() => setSelectedLevel(item.level)}
                                                        onMouseLeave={() => setSelectedLevel(null)}
                                                    >
                                                        <div className="w-full relative">
                                                            <div
                                                                className={`w-full bg-gradient-to-t ${item.color} rounded-t-xl transition-all duration-300 shadow-lg hover:shadow-2xl ${isSelected ? 'scale-105 ring-4 ring-blue-200' : ''}`}
                                                                style={{ height: `${heightPercentage}%` }}
                                                            >
                                                                {isSelected && (
                                                                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 bg-gray-900 text-white px-4 py-2 md:py-3 rounded-xl shadow-2xl z-20 whitespace-nowrap text-sm md:text-base">
                                                                        <div className="font-bold">৳{item.income.toLocaleString()}/month</div>
                                                                        <div className="text-sm opacity-90">Employment: {item.employment}%</div>
                                                                        <div className="text-sm opacity-90">~ {item.multiplier} Income boost</div>
                                                                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                                                                    </div>
                                                                )}
                                                                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full mb-2">
                                                                    <span className="text-sm md:text-base font-bold text-gray-700">{item.multiplier}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="mt-3 md:mt-4 text-center">
                                                            <div className="text-xl md:text-2xl mb-1">{item.icon}</div>
                                                            <div className="text-sm md:text-base font-semibold text-gray-700 leading-tight">
                                                                {item.level}
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Side Cards */}
                        <div className="space-y-4 sm:space-y-6">
                            {/* Income Multiplier Card */}
                            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl sm:rounded-3xl shadow-xl p-4 sm:p-6 md:p-8 text-white">
                                <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-6">
                                    <TrendingUp className="w-4 h-4 sm:w-6 sm:h-6 md:w-7 md:h-7" />
                                    <h3 className="text-xs sm:text-base md:text-lg font-bold uppercase tracking-wider">Income Multiplier</h3>
                                </div>

                                <div className="space-y-2 sm:space-y-4 md:space-y-5">
                                    {[
                                        { level: 'HSC', multiplier: '2x', icon: '📘' },
                                        { level: "Bachelor's", multiplier: '3.04x', icon: '🎓' },
                                        { level: "Master's", multiplier: '4.4x', icon: '🎯', mobileHidden: true },
                                        { level: 'PhD', multiplier: '7.6x', icon: '🏆' },
                                    ].map((item) => (
                                        <div key={item.level} className={`flex items-center justify-between bg-white/10 backdrop-blur-sm rounded-lg sm:rounded-2xl p-2 sm:p-3 md:p-4 hover:bg-white/20 transition-all ${item.mobileHidden ? 'hidden sm:flex' : 'flex'}`}>
                                            <div className="flex items-center gap-1.5 sm:gap-3">
                                                <span className="text-base sm:text-xl md:text-2xl">{item.icon}</span>
                                                <span className="text-[10px] sm:text-sm md:text-base font-semibold">{item.level}</span>
                                            </div>
                                            <span className="text-base sm:text-xl md:text-2xl lg:text-3xl font-black text-yellow-300">
                                                {item.multiplier}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                <p className="text-[9px] sm:text-sm opacity-80 mt-3 sm:mt-6 flex items-center gap-1 sm:gap-2">
                                    <span>📈</span>
                                    <span className="hidden sm:inline">vs. no formal education baseline</span>
                                    <span className="sm:hidden">vs. no education</span>
                                </p>
                            </div>

                            {/* Employment Rate Card */}
                            <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl border border-gray-100 p-4 sm:p-6 md:p-8">
                                <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-6">
                                    <Briefcase className="w-4 h-4 sm:w-6 sm:h-6 md:w-7 md:h-7 text-blue-600" />
                                    <h3 className="text-xs sm:text-base md:text-lg font-bold text-gray-900 uppercase tracking-wider">Employment Rate</h3>
                                </div>

                                <div className="space-y-2 sm:space-y-4">
                                    {[
                                        { level: 'No Education', rate: 48 },
                                        { level: "Bachelor's", rate: 72, mobileHidden: true },
                                        { level: "Master's", rate: 78, mobileHidden: true },
                                        { level: 'PhD', rate: 85 },
                                    ].map((item) => (
                                        <div key={item.level} className={`space-y-1 sm:space-y-2 ${item.mobileHidden ? 'hidden sm:block' : 'block'}`}>
                                            <div className="flex justify-between items-center">
                                                <span className="text-[10px] sm:text-sm md:text-base font-semibold text-gray-700">{item.level}</span>
                                                <span className="text-xs sm:text-base md:text-lg font-bold text-blue-600">{item.rate}%</span>
                                            </div>
                                            <div className="h-1.5 sm:h-2.5 md:h-3 bg-gray-100 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-500"
                                                    style={{ width: `${item.rate}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Stats */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mt-6 sm:mt-8 md:mt-12">
                        {[
                            { icon: Users, label: 'Survey Participants', value: '50,000+', color: 'from-blue-500 to-blue-600' },
                            { icon: GraduationCap, label: 'Education Levels', value: '7', color: 'from-purple-500 to-purple-600' },
                            { icon: TrendingUp, label: 'Max Income Boost', value: '7.6x', color: 'from-orange-500 to-orange-600' },
                            { icon: Briefcase, label: 'Employment Impact', value: '+77%', color: 'from-green-500 to-green-600' },
                        ].map((stat, index) => (
                            <div
                                key={index}
                                className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 p-4 sm:p-5 md:p-6 hover:shadow-xl transition-all group"
                            >
                                <div className={`w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform`}>
                                    <stat.icon className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-white" />
                                </div>
                                <div className="text-xs sm:text-sm md:text-base text-gray-500 mb-1">{stat.label}</div>
                                <div className="text-xl sm:text-2xl md:text-3xl font-black text-gray-900">{stat.value}</div>
                            </div>
                        ))}
                    </div>

                    {/* CTA Section */}
                    <div className="mt-8 sm:mt-12 md:mt-16 lg:mt-20 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 md:p-12 lg:p-16 text-center text-white">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black mb-3 sm:mb-4 md:mb-6">
                            Ready to Boost Your Income?
                        </h2>
                        <p className="text-sm sm:text-base md:text-lg lg:text-xl opacity-90 mb-6 sm:mb-8 md:mb-10 max-w-3xl mx-auto">
                            Explore our courses and opportunities to advance your education and career
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 md:gap-6 justify-center items-center">
                            <button className="w-full sm:w-auto px-6 sm:px-8 md:px-10 lg:px-12 py-3 sm:py-4 md:py-5 bg-white text-blue-600 rounded-xl sm:rounded-2xl font-bold text-sm sm:text-base md:text-lg hover:bg-gray-100 transition-all shadow-xl hover:shadow-2xl hover:scale-105 flex items-center justify-center gap-2 min-h-[44px]">
                                Browse Events
                                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                            </button>
                            <button className="w-full sm:w-auto px-6 sm:px-8 md:px-10 lg:px-12 py-3 sm:py-4 md:py-5 bg-white/10 backdrop-blur-sm text-white rounded-xl sm:rounded-2xl font-bold text-sm sm:text-base md:text-lg hover:bg-white/20 transition-all border-2 border-white/30 flex items-center justify-center gap-2 min-h-[44px]">
                                View Opportunities
                                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
