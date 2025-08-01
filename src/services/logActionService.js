import io from 'socket.io-client';
import { browserName, osName, deviceType } from 'react-device-detect';
import axios from 'axios';

const SOCKET_URL = process.env.REACT_APP_API_BASE_URL;
const socket = io(SOCKET_URL);

export const logAction = async (action, entity, entityId, status, message = '') => {
  try {
    // Get user data from auth context/redux
    const user = JSON.parse(localStorage.getItem('user'));
    
    // Get IP and location
    const geoData = await axios.get('https://ipapi.co/json/');
    
    const logPayload = {
      userId: user._id,
      action: action, // e.g., 'VIEW_LEAD'
      entity: entity, // e.g., 'Lead'
      entityId: entityId,
      status: status, // 'success', 'fail', 'error'
      message: message,
      metadata: {
        ip: geoData.data.ip,
        device:` ${deviceType} (${osName})`,
        browser: browserName,
        country: geoData.data.country_name,
        region: geoData.data.region,
        city: geoData.data.city,
        timezone: geoData.data.timezone,
        timestamp: new Date().toISOString()
      }
    };

    // Emit to server
    socket.emit('user_action', logPayload);
  } catch (error) {
    console.error('Logging failed:', error);
  }
};