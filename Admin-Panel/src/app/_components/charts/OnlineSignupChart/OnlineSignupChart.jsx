import { Div } from "@jumbo/shared";
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import PropTypes from "prop-types";

const OnlineSignupChart = ({
  color,
  shadowColor,
  activityandProjects,
  projects,
}) => {
  const dailyBreakdown = activityandProjects?.dailyBreakdown || [];
  const getWeekdays = () => [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  const dailyData = {};
  dailyBreakdown.forEach((day) => {
    if (day?.date && day?.averagePercentage) {
      const date = new Date(day.date);
      const dayName = date.toLocaleDateString("en-US", { weekday: "long" });
      dailyData[dayName] = parseFloat(day.averagePercentage);
    }
  });

  const finalData = getWeekdays().map((day) => ({
    day,
    percentage: dailyData[day] || 0, 
  }));

  return (
    <ResponsiveContainer width="100%" height={100}>
      <LineChart data={finalData} className={"mx-auto"}>
        <defs>
          <filter id="shadow" height="200%">
            <feDropShadow
              dx="0"
              dy="5"
              stdDeviation="8"
              floodColor={shadowColor || "#6610f2"}
            />
          </filter>
        </defs>
        <XAxis dataKey="day" tick={{ fill: "#FFFFFF" }} hide />
        <YAxis domain={[0, 100]} tick={{ fill: "#FFFFFF" }} hide />
        <Tooltip
          cursor={false}
          content={({ active, label, payload }) =>
            active ? (
              <Div sx={{ color: "common.white" }}>
                {payload?.map((row, index) => (
                  <div key={index}>{`${label}: ${Math.round(row.value)}%`}</div>
                ))}
              </Div>
            ) : null
          }
          wrapperStyle={{
            backgroundColor: color || "rgba(0,0,0,.8)",
            padding: "5px 8px",
            borderRadius: 4,
            boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
          }}
        />
        <Line
          dataKey="percentage"
          filter="url(#shadow)"
          type="monotone"
          dot={false}
          strokeWidth={3}
          stroke={color || "#FFFFFF"}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export { OnlineSignupChart };

OnlineSignupChart.propTypes = {
  color: PropTypes.string,
  shadowColor: PropTypes.string,
  activityandProjects: PropTypes.object,
};
