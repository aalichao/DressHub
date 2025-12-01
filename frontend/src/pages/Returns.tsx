import { startTransition, useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";
import { Box, Typography, Button, List, ListItem, ListItemText } from "@mui/material";

type Rental = {
  _id: string;
  item?: {
    title?: string;
  };
  startDate: string;
  endDate: string;
  status: "pending" | "confirmed" | "in_use" | "returned" | "cancelled";
};

type ReturnRequest = {
  _id: string;
  rental: string;
  status: "requested" | "approved" | "declined" | "completed";
};

export default function Returns() {
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [myReturns, setMyReturns] = useState<ReturnRequest[]>([]);

  const fetchData = async () => {
    const [rRes, retRes] = await Promise.all([
      axiosClient.get<Rental[]>("/rentals", { params: { role: "renter" } }),
      axiosClient.get<ReturnRequest[]>("/returns", {
        params: { role: "renter" },
      }),
    ]);
    startTransition(() => {
      setRentals(rRes.data);
      setMyReturns(retRes.data);
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleInitiateReturn = async (rentalId: string) => {
    await axiosClient.post("/returns", { rentalId });
    fetchData();
  };

  return (
    <Box className="p-4">
      <Typography variant="h5" mb={2}>My Rentals</Typography>
      <List>
        {rentals.map((rental) => (
          <ListItem key={rental._id} divider>
            <ListItemText
              primary={rental.item?.title}
              secondary={`From ${rental.startDate.slice(0, 10)} to ${rental.endDate.slice(0, 10)} • Status: ${rental.status}`}
            />
            {rental.status === "confirmed" || rental.status === "in_use" ? (
              <Button onClick={() => handleInitiateReturn(rental._id)}>
                Initiate return
              </Button>
            ) : null}
          </ListItem>
        ))}
      </List>

      <Typography variant="h6" mt={4}>Return status</Typography>
      <List>
        {myReturns.map((rr) => (
          <ListItem key={rr._id} divider>
            <ListItemText
              primary={`Rental ${rr.rental}`}
              secondary={`Status: ${rr.status}`}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
}
