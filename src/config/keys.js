const keys = {
	nodeENV: process.env.REACT_APP_NODE_ENV,
	baseLocalUrl: process.env.REACT_APP_WEEAM_LOCAL_API,
	baseLiveUrl: process.env.REACT_APP_WEEAM_LIVE_API,
	server2: process.env.REACT_APP_SERVER2,
	wssSocketUrl: process.env.REACT_APP_SOCKET_WSS_API,
	socketUrl: process.env.REACT_APP_SOCKET_API,
	clientUrl: process.env.REACT_APP_CLIENT_URL,
	version: process.env.REACT_APP_RELEASE_VERSION,

	fbPixelAPI: process.env.REACT_APP_FB_PIXEL_API,
	fbPixelId: process.env.REACT_APP_FB_PIXEL_ID,
	fbPixelToken: process.env.REACT_APP_FB_PIXEL_TOKEN,

	socketIoUrl: process.env.REACT_APP_SOCKET_IO_URL,
	sipApiUrl: process.env.REACT_APP_SIP_BASE_URL
};

export default keys;
