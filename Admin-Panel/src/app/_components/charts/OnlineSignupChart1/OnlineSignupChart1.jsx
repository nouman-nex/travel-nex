import { Div } from "@jumbo/shared";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import { onlineSignups } from "./data";
import PropTypes from "prop-types";
import { useState } from "react";

const OnlineSignupChart1 = ({ color, shadowColor, data, type }) => {
  // console.log("data in charts", data);
  const [primary, setPrimary] = useState("");
  const [secondary, setSecondary] = useState("");

  return (
    <ResponsiveContainer height={80}>
      <LineChart data={data} className={"mx-auto"}>
        <defs>
          <filter id="shadow" height="200%">
            <feDropShadow
              dx="0"
              dy="5"
              stdDeviation="8"
              floodColor={shadowColor ? shadowColor : "#6610f2"}
            />
          </filter>
        </defs>
        <Tooltip
          cursor={false}
          content={({ active, label, payload }) => {
            if (!active || !payload?.length) return null;

            const item = payload[0]?.payload;

            let content = null;
            switch (type) {
              case "users":
                content = `${item.month}: ${item.count} users joined`;
                break;
              case "withdrawal":
                content = `$${item.totalAmount.toFixed(2)} withdrawn`;
                break;
              case "tickets":
                content = `${item.count} tickets, $${item.revenue.toFixed(2)} revenue`;
                break;
              default:
                content = ``;
            }

            return (
              <Div sx={{ color: "common.white" }}>
                <div>{content}</div>
              </Div>
            );
          }}
          wrapperStyle={{
            backgroundColor: color ? color : "rgba(0,0,0,.8)",
            padding: "5px 8px",
            borderRadius: 4,
            overflow: "hidden",
            boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
          }}
        />

        <XAxis dataKey="month" hide />
        <Line
          dataKey="count"
          filter="url(#shadow)"
          type="monotone"
          dot={null}
          strokeWidth={3}
          // stackId={'2'}
          stroke={color ? color : "#FFFFFF"}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};
/* Todo color, shadowColor prop define */
export { OnlineSignupChart1 };

OnlineSignupChart1.propTypes = {
  color: PropTypes.string,
  shadowColor: PropTypes.string,
};
