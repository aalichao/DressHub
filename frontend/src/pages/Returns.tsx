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
  // backend may send either the id or a populated object
  rental: string | Rental;
  status: "requested" | "approved" | "declined" | "in_transit" | "completed";
  owner?: string;
  renter?: string;
};

export default function Returns() {
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [renterReturns, setRenterReturns] = useState<ReturnRequest[]>([]);
  const [ownerReturns, setOwnerReturns] = useState<ReturnRequest[]>([]);
  const [submittingId, setSubmittingId] = useState<string | null>(null);
  const [approvingId, setApprovingId] = useState<string | null>(null);
  const [shippingId, setShippingId] = useState<string | null>(null);
  const [acceptingId, setAcceptingId] = useState<string | null>(null);

  const fetchData = async () => {
    const [rRes, renterRetRes, ownerRetRes] = await Promise.all([
      axiosClient.get<Rental[]>("/rentals", { params: { role: "renter" } }),
      axiosClient.get<ReturnRequest[]>("/returns", {
        params: { role: "renter" },
      }),
      axiosClient.get<ReturnRequest[]>("/returns", {
        params: { role: "owner" },
      }),
    ]);
    startTransition(() => {
      setRentals(rRes.data);
      // Filter out completed return requests
      setRenterReturns(renterRetRes.data.filter(rr => rr.status !== "completed"));
      setOwnerReturns(ownerRetRes.data.filter(rr => rr.status !== "completed"));
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  // helper to normalize rental id from ReturnRequest
  const getRentalIdFromReturn = (rr: ReturnRequest) =>
    typeof rr.rental === "string" ? rr.rental : rr.rental._id;

  const hasReturnRequest = (rentalId: string) =>
    renterReturns.some((rr) => getRentalIdFromReturn(rr) === rentalId);

  const handleInitiateReturn = async (rentalId: string) => {
    if (hasReturnRequest(rentalId) || submittingId === rentalId) return;

    try {
      setSubmittingId(rentalId);
      await axiosClient.post("/returns", { rentalId });
      await fetchData();
    } finally {
      setSubmittingId(null);
    }
  };

  const handleApproveReturn = async (returnId: string) => {
    if (approvingId === returnId) return;

    try {
      setApprovingId(returnId);
      await axiosClient.put(`/returns/${returnId}`, { status: "approved" });
      await fetchData();
    } finally {
      setApprovingId(null);
    }
  };

  const handleMarkShipped = async (returnId: string) => {
    if (shippingId === returnId) return;

    try {
      setShippingId(returnId);
      await axiosClient.put(`/returns/${returnId}`, { status: "in_transit" });
      await fetchData();
    } finally {
      setShippingId(null);
    }
  };

  const handleAcceptPackage = async (returnId: string) => {
    if (acceptingId === returnId) return;

    try {
      setAcceptingId(returnId);
      await axiosClient.put(`/returns/${returnId}`, { status: "completed" });
      await fetchData();
    } finally {
      setAcceptingId(null);
    }
  };

  // helper to get rental title from return request
  const getRentalTitle = (rr: ReturnRequest) => {
    if (typeof rr.rental === "object" && rr.rental.item?.title) {
      return rr.rental.item.title;
    }
    const rentalId = getRentalIdFromReturn(rr);
    const rental = rentals.find((r) => r._id === rentalId);
    return rental?.item?.title || `Rental ${rentalId}`;
  };

  return (
    <Box className="p-4">
      <Typography component="h1" variant="h5" mb={2}>My Rentals (As Renter)</Typography>
      <List>
        {rentals.map((rental) => {
          const canInitiateReturn =
            (rental.status === "confirmed" || rental.status === "in_use") &&
            !hasReturnRequest(rental._id);

          return (
            <ListItem key={rental._id} divider>
              <ListItemText
                primary={rental.item?.title}
                secondary={`From ${rental.startDate.slice(0, 10)} to ${
                  rental.endDate.slice(0, 10)
                } • Status: ${rental.status}`}
              />
              {canInitiateReturn && (
                <Button
                  onClick={() => handleInitiateReturn(rental._id)}
                  disabled={submittingId === rental._id}
                  variant="contained"
                >
                  Initiate Return
                </Button>
              )}
            </ListItem>
          );
        })}
      </List>

      <Typography component="h2" variant="h6" mt={4} mb={2}>My Return Requests (As Renter)</Typography>
      <List>
        {renterReturns.map((rr) => {
          const canMarkShipped = rr.status === "approved";
          
          return (
            <ListItem key={rr._id} divider>
              <ListItemText
                primary={getRentalTitle(rr)}
                secondary={`Status: ${rr.status}`}
              />
              {canMarkShipped && (
                <Button
                  onClick={() => handleMarkShipped(rr._id)}
                  disabled={shippingId === rr._id}
                  variant="contained"
                  color="primary"
                >
                  Package Shipped
                </Button>
              )}
            </ListItem>
          );
        })}
        {renterReturns.length === 0 && (
          <ListItem>
            <ListItemText primary="No return requests" />
          </ListItem>
        )}
      </List>

      <Typography component="h2" variant="h6" mt={4} mb={2}>Return Requests to Review (As Owner)</Typography>
      <List>
        {ownerReturns.map((rr) => {
          const canApprove = rr.status === "requested";
          const canAcceptPackage = rr.status === "in_transit";
          
          return (
            <ListItem key={rr._id} divider>
              <ListItemText
                primary={getRentalTitle(rr)}
                secondary={`Status: ${rr.status}`}
              />
              {canApprove && (
                <Button
                  onClick={() => handleApproveReturn(rr._id)}
                  disabled={approvingId === rr._id}
                  variant="contained"
                  color="success"
                >
                  Approve Return
                </Button>
              )}
              {canAcceptPackage && (
                <Button
                  onClick={() => handleAcceptPackage(rr._id)}
                  disabled={acceptingId === rr._id}
                  variant="contained"
                  color="primary"
                >
                  Accept Package
                </Button>
              )}
            </ListItem>
          );
        })}
        {ownerReturns.length === 0 && (
          <ListItem>
            <ListItemText primary="No return requests to review" />
          </ListItem>
        )}
      </List>
    </Box>
  );
}
