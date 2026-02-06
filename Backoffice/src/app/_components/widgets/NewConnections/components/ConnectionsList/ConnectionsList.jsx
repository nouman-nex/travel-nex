import { List } from "@mui/material";
import { useEffect, useState } from "react";
import { ConnectionItem } from "../ConnectionItem";

function ConnectionsList({ data }) {
  const [itemsList, setItemsList] = useState(data);

  useEffect(() => {
    setItemsList(data);
  }, [data]); // update state when data prop changes

  return (
    <List disablePadding>
      {itemsList.map((item, index) => (
        <ConnectionItem
          item={item}
          key={index}
          // handleFollowToggle={handleFollowToggle}
        />
      ))}
    </List>
  );
}

export { ConnectionsList };
