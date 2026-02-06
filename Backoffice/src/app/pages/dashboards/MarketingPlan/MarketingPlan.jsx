import React, { useState } from "react";
import {
  Target,
  TrendingUp,
  Users,
  Calendar,
  DollarSign,
  BarChart3,
  ArrowRight,
  CheckCircle,
  Clock,
  Eye,
  MousePointer,
  Globe,
  ChevronRight,
} from "lucide-react";

const marketingGoals = [
  {
    id: 1,
    title: "Brand Awareness Growth",
    target: "40% increase",
    timeline: "Q1-Q2 2024",
    status: "In Progress",
    progress: 65,
    description: "Expand brand recognition through strategic campaigns",
    metrics: ["Social media reach", "Website traffic", "Brand mentions"],
  },
  {
    id: 2,
    title: "Lead Generation",
    target: "500 qualified leads",
    timeline: "Q1 2024",
    status: "On Track",
    progress: 78,
    description: "Generate high-quality leads through digital channels",
    metrics: ["Form submissions", "Demo requests", "Newsletter signups"],
  },
  {
    id: 3,
    title: "Customer Acquisition",
    target: "25% growth",
    timeline: "Ongoing",
    status: "Completed",
    progress: 100,
    description: "Acquire new customers across all market segments",
    metrics: ["New signups", "Conversion rate", "Customer LTV"],
  },
];

const campaigns = [
  {
    id: 1,
    name: "Digital Transformation Initiative",
    budget: "$45,000",
    channels: ["Social Media", "Email", "Content"],
    startDate: "Jan 2024",
    endDate: "Mar 2024",
    status: "Active",
    roi: "+34%",
    metrics: {
      impressions: "2.4M",
      clicks: "89K",
      conversions: "1,247",
    },
  },
  {
    id: 2,
    name: "Product Launch Campaign",
    budget: "$75,000",
    channels: ["PPC", "PR", "Events"],
    startDate: "Feb 2024",
    endDate: "Apr 2024",
    status: "Planning",
    roi: "TBD",
    metrics: {
      impressions: "0",
      clicks: "0",
      conversions: "0",
    },
  },
  {
    id: 3,
    name: "Customer Retention Program",
    budget: "$25,000",
    channels: ["Email", "In-App"],
    startDate: "Jan 2024",
    endDate: "Dec 2024",
    status: "Active",
    roi: "+67%",
    metrics: {
      impressions: "456K",
      clicks: "23K",
      conversions: "892",
    },
  },
];

const kpis = [
  { label: "Monthly Active Users", value: "127K", change: "+12%", trend: "up" },
  { label: "Conversion Rate", value: "3.4%", change: "+0.8%", trend: "up" },
  {
    label: "Customer Acquisition Cost",
    value: "$87",
    change: "-15%",
    trend: "down",
  },
  { label: "Return on Ad Spend", value: "4.2x", change: "+1.3x", trend: "up" },
];

const channels = [
  {
    name: "Search Engine Marketing",
    allocation: 35,
    budget: "$52,500",
    performance: "Excellent",
  },
  {
    name: "Social Media Marketing",
    allocation: 25,
    budget: "$37,500",
    performance: "Good",
  },
  {
    name: "Content Marketing",
    allocation: 20,
    budget: "$30,000",
    performance: "Very Good",
  },
  {
    name: "Email Marketing",
    allocation: 10,
    budget: "$15,000",
    performance: "Good",
  },
  {
    name: "Public Relations",
    allocation: 10,
    budget: "$15,000",
    performance: "Fair",
  },
];

