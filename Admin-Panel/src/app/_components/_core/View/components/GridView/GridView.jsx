import { Grid } from "@mui/material";

function GridView({ dataSource, renderItem }) {
  let Component = renderItem;
  return (
    <Grid container spacing={3.75}>
      {dataSource.map((item, index) => (
        <Component item={item} key={index} />
      ))}
    </Grid>
  );
}

export { GridView };
