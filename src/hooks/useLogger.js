// src/hooks/useLogger.js
import { browserName, osName, deviceType } from "react-device-detect";
import axios from "axios";
import { useSocketEvents } from "./useSocketEvents";

export const useLogger = () => {
  const [isConnected, createUserActivityLog] = useSocketEvents();
  
  const logAction = async (action, entity, entityId, status, message = "") => {
    try {
      // Safely get user data
      const userString = localStorage.getItem("user");
      if (!userString) {
        throw new Error("User not found in localStorage");
      }

      const user = JSON.parse(userString);
      
      // Get IP and location with timeout
      const geoData = await axios.get("https://ipwho.is/", { timeout: 3000 });
      
      const logPayload = {
        userId: user._id,
        action,
        entity,
        entityId,
        status,
        message,
        metadata: {
          ip: geoData.data.ip,
          device: `${deviceType} (${osName})`.trim(),
          browser: browserName,
          country: geoData.data.country_name,
          region: geoData.data.region,
          city: geoData.data.city,
          timezone: geoData.data.timezone,
          timestamp: new Date().toISOString(),
        },
      };

      const payloadAsJson = JSON.stringify(logPayload);
      if (isConnected && createUserActivityLog) {
        await createUserActivityLog(payloadAsJson);
      } else {
        console.warn("Socket not connected, log not sent");
      }
    } catch (error) {
      console.error("Logging failed:", error);
      // Consider sending error to error tracking service
    }
  };
  
  return { logAction };
};