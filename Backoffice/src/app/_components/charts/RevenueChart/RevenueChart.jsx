import { Div } from "@jumbo/shared";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import PropTypes from "prop-types";

const RevenueChart = ({ color, shadowColor, coreWorkData }) => {
  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const parseTimeToMinutes = (timeStr) => {
    if (typeof timeStr === "number") {
      return Math.round(timeStr);
    }

    if (!timeStr || typeof timeStr !== "string") {
      console.warn("Invalid time format:", timeStr);
      return 0;
    }

    let totalMinutes = 0;
    const regex = /(\d+)\s*(h|m|s)/g;
    let match;

    while ((match = regex.exec(timeStr)) !== null) {
      const value = parseInt(match[1], 10);
      const unit = match[2];

      if (unit === "h") totalMinutes += value * 60;
      else if (unit === "m") totalMinutes += value;
      else if (unit === "s") totalMinutes += Math.round(value / 60);
    }
    return totalMinutes;
  };

  const formattedRevenue = daysOfWeek.map((day) => {
    const entry = Object.entries(coreWorkData?.dailyBreakdown || {}).find(
      ([date]) => new Date(date).toLocaleDateString("en-US", { weekday: "short" }) === day
    );

    if (entry) {
      const [date, data] = entry;
      return { month: day, amount: data.totalTime };
    } else {
      return { month: day, amount: 0 };
    }
  });

  return (
    <ResponsiveContainer height={100}>
      <LineChart data={formattedRevenue} className="mx-auto">
        <defs>
          <filter id="shadowRevenue" height="200%">
            <feDropShadow
              dx="0"
              dy="5"
              stdDeviation="8"
              floodColor={shadowColor || "#28a745"}
            />
          </filter>
        </defs>

        <Tooltip
          content={({ payload, label }) => {
            if (!payload || !payload.length) return null;

            const totalSeconds = payload[0].value;
            const hours = Math.floor(totalSeconds / 3600);
            const minutes = Math.floor((totalSeconds % 3600) / 60);
            const seconds = Math.floor(totalSeconds % 60);

            let timeParts = [];
            if (hours > 0) timeParts.push(`${hours} h`);
            if (minutes > 0) timeParts.push(`${minutes} m`);
            if (seconds > 0) timeParts.push(`${seconds} s`);

            const timeString = timeParts.length > 0 ? timeParts.join(" ") : "0 s";

            return <Div sx={{ color: "common.white" }}>{`${label}: ${timeString}`}</Div>;
          }}
          wrapperStyle={{
            background: color || "rgba(0,0,0,.8)",
            padding: "5px 8px",
            borderRadius: 4,
            overflow: "hidden",
            boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
          }}
        />

        <XAxis dataKey="month" hide />
        <Line
          dataKey="amount"
          filter="url(#shadowRevenue)"
          type="monotone"
          dot={false}
          strokeWidth={3}
          stroke={color || "#fff"}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export { RevenueChart };

RevenueChart.propTypes = {
  color: PropTypes.string,
  shadowColor: PropTypes.string,
  coreWorkData: PropTypes.object.isRequired,
};
