import { createConsumer } from "@rails/actioncable";

const CABLE_URL = import.meta.env.VITE_CABLE_URL || "ws://localhost:3000/cable";

export const createCableConsumer = (token = null) => {
  const url = token
    ? `${CABLE_URL}?token=${encodeURIComponent(token)}`
    : CABLE_URL;

  return createConsumer(url);
};
