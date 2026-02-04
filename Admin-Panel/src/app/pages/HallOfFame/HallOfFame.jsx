import React, { useState } from "react";
import {
  Award,
  Trophy,
  Star,
  Medal,
  Crown,
  Calendar,
  ChevronDown,
} from "lucide-react";

const mockHallOfFameData = [
  {
    id: 1,
    name: "Alice Johnson",
    achievement: "Top Performer - 2024",
    category: "Performance",
    year: "2024",
    description:
      "Exceeded all quarterly targets with outstanding customer satisfaction scores",
    points: 2850,
    rank: 1,
    image:
      "https://images.unsplash.com/photo-1494790108755-2616c6106635?w=150&h=150&fit=crop&crop=face",
    badge: "gold",
  },
  {
    id: 2,
    name: "Marcus Lee",
    achievement: "Best Innovator - 2024",
    category: "Innovation",
    year: "2024",
    description:
      "Developed breakthrough solution that increased efficiency by 40%",
    points: 2750,
    rank: 2,
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    badge: "gold",
  },
  {
    id: 3,
    name: "Sofia Garcia",
    achievement: "Lifetime Achievement Award",
    category: "Lifetime",
    year: "2024",
    description:
      "15 years of exceptional service and mentoring countless team members",
    points: 3200,
    rank: 1,
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    badge: "platinum",
  },
  {
    id: 4,
    name: "James Brown",
    achievement: "Team Player of the Year",
    category: "Collaboration",
    year: "2024",
    description:
      "Outstanding collaboration skills and peer support across all projects",
    points: 2400,
    rank: 3,
    image:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    badge: "silver",
  },
  {
    id: 5,
    name: "Emma Wilson",
    achievement: "Rising Star - 2024",
    category: "Growth",
    year: "2024",
    description:
      "Rapid skill development and exceptional project delivery in first year",
    points: 2100,
    rank: 4,
    image:
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face",
    badge: "bronze",
  },
  {
    id: 6,
    name: "David Chen",
    achievement: "Customer Champion - 2023",
    category: "Service",
    year: "2023",
    description: "Highest customer satisfaction ratings and retention rates",
    points: 2650,
    rank: 2,
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    badge: "gold",
  },
];

const categories = [
  "All",
  "Performance",
  "Innovation",
  "Lifetime",
  "Collaboration",
  "Growth",
  "Service",
];
const years = ["All", "2024", "2023"];

const getBadgeIcon = (badge) => {
  switch (badge) {
    case "platinum":
      return <Crown className="w-4 h-4 text-amber-600" />;
    case "gold":
      return <Trophy className="w-4 h-4 text-amber-500" />;
    case "silver":
      return <Medal className="w-4 h-4 text-stone-400" />;
    case "bronze":
      return <Award className="w-4 h-4 text-amber-700" />;
    default:
      return <Star className="w-4 h-4 text-amber-500" />;
  }
};

const getBadgeColor = (badge) => {
  switch (badge) {
    case "platinum":
      return "bg-gradient-to-r from-amber-600 to-yellow-600";
    case "gold":
      return "bg-gradient-to-r from-amber-500 to-yellow-500";
    case "silver":
      return "bg-gradient-to-r from-stone-400 to-stone-500";
    case "bronze":
      return "bg-gradient-to-r from-amber-700 to-amber-800";
    default:
      return "bg-gradient-to-r from-amber-500 to-yellow-500";
  }
};

