import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PaginationPage from './components/Pagination';
import { getApi, postApi, putApi } from 'services/api';
import { constant } from 'constant';
import axios from 'axios';
import { toast } from 'react-toastify';
import ErrorLeadLimitMessage from 'components/Message/ErrorLeadLimitMessage';

const Index = () => {
	const user = JSON.parse(localStorage.getItem('user'));
	const location = useLocation();
	const navigate = useNavigate();
	const [data, setData] = useState([]);
	const [totalPages, setTotalPages] = useState(0);
	const [totalLeads, setTotalLeads] = useState(0);
	const [isLoading, setIsLoading] = useState(false);
	const [currentState, setCurrentState] = useState('buy_leads');
	const [dateTime, setDateTime] = useState({ from: '', to: '' });
	const [pageSize, setPageSize] = useState(50);
	const [activeTab, setActiveTab] = useState('Buy Leads');
	const [currentPage, setCurrentPage] = useState(1);
	const [error, setError] = useState(null);
	const [searchedData, setSearchedData] = useState([]);
	const [displaySearchData, setDisplaySearchData] = useState(false);
	const [userData, setUserData] = useState(null);
	const [buyLoading, setBuyLoading] = useState({});
	const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
	const [errorLeadData, setErrorLeadData] = useState(null);

	// Ref to prevent duplicate fetches
	const fetchLockRef = useRef(false);
	const lastFetchRef = useRef(null);

	const debounce = (func, delay) => {
		let timeoutId;
		return (...args) => {
			clearTimeout(timeoutId);
			timeoutId = setTimeout(() => func(...args), delay);
		};
	};

	const updateUrl = (newPage, newSize, newTab) => {
		const params = new URLSearchParams(location.search);
		params.set('page', newPage || currentPage);
		params.set('pageSize', newSize || pageSize);
		params.set('tab', newTab || activeTab);
		navigate(`${location.pathname}?${params.toString()}`, { replace: true });
	};

	const getInitialStateFromUrl = () => {
		const params = new URLSearchParams(location.search);
		const page = parseInt(params.get('page')) || 1;
		const size = parseInt(params.get('pageSize')) || 50;
		const tab = params.get('tab') || 'Buy Leads';

		return { page, size, tab };
	};
	const fetchTabData = async (tab, page = 1, size = pageSize, source) => {
		if (fetchLockRef.current) {
			return;
		}
		const fetchKey = `${tab}_${page}_${size}`;
		if (lastFetchRef.current === fetchKey) {
			return;
		}

		fetchLockRef.current = true;
		setIsLoading(true);
		setError(null);
		lastFetchRef.current = fetchKey;

		try {
			let result;
			if (tab === 'Buy Leads') {
				// Always use the /api/lead/ endpoint for "Buy Leads"
				result = await getApi(
					`api/lead/?dateTime=${dateTime?.from}|${dateTime?.to}&page=${page}&pageSize=${size}&isInLeadPool=true&excludeUser=${user._id}&excludeApprovalStatus=buy_leads`,
					null,
					'baseUrl',
					source
				);
			} else {
				// Use /api/adminApproval/get for "Pending" and "Rejected"
				const statusMap = { Pending: 'pending', Rejected: 'rejected' };
				const status = statusMap[tab];
				const queryParams = new URLSearchParams();
				if (status) {
					queryParams.append('approvalStatus', status);
					queryParams.append('agentId', user._id);
				}
				queryParams.append('page', page);
				queryParams.append('pageSize', size);
				result = await getApi(`api/adminApproval/get?${queryParams}`);
			}

			let newData =
				tab === 'Buy Leads'
					? Array.isArray(result.data?.result)
						? result.data.result
						: result.data?.approvals || []
					: result.data?.approvals || result.data || [];
			newData = newData.map((lead) => ({
				...lead,
				ip: lead?.ip?.split('-')?.[1] || lead?.ip || '',
			}));

			setData(newData);
			setTotalPages(result.data?.totalPages || 0);
			const totalLeadCount =
				result.data?.totalLeads || result.data?.totalApprovals || 0;
			setTotalLeads(totalLeadCount);
		} catch (error) {
			if (!axios.isCancel(error)) {
				console.error('FetchTabData Error:', error);
				setError(error.message || 'Failed to fetch tab data');
				setData([]);
				setTotalPages(0);
				setTotalLeads(0);
			}
		} finally {
			setIsLoading(false);
			fetchLockRef.current = false;
		}
	};

	const fetchUserData = async () => {
		setIsLoading(true);
		try {
			const response = await getApi(`api/user/view/${user._id}`);
			setUserData(response.data);
		} catch (error) {
			console.error('Fetch User Data Error:', error);
			setUserData(null);
		} finally {
			setIsLoading(false);
		}
	};

	const fetchSearchedData = async (term = '', pageNo = 1, size = pageSize) => {
		if (isLoading) return;
		const fetchKey = `search_${activeTab}_${pageNo}_${size}`;
		if (lastFetchRef.current === fetchKey) {
			return;
		}

		setIsLoading(true);
		setError(null);
		lastFetchRef.current = fetchKey;
		try {
			let result;
			if (activeTab === 'Pending' || activeTab === 'Rejected') {
				const statusMap = { Pending: 'pending', Rejected: 'rejected' };
				const approvalStatus = statusMap[activeTab];
				const queryParams = new URLSearchParams();
				queryParams.append('term', term);
				queryParams.append('page', pageNo);
				queryParams.append('pageSize', size);
				queryParams.append('activeTab', activeTab);
				result = await getApi(`api/adminApproval/search?${queryParams}`);

				console.log('Pending/Rejected API Response:', result);

				const rawData = result.data?.result || result.data || [];
				console.log('Pending/Rejected Raw Data:', rawData);
				const newData = Array.isArray(rawData)
					? rawData.map((lead) => ({
							...lead,
							ip: lead?.ip?.split('-')?.[1] || lead?.ip || '',
						}))
					: [];

				setDisplaySearchData(true);
				setSearchedData(newData);
				setData(newData);
				setTotalPages(
					result.data?.totalPages || Math.ceil(newData.length / size) || 0
				);
				setTotalLeads(result.data?.totalLeads || newData.length || 0);
			} else if (activeTab === 'Buy Leads') {
				result = await getApi(
					`api/lead/search?term=${term}&dateTime=${dateTime?.from}|${dateTime?.to}&page=${pageNo}&pageSize=${size}&isInLeadPool=true&excludeUser=${user._id}`
				);

				console.log('Buy Leads API Response:', result);
				const rawData = result.data?.result || [];
				console.log('Buy Leads Raw Data:', rawData);
				const newData = Array.isArray(rawData)
					? rawData.map((lead) => ({
							...lead,
							ip: lead?.ip?.split('-')?.[1] || lead?.ip || '',
							agentId: lead.agentAssigned,
						}))
					: [];

				setDisplaySearchData(true);
				setSearchedData(newData);
				setData(newData);
				setTotalPages(result.data?.totalPages || 0);
				setTotalLeads(result.data?.totalLeads || newData.length || 0);
			}
		} catch (err) {
			console.error('Fetch Searched Data Error:', err);
			setError(err.message || 'Failed to fetch searched leads');
			setData([]);
			setTotalPages(0);
			setTotalLeads(0);
		} finally {
			setIsLoading(false);
		}
	};

	console.log({ isLoading });
	const fetchAdvancedSearch = async (
		data = {},
		pageNo = 1,
		size = pageSize
	) => {
		if (isLoading) return;
		const fetchKey = `advanced_${activeTab}_${pageNo}_${size}`;
		if (lastFetchRef.current === fetchKey) {
			return;
		}
		setIsLoading(true);
		setError(null);
		lastFetchRef.current = fetchKey;
		try {
			let result = await getApi(
				activeTab === 'Buy Leads'
					? `api/lead/v2/advanced-search?data=${JSON.stringify(data)}&role=Agent&dateTime=${dateTime?.from}|${dateTime?.to}&page=${pageNo}&pageSize=${size}&isInLeadPool=true&excludeUser=${user._id}`
					: `api/adminApproval/advanced-search?data=${JSON.stringify(data)}&page=${pageNo}&pageSize=${size}&activeTab=${activeTab}`
			);

			const newData =
				activeTab === 'Buy Leads'
					? result.data?.result || []
					: result.data?.result || result.data || [];
			const validatedData = Array.isArray(newData) ? newData : [];

			setDisplaySearchData(true);
			setSearchedData(validatedData);
			setData(validatedData);
			setTotalPages(result.data?.totalPages || 0);
			setTotalLeads(result.data?.totalLeads || validatedData.length);
		} catch (err) {
			console.error('Fetch Advanced Search Error:', err);
			setError(err.message || 'Failed to fetch advanced search leads');
			setData([]);
			setTotalPages(0);
			setTotalLeads(0);
		} finally {
			setIsLoading(false);
		}
	};
	const fetchAgentLeadsSats = async (userId) => {
		if (!userId) {
			console.error('User ID is missing');
			return { canAddLeads: false };
		}
		try {
			const { data } = await getApi(`api/lead/leads-stats/${userId}`);
			return data?.doc || { canAddLeads: false };
		} catch (error) {
			console.error('Error fetching agent lead stats:', error);
			return { canAddLeads: false };
		}
	};

	const sendRequest = async (leadId) => {
		setBuyLoading((prev) => ({ ...prev, [leadId]: true }));
		try {
			const stats = await fetchAgentLeadsSats(user._id);
			if (!stats.canAddLeads) {
				setErrorLeadData({
					assignedLeads: stats.assignedLeads || 0,
					pendingApprovals: stats.pendingApprovals || 0,
					totalLeads: stats.totalLeads || 0,
					maxLeadLimit: stats.maxLeadLimit || 0,
				});
				setIsErrorModalOpen(true);
				return;
			}

			const payload = { leadId, agentId: user._id, approvalStatus: 'pending' };
			const approvalResponse = await postApi('api/adminApproval/add', payload);
			if (approvalResponse.status !== 200)
				throw new Error('Failed to send lead for approval');

			const userResponse = await getApi(`api/user/view/${user._id}`);
			const lead = data.find((l) => l._id === leadId);
			const coinCost = lead?.leadStatus === 'new' ? 300 : 50;
			const currentCoins = userResponse?.data?.coins || 0;
			const updatedCoins = currentCoins - coinCost;

			if (updatedCoins < 0)
				throw new Error('Insufficient coins to purchase this lead');

			const updateResponse = await putApi(`api/user/edit/${user._id}`, {
				coins: updatedCoins,
			});
			if (updateResponse.status === 200) {
				setUserData((prev) => ({ ...prev, coins: updatedCoins }));
				setData(data.filter((lead) => lead._id !== leadId));
				setTotalLeads((prev) => prev - 1);
				toast.success('Lead purchased and sent for approval', {
					position: toast.POSITION.TOP_RIGHT,
					autoClose: 3000,
				});
			}
		} catch (error) {
			console.error('Send Request Error:', error);
			toast.error(error.message || 'Failed to purchase lead', {
				position: toast.POSITION.TOP_RIGHT,
				autoClose: 3000,
			});
		} finally {
			setBuyLoading((prev) => ({ ...prev, [leadId]: false }));
		}
	};

	const cancelRequest = async (id, leadId, userId) => {
		setBuyLoading((prev) => ({ ...prev, [id]: true }));
		try {
			if (!leadId || !userId) throw new Error('Lead ID or User ID is missing');

			const res = await axios.post(
				`${constant.baseUrl}api/adminApproval/delete`,
				{ id },
				{
					headers: {
						Authorization:
							localStorage.getItem('token') || sessionStorage.getItem('token'),
					},
				}
			);
			if (res.status !== 200)
				throw new Error('Failed to delete approval request');

			const leadResponse = await getApi(`api/lead/view/${leadId}`);
			if (!leadResponse?.data?.lead) throw new Error('Lead not found');

			const userResponse = await getApi(`api/user/view/${userId}`);
			const coinRefund = leadResponse.data.lead.leadStatus === 'new' ? 300 : 50;
			const currentCoins = userResponse.data.coins || 0;
			const updatedCoins = currentCoins + coinRefund;

			const updateResponse = await putApi(`api/user/edit/${userId}`, {
				coins: updatedCoins,
			});
			if (updateResponse.status === 200) {
				setUserData((prev) => ({ ...prev, coins: updatedCoins }));
				setData(data.filter((lead) => lead._id !== id));
				setTotalLeads((prev) => prev - 1);
				toast.success('Request canceled successfully. Coins refunded.', {
					position: toast.POSITION.TOP_RIGHT,
					autoClose: 3000,
				});
			}
		} catch (error) {
			console.error('Cancel Request Error:', error);
			toast.error(error.message || 'Unable to cancel request', {
				position: toast.POSITION.TOP_RIGHT,
				autoClose: 3000,
			});
		} finally {
			setBuyLoading((prev) => ({ ...prev, [id]: false }));
		}
	};

	const debouncedFetchTabData = useCallback(debounce(fetchTabData, 300), [
		dateTime,
		user,
		currentState,
		activeTab,
	]);
	const debouncedFetchSearchedData = useCallback(
		debounce(fetchSearchedData, 300),
		[dateTime, user, activeTab]
	);
	const debouncedFetchAdvancedSearch = useCallback(
		debounce(fetchAdvancedSearch, 300),
		[dateTime, user, activeTab]
	);

	// Sync currentState with activeTab
	useEffect(() => {
		const newState =
			activeTab === 'Buy Leads' ? 'buy_leads' : activeTab.toLowerCase();

		setCurrentState(newState);
	}, [activeTab]);

	// Initial load
	useEffect(() => {
		const { page, size, tab } = getInitialStateFromUrl();
		setCurrentPage(page);
		setPageSize(size);
		setActiveTab(tab);

		const source = axios.CancelToken.source();
		fetchUserData();
		fetchTabData(tab, page, size, source);

		return () => source.cancel('Component unmounted');
	}, []);

	if (error) return <div>Error: {error}</div>;

	return (
		<>
			<PaginationPage
				data={data || []}
				totalPages={totalPages}
				totalLeads={totalLeads}
				isLoading={isLoading}
				fetchData={(tab, page, size) => {
					setData([]);
					setActiveTab(tab);
					setCurrentPage(page);
					setPageSize(size);
					updateUrl(page, size, tab);
					setDisplaySearchData(false);
					fetchTabData(tab, page, size);
				}}
				fetchSearchedData={debouncedFetchSearchedData}
				fetchAdvancedSearch={debouncedFetchAdvancedSearch}
				setCurrentState={setCurrentState}
				currentState={currentState}
				pageSize={pageSize}
				setPageSize={(size) => {
					setPageSize(size);
					updateUrl(currentPage, size, activeTab);
					debouncedFetchTabData(activeTab, currentPage, size);
				}}
				user={user}
				dateTime={dateTime}
				activeTab={activeTab}
				setActiveTab={(tab) => {
					if (
						activeTab === tab &&
						lastFetchRef.current === `${tab}_1_${pageSize}`
					) {
						return;
					}
					setData([]);
					setActiveTab(tab);
					setCurrentPage(1);
					setDisplaySearchData(false);
					updateUrl(1, pageSize, tab);
					fetchTabData(tab, 1, pageSize);
				}}
				currentPage={currentPage}
				setCurrentPage={(page) => {
					setCurrentPage(page);
					updateUrl(page, pageSize, activeTab);
					debouncedFetchTabData(activeTab, page, pageSize);
				}}
				setData={setData}
				setTotalPages={setTotalPages}
				setTotalLeads={setTotalLeads}
				setIsLoading={setIsLoading}
				displaySearchData={displaySearchData}
				setDisplaySearchData={setDisplaySearchData}
				userData={userData}
				sendRequest={sendRequest}
				cancelRequest={cancelRequest}
				buyLoading={buyLoading}
			/>
			{isErrorModalOpen && (
				<ErrorLeadLimitMessage
					isOpen={isErrorModalOpen}
					onClose={() => setIsErrorModalOpen(false)}
					errorLeadData={errorLeadData}
				/>
			)}
		</>
	);
};

export default Index;
