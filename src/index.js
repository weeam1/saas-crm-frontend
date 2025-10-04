import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import "assets/css/App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import AuthLayout from "./layouts/auth";
import AdminLayout from "layouts/admin";
import UserLayout from "layouts/user";
import {
  ChakraProvider,
  ColorModeScript,
  Flex,
  Box,
  Spinner,
} from "@chakra-ui/react";
import theme from "theme/theme";
import { ThemeEditorProvider } from "@hypertheme-editor/chakra-ui";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Provider, useSelector } from "react-redux";
import store from "./redux/store";
import { useDispatch } from "react-redux";
import { getApi } from "services/api";
import { setActiveTree, setTree, setUsers } from "./redux/localSlice";
import ContextProvider from "contexts/store";
import LeadCycle from "views/admin/leadCycle";
import webSocketService from "services/WebSocketService";
import { newNotifyItem } from "./redux/webSocketReducer";
import { addAnnouncement } from "./redux/announcementsSlice";
import AnnouncementsModal from "views/admin/announcement/components/AnnouncementsModal";
import addNotification, { Notifications } from "react-push-notification";
import WeeamLoadingPage from "./components/welcome/WeeamLoadingPage";

import logo from "assets/img/app-logo.jpeg";

// Import your audio file
import newAnnouncementSound from "assets/sounds/new-notification.mp3";
import { requestNotificationPermission } from "services/NotificationService";
import Loader from "components/loading/Loader";
import useChunkErrorHandler from "hooks/useChunkErrorHandler";
import { getSmartTimezone } from "hooks/useTimezone";
// import { useSocketEvents } from 'hooks/useSocketEvents';
import socketService from "services/socketService";
import useUserSession from "hooks/useUserSession";
import { useSocketEvents } from "hooks/useSocketEvents";
// Create an audio instance
const announcementSound = new Audio(newAnnouncementSound);

function App() {
  // chunk handler
  useChunkErrorHandler();

  useEffect(() => {
    getSmartTimezone();
  }, []);

  const token = localStorage.getItem("token") || null;

  const dispatch = useDispatch();
  const [appLoaded, setAppLoaded] = useState(false);
  const [splashScreen, setSplashScreen] = useState(true);
  // const [permissionGranted, setPermissionGranted] = useState(false);
  // const user = JSON.parse(localStorage.getItem('user'));

  const { user } = useUserSession();
  useNavigate();

  // initilize the web sockets
  const { isConnected } = useSocketEvents();

  const showNotification = (customOptions) => {
    const notificationOptions = {
      theme: "darkblue",
      native: true,
      duration: 20000,
      icon: logo,
      ...customOptions,
    };

    Notification.requestPermission();
    addNotification(notificationOptions);
  };

  const user2 = useSelector((state) => state.user.user);

  const [isModalOpen, setIsModalOpen] = useState(false);

  // Splash screen
  useEffect(() => {
    const timer = setTimeout(() => setSplashScreen(false), 3600);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isConnected && user?._id) {
      const registerPayload = {
        userId: user?._id,
      };

      console.log("RIGSTER USER AGAIN RECONNECT");

      socketService.registerUser(registerPayload);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?._id, isConnected]);

  useEffect(() => {
    if (!user?._id) return;

    webSocketService.connect(user._id);

    webSocketService.socket.onmessage = async (event) => {
      try {
        const socketData = JSON.parse(event.data);
        console.log("WebSocket message:", socketData);

        let notificationDetails = {};
        const { type, data } = socketData;
        const message = data?.message
          ? data?.message
          : data?.lead_id
            ? `You have been assigned a new lead${data?.lead_name && `: ${data?.lead_name}`}`
            : "Check out the latest updates!";

        // Handle announcements (type === 1)
        if (type === 1) {
          if (Array.isArray(data) && data.length > 0) {
            data.forEach((announcement) =>
              dispatch(addAnnouncement(announcement))
            );
          } else {
            dispatch(addAnnouncement(data));
          }
        }

        // Push notification if type is valid
        if (type !== -1 && message) {
          dispatch(newNotifyItem(socketData));

          notificationDetails = {
            title:
              type === 1
                ? "New Announcement"
                : type === 2
                  ? "Interview Invite"
                  : "New Notification",
            message,
          };
        }

        // Request and send notifications
        const isGranted = await requestNotificationPermission();
        if (isGranted) {
          showNotification({
            title: notificationDetails.title,
            message: notificationDetails.message,
          });
        }
        // else {
        // 	toast.success('Check out the latest updates!');
        // }

        // Play notification sound
        await announcementSound
          .play()
          .catch((error) => console.error("Error playing sound:", error));

        // Open the modal and clear previous notification
        setIsModalOpen(true);
      } catch (error) {
        console.error("Error handling WebSocket message:", error);
      }
    };

    return () => {
      webSocketService.socket.onmessage = null;
    };
  }, [dispatch, user]);

  const getToken = () => {
    return localStorage.getItem("token") || null;
  };

  const fetchTree = async () => {
    setAppLoaded(false);
    const response = await getApi("api/user/tree");
    const data = response.data || null;

    dispatch(setTree(data));

    setTimeout(() => {
      setAppLoaded(true);
    }, 0);
  };

  const fetchActiveTree = async () => {
    setAppLoaded(false);
    const response = await getApi("api/v2/user/active_tree");
    const data = response.data || null;

    dispatch(setActiveTree(data));

    setTimeout(() => {
      setAppLoaded(true);
    }, 0);
  };

  const fetchUsers = async () => {
    setAppLoaded(false);
    const response = await getApi("api/user/");
    const data = response.data || null;
    dispatch(setUsers(data?.user));

    setTimeout(() => {
      setAppLoaded(true);
    }, 0);
  };

  useEffect(() => {
    if (getToken() && user2) {
      fetchTree();
      fetchActiveTree();
      fetchUsers();
    } else if (!getToken()) {
      setAppLoaded(true);
    }
  }, [user2]);

  // Show splash screen
  if (!appLoaded || splashScreen) {
    return <WeeamLoadingPage />;
  }

  return (
    <>
      <Notifications />
      {isModalOpen && (
        <AnnouncementsModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
      <ToastContainer />
      <Routes>
        {token && user?.role ? (
          <Route path="/*" element={<AdminLayout />} />
        ) : (
          // user?.role === 'user' ? (
          // 	<Route path='/*' element={<UserLayout />} />
          // ) : user?.role === 'superAdmin' ? (
          // 	<Route path='/*' element={<AdminLayout />} />
          // ) : (
          // 	''
          // )
          <Route path="/*" element={<AuthLayout />} />
        )}
      </Routes>
      {/* <LeadCycle /> */}
    </>
  );
}

ReactDOM.render(
  <Provider store={store}>
    <ContextProvider>
      <ChakraProvider theme={theme} cssVarsRoot="body">
        <React.StrictMode>
          <ThemeEditorProvider>
            <Router>
              <ColorModeScript
                initialColorMode={theme.config.initialColorMode}
              />
              <App />
            </Router>
          </ThemeEditorProvider>
        </React.StrictMode>
      </ChakraProvider>
    </ContextProvider>
  </Provider>,
  document.getElementById("root")
);