export default function MarketingPlan() {
  const [selectedTab, setSelectedTab] = useState("overview");

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "active":
      case "on track":
        return "bg-amber-100 text-amber-800";
      case "in progress":
        return "bg-blue-100 text-blue-800";
      case "planning":
        return "bg-stone-100 text-stone-800";
      default:
        return "bg-stone-100 text-stone-800";
    }
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "goals", label: "Goals & Objectives", icon: Target },
    { id: "campaigns", label: "Campaigns", icon: TrendingUp },
    { id: "channels", label: "Channel Strategy", icon: Globe },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-amber-50 to-stone-100">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-amber-600 to-yellow-600 rounded-full shadow-sm">
              <Target className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-light text-stone-800 tracking-wide">
                Marketing Plan 2025
              </h1>
              <p className="text-lg text-stone-600 font-light mt-2">
                Strategic roadmap for growth and market expansion
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-sm border border-stone-200/50 mb-8">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedTab(tab.id)}
                  className={`flex items-center gap-3 px-6 py-4 font-medium transition-colors border-b-2 whitespace-nowrap ${
                    selectedTab === tab.id
                      ? "border-amber-500 text-amber-700 bg-amber-50/50"
                      : "border-transparent text-stone-600 hover:text-stone-800 hover:bg-stone-50/50"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Overview Tab */}
        {selectedTab === "overview" && (
          <div className="space-y-8">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {kpis.map((kpi, index) => (
                <div
                  key={index}
                  className="bg-white/90 backdrop-blur-sm rounded-lg shadow-sm border border-stone-200/50 p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-sm text-stone-600 font-medium">
                      {kpi.label}
                    </div>
                    <div
                      className={`flex items-center gap-1 text-sm ${
                        kpi.trend === "up" ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      <TrendingUp
                        className={`w-4 h-4 ${kpi.trend === "down" ? "rotate-180" : ""}`}
                      />
                      {kpi.change}
                    </div>
                  </div>
                  <div className="text-3xl font-light text-stone-800">
                    {kpi.value}
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-sm border border-stone-200/50 p-8">
                <h3 className="text-xl font-medium text-stone-800 mb-6">
                  Campaign Performance
                </h3>
                <div className="space-y-4">
                  {campaigns.slice(0, 3).map((campaign) => (
                    <div
                      key={campaign.id}
                      className="flex items-center justify-between py-3 border-b border-stone-200 last:border-0"
                    >
                      <div>
                        <div className="font-medium text-stone-800">
                          {campaign.name}
                        </div>
                        <div className="text-sm text-stone-600">
                          {campaign.budget} • {campaign.roi} ROI
                        </div>
                      </div>
                      <div
                        className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(campaign.status)}`}
                      >
                        {campaign.status}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-sm border border-stone-200/50 p-8">
                <h3 className="text-xl font-medium text-stone-800 mb-6">
                  Channel Performance
                </h3>
                <div className="space-y-4">
                  {channels.slice(0, 3).map((channel, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="font-medium text-stone-800">
                          {channel.name}
                        </div>
                        <div className="text-sm text-stone-600">
                          {channel.allocation}%
                        </div>
                      </div>
                      <div className="w-full bg-stone-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-amber-500 to-yellow-500 h-2 rounded-full"
                          style={{ width: `${channel.allocation}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Goals Tab */}
        {selectedTab === "goals" && (
          <div className="space-y-8">
            <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-sm border border-stone-200/50 p-8">
              <h2 className="text-2xl font-light text-stone-800 mb-8">
                Strategic Objectives
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {marketingGoals.map((goal) => (
                  <div
                    key={goal.id}
                    className="bg-stone-50 border border-stone-200/60 rounded-lg shadow-sm p-6 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="text-lg font-semibold text-stone-800">
                        {goal.title}
                      </h4>
                      <div
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(goal.status)}`}
                      >
                        {goal.status}
                      </div>
                    </div>
                    <p className="text-sm text-stone-600">{goal.description}</p>
                    <div className="text-sm text-stone-500">
                      <strong>Target:</strong> {goal.target} &nbsp; • &nbsp;
                      <strong>Timeline:</strong> {goal.timeline}
                    </div>
                    <div className="w-full bg-stone-200 rounded-full h-2">
                      <div
                        className="bg-amber-500 h-2 rounded-full"
                        style={{ width: `${goal.progress}%` }}
                      ></div>
                    </div>
                    <ul className="text-sm text-stone-500 list-disc list-inside">
                      {goal.metrics.map((metric, idx) => (
                        <li key={idx}>{metric}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Campaigns Tab */}
        {selectedTab === "campaigns" && (
          <div className="space-y-6">
            <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-sm border border-stone-200/50 p-8">
              <h2 className="text-2xl font-light text-stone-800 mb-8">
                Active Campaigns
              </h2>
              <div className="space-y-6">
                {campaigns.map((campaign) => (
                  <div
                    key={campaign.id}
                    className="border border-stone-200/60 bg-stone-50 rounded-lg p-6 shadow-sm"
                  >
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="text-lg font-semibold text-stone-800">
                        {campaign.name}
                      </h3>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(campaign.status)}`}
                      >
                        {campaign.status}
                      </span>
                    </div>
                    <div className="text-sm text-stone-600 mb-2">
                      <strong>Budget:</strong> {campaign.budget} &nbsp; • &nbsp;
                      <strong>ROI:</strong> {campaign.roi}
                    </div>
                    <div className="text-sm text-stone-500 mb-2">
                      <strong>Channels:</strong> {campaign.channels.join(", ")}
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm text-stone-700">
                      <div>
                        <strong>Impressions:</strong>{" "}
                        {campaign.metrics.impressions}
                      </div>
                      <div>
                        <strong>Clicks:</strong> {campaign.metrics.clicks}
                      </div>
                      <div>
                        <strong>Conversions:</strong>{" "}
                        {campaign.metrics.conversions}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Channel Strategy Tab */}
        {selectedTab === "channels" && (
          <div className="space-y-6">
            <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-sm border border-stone-200/50 p-8">
              <h2 className="text-2xl font-light text-stone-800 mb-8">
                Marketing Channel Allocation
              </h2>
              <div className="space-y-5">
                {channels.map((channel, idx) => (
                  <div key={idx} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <h4 className="text-md font-semibold text-stone-800">
                        {channel.name}
                      </h4>
                      <span className="text-sm text-stone-500">
                        {channel.performance}
                      </span>
                    </div>
                    <div className="w-full bg-stone-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-amber-600 to-yellow-500 h-2 rounded-full"
                        style={{ width: `${channel.allocation}%` }}
                      ></div>
                    </div>
                    <div className="text-sm text-stone-500">
                      <strong>Budget:</strong> {channel.budget} &nbsp; • &nbsp;
                      <strong>Allocation:</strong> {channel.allocation}%
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
