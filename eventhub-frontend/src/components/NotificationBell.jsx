import { useEffect, useState } from "react";

import {
  Badge,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  Box,
  Divider,
  Tooltip,
} from "@mui/material";

import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";

import { createCableConsumer } from "../cable";
import { useAuth } from "../context/AuthContext";

function NotificationBell() {
  const { token, user } = useAuth();

  const [notifications, setNotifications] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);

  const menuOpen = Boolean(anchorEl);

  // Connect to Action Cable and listen for notifications
  useEffect(() => {
    console.log("NotificationBell mounted");
    console.log("Token:", token ? "Available" : "Missing");
    console.log("User:", user);

    if (!token || !user) {
      console.log("Cable connection skipped: token or user missing");
      return;
    }

    const consumer = createCableConsumer(token);

    console.log("Cable consumer created");

    const subscription = consumer.subscriptions.create(
      { channel: "NotificationsChannel" },
      {
        connected() {
          console.log("Connected to NotificationsChannel");
        },
        disconnected() {
          console.log("Disconnected from NotificationsChannel");
        },
        rejected() {
          console.log("NotificationsChannel subscription rejected");
        },
        received(data) {
          console.log("Received notification:", data);

          if (data.action === "new_notification" && data.notification) {
            setNotifications((previous) => [data.notification, ...previous]);
          }
        },
      },
    );

    return () => {
      subscription.unsubscribe();
      consumer.disconnect();
    };
  }, [token, user]);

  const handleMarkAsRead = async (notification) => {
    // Already read notification ko dobara update nahi karna
    if (notification.read_at) return;

    try {
      const response = await fetch(
        `http://localhost:3000/api/v1/notifications/${notification.id}/read`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (!response.ok) {
        throw new Error("Failed to mark notification as read");
      }

      const data = await response.json();

      // Update notification in React state
      setNotifications((previous) =>
        previous.map((item) =>
          item.id === notification.id
            ? {
                ...item,
                read_at: data.notification.read_at,
              }
            : item,
        ),
      );

      console.log("Notification marked as read:", notification.id);
    } catch (error) {
      console.error("Mark as read error:", error);
    }
  };

  const unreadCount = notifications.filter(
    (notification) => !notification.read_at,
  ).length;

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Tooltip title="Notifications">
        <IconButton
          onClick={handleOpen}
          aria-label="Open notifications"
          sx={{ color: "white" }}
        >
          <Badge badgeContent={unreadCount} color="error">
            <NotificationsNoneIcon />
          </Badge>
        </IconButton>
      </Tooltip>

      <Menu
        anchorEl={anchorEl}
        open={menuOpen}
        onClose={handleClose}
        slotProps={{
          paper: {
            sx: {
              bgcolor: "#111827",
              color: "white",
              width: 330,
              maxHeight: 400,
              border: "1px solid #334155",
              mt: 1,
            },
          },
        }}
      >
        <Box sx={{ px: 2, py: 1 }}>
          <Typography fontWeight={700}>Notifications</Typography>
        </Box>

        <Divider sx={{ borderColor: "#334155" }} />

        {notifications.length === 0 ? (
          <MenuItem disabled>
            <Typography variant="body2" sx={{ color: "#94a3b8", py: 1 }}>
              No notifications yet.
            </Typography>
          </MenuItem>
        ) : (
          notifications.map((notification) => (
            <MenuItem
              key={notification.id}
              onClick={() => {
                handleMarkAsRead(notification);
                handleClose();
              }}
              sx={{
                whiteSpace: "normal",
                alignItems: "flex-start",
                py: 1.5,
              }}
            >
              <Box>
                <Typography
                  variant="body2"
                  fontWeight={700}
                  sx={{ color: "#60a5fa" }}
                >
                  New event registration
                </Typography>

                <Typography variant="body2">
                  {notification.actor?.name || "Someone"} registered for{" "}
                  {notification.event?.title || "your event"}.
                </Typography>
              </Box>
            </MenuItem>
          ))
        )}
      </Menu>
    </>
  );
}

export default NotificationBell;