export default function HallOfFame() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedYear, setSelectedYear] = useState("All");
  const [sortBy, setSortBy] = useState("points");

  const filteredData = mockHallOfFameData
    .filter(
      (person) =>
        selectedCategory === "All" || person.category === selectedCategory
    )
    .filter((person) => selectedYear === "All" || person.year === selectedYear)
    .sort((a, b) => {
      if (sortBy === "points") return b.points - a.points;
      if (sortBy === "name") return a.name.localeCompare(b.name);
      return a.rank - b.rank;
    });

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-amber-50 to-stone-100">
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-amber-600 to-yellow-600 rounded-full mb-8 shadow-sm">
            <Trophy className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-light text-stone-800 mb-4 tracking-wide">
            Hall of Fame
          </h1>
          <p className="text-lg text-stone-600 font-light max-w-2xl mx-auto leading-relaxed">
            Recognizing excellence and outstanding achievements across our
            organization
          </p>
        </div>

        {/* Stats */}
        <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-sm border border-stone-200/50 p-8 mb-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl font-light text-amber-600 mb-2">
                {mockHallOfFameData.length}
              </div>
              <div className="text-stone-600 text-sm font-medium">
                Total Achievers
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-light text-amber-600 mb-2">
                {
                  mockHallOfFameData.filter(
                    (p) => p.badge === "gold" || p.badge === "platinum"
                  ).length
                }
              </div>
              <div className="text-stone-600 text-sm font-medium">
                Gold+ Awards
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-light text-amber-600 mb-2">
                {categories.length - 1}
              </div>
              <div className="text-stone-600 text-sm font-medium">
                Categories
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-light text-amber-600 mb-2">
                {Math.max(
                  ...mockHallOfFameData.map((p) => p.points)
                ).toLocaleString()}
              </div>
              <div className="text-stone-600 text-sm font-medium">
                Highest Score
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-sm border border-stone-200/50 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="relative">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full appearance-none bg-white border border-stone-300 rounded-lg px-4 py-3 pr-10 text-stone-700 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-colors"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category === "All" ? "All Categories" : category}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-stone-400 pointer-events-none" />
            </div>

            <div className="relative">
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="w-full appearance-none bg-white border border-stone-300 rounded-lg px-4 py-3 pr-10 text-stone-700 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-colors"
              >
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year === "All" ? "All Years" : year}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-stone-400 pointer-events-none" />
            </div>

            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full appearance-none bg-white border border-stone-300 rounded-lg px-4 py-3 pr-10 text-stone-700 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-colors"
              >
                <option value="points">Sort by Points</option>
                <option value="name">Sort by Name</option>
                <option value="rank">Sort by Rank</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-stone-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="mb-8">
          <p className="text-stone-600 font-light">
            Showing{" "}
            <span className="font-medium text-amber-700">
              {filteredData.length}
            </span>{" "}
            achievers
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredData.map((person) => (
            <div
              key={person.id}
              className="group bg-white/90 backdrop-blur-sm rounded-lg shadow-sm border border-stone-200/50 overflow-hidden hover:shadow-md transition-all duration-300"
            >
              <div className="p-8">
                {/* Header with rank and badge */}
                <div className="flex items-center justify-between mb-6">
                  <div
                    className={`inline-flex items-center justify-center w-8 h-8 rounded-full ${getBadgeColor(person.badge)} text-white text-sm font-medium`}
                  >
                    {person.rank}
                  </div>
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-stone-100">
                    {getBadgeIcon(person.badge)}
                  </div>
                </div>

                {/* Profile */}
                <div className="text-center mb-6">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full overflow-hidden border-2 border-stone-200">
                    <img
                      src={person.image}
                      alt={person.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = `https://ui-avatars.com/api/?name=${person.name}&background=d6d3d1&color=57534e&size=80`;
                      }}
                    />
                  </div>
                  <h3 className="text-xl font-medium text-stone-800 mb-1">
                    {person.name}
                  </h3>
                  <div className="flex items-center justify-center gap-2 text-stone-500 text-sm mb-3">
                    <Calendar className="w-4 h-4" />
                    <span>{person.year}</span>
                  </div>
                </div>

                {/* Achievement */}
                <div className="text-center mb-6">
                  <div className="inline-block bg-amber-50 text-amber-800 px-4 py-2 rounded-full text-sm font-medium mb-3">
                    {person.achievement}
                  </div>
                  <p className="text-stone-600 text-sm leading-relaxed">
                    {person.description}
                  </p>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-6 border-t border-stone-200">
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-amber-500 fill-current" />
                    <span className="text-lg font-medium text-stone-800">
                      {person.points.toLocaleString()}
                    </span>
                  </div>
                  <span className="text-sm text-stone-500 bg-stone-100 px-3 py-1 rounded-full">
                    {person.category}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredData.length === 0 && (
          <div className="text-center py-20">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-stone-100 flex items-center justify-center">
              <Trophy className="w-10 h-10 text-stone-400" />
            </div>
            <h3 className="text-xl font-light text-stone-600 mb-2">
              No achievers found
            </h3>
            <p className="text-stone-500 font-light">
              Please adjust your filters to view results.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
