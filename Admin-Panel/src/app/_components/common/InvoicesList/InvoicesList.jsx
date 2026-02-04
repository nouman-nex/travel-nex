import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { InvoiceItem } from "./InvoiceItem";
import { postRequest } from "../../../../backendServices/ApiCalls";
import { useEffect, useState } from "react";

const InvoicesList = () => {
  const [invoicesData, setInvoicesData] = useState([]);
  const getpendingtime = async () => {
    postRequest(
      "/getpendingtime",
      {},
      (response) => {
        setInvoicesData(response?.data?.data);
      },
      (error) => {
        console.error("Error fetching pending time:", error);
      }
    );
  };
  useEffect(() => {
    getpendingtime();
  }, []);
  return (
    <TableContainer>
      <Table sx={{ minWidth: 760 }}>
        <TableHead>
          <TableRow
            sx={{
              "th:first-child": {
                pl: 3,
              },
              "th:last-child": {
                pr: 3,
              },
            }}
          >
            <TableCell width={150}>Name</TableCell>
            <TableCell width={150}>Project</TableCell>
            <TableCell width={160}>Start Time</TableCell>
            <TableCell width={160}>End Time</TableCell>
            <TableCell width={200}>Reason</TableCell>
            <TableCell width={50}>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {invoicesData.map((item, index) => (
            <InvoiceItem
              key={item._id || index}
              item={item}
              setInvoicesData={setInvoicesData}
              invoicesData={invoicesData}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
export { InvoicesList };
