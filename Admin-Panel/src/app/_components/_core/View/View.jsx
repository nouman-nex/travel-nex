import React from "react";
import { GridView, ListView } from "./components";

function View({ variant, dataSource, renderItem }) {
  if (variant === "list")
    return <ListView dataSource={dataSource} renderItem={renderItem} />;

  return <GridView dataSource={dataSource} renderItem={renderItem} />;
}

export { View };
