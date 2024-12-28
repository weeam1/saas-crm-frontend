import keys from "config/keys";

export const constant = {
	baseUrl:
		keys.nodeENV === "development" ? keys.baseLocalUrl : keys.baseLiveUrl,
	server2: keys.server2,
};

//  baseUrl: (!process.env.NODE_ENV || process.env.NODE_ENV === 'https://crm-stage.weeam.info/') ? "http://localhost:5000/" : "https://server.idxdubai.com/",
// server2: "https://testing.idxdubai.com/"
