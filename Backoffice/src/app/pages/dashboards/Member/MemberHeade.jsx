import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Stack,
} from "@mui/material";
import { JumboDdMenu } from "@jumbo/components";
import axios from "axios";
import { useAuth } from "@app/_components/_core/AuthProvider/hooks";
import { API_BASE_URL } from "../../../../backendServices/ApiCalls";
const MemberHeader = () => {
  const [members, setMembers] = useState([]);
  const { User } = useAuth();

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const companyId = User.companyId;
      const response = await axios.get(
        `${API_BASE_URL}/get-members/${companyId}`
      );
      setMembers(response.data);
    } catch (error) {
      console.error("Error fetching members:", error);
    }
  };

  return (
    <TableContainer>
      <Table sx={{ minWidth: 760 }}>
        <TableHead>
          <TableRow
            sx={{
              "th:first-child": { pl: 3 },
              "th:last-child": { pr: 3 },
            }}
          >
            <TableCell width={"25%"}>Name</TableCell>
            <TableCell width={"25%"}>Email</TableCell>
            <TableCell width={"15%"}>Role</TableCell>
            <TableCell width={"10%"}>Status</TableCell>
            <TableCell width={"25%"}>Date Added</TableCell>
            {/* <TableCell width={140}>Action</TableCell> */}
          </TableRow>
        </TableHead>
        <TableBody>
          {members.map((member, index) => (
            <MemberItem item={member} key={index} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

const MemberItem = ({ item }) => {
  return (
    <TableRow
      sx={{
        "td:first-child": { pl: 3 },
        "td:last-child": { pr: 3 },
      }}
    >
      <TableCell>{item.firstname}</TableCell>
      <TableCell>{item.email}</TableCell>
      <TableCell>{item?.roles[0]}</TableCell>
      <TableCell>
        <Chip
          label={item?.status}
          size="small"
          sx={{ textTransform: "capitalize" }}
        />
      </TableCell>
      <TableCell>{new Date(item?.createdAt).toLocaleString()}</TableCell>
      <TableCell>
        {/* <Stack direction={"row"} spacing={2} alignItems={"center"}>
          <JumboDdMenu
            menuItems={[
              { title: "View", slug: "view" },
              { title: "Edit", slug: "edit" },
              { title: "Delete", slug: "delete" },
            ]}
          />
        </Stack> */}
      </TableCell>
    </TableRow>
  );
};

export { MemberHeader };
