import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PaginationPage from './components/Pagination';
import { getApi, postApi, putApi } from 'services/api';
import { constant } from 'constant';
import axios from 'axios';
import { toast } from 'react-toastify';
import ErrorLeadLimitMessage from 'components/Message/ErrorLeadLimitMessage';
import useUserSession from 'hooks/useUserSession';
import { useUserActivityLog } from 'hooks/useUserActivityLog';
import { usePermissions } from 'hooks/usePermissions';
import { fetchAgentLeadsStats } from 'api';
import { useCreateItemMutation } from 'api/apiSlice';

const Index = () => {
	// const user = JSON.parse(localStorage.getItem('user'));
	const { user } = useUserSession();
	const { createUserLog } = useUserActivityLog();

	const { hasPermission } = usePermissions();
	const [fetchUserStats, { error: fetchUserStatsError }] =
		useCreateItemMutation();

	const location = useLocation();
	const navigate = useNavigate();
	const [data, setData] = useState([]);
	const [totalPages, setTotalPages] = useState(0);
	const [totalLeads, setTotalLeads] = useState(0);
	const [isLoading, setIsLoading] = useState(true);
	const [hasFetched, setHasFetched] = useState(false);
	const [currentState, setCurrentState] = useState('buy_leads');
	const [dateTime, setDateTime] = useState('');
	const [pageSize, setPageSize] = useState(50);
	const [activeTab, setActiveTab] = useState('Buy Leads');
	const [currentPage, setCurrentPage] = useState(1);
	const [error, setError] = useState(null);
	const [searchedData, setSearchedData] = useState([]);
	const [displaySearchData, setDisplaySearchData] = useState(false);
	const [displayAdvSearchData, setDisplayAdvSearchData] = useState(false);
	const [userData, setUserData] = useState(null);
	const [buyLoading, setBuyLoading] = useState({});
	const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
	const [errorLeadData, setErrorLeadData] = useState(null);
	const [isPurchasing, setIsPurchasing] = useState(false);
	const [isCancelling, setIsCancelling] = useState(false);
	// Refs to prevent duplicate fetches
	const fetchLockRef = useRef(false);
	const lastFetchRef = useRef(null);
	const cancelTokenRef = useRef(null);

	const [forceRefresh, setForceRefresh] = useState(false);

	useEffect(() => {
		if (!hasPermission('leadpool_agents')) return navigate('/default');
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

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

	const fetchTabData = async (tab, page = 1, size = pageSize) => {
		if (fetchLockRef.current) return;

		const fetchKey = `${tab}_${page}_${size}`;
		if (lastFetchRef.current === fetchKey && !forceRefresh) return;

		fetchLockRef.current = true;
		setIsLoading(true);
		setError(null);
		lastFetchRef.current = fetchKey;

		if (cancelTokenRef.current) {
			cancelTokenRef.current.cancel('New request initiated');
		}
		cancelTokenRef.current = axios.CancelToken.source();

		try {
			let result;
			if (tab === 'Buy Leads') {
				result = await getApi(
					`api/lead/?&page=${page}&pageSize=${size}&isInLeadPool=true&excludeUser=${user._id}&excludeApprovalStatus=buy_leads`,
					null,
					'baseUrl',
					cancelTokenRef.current.token,
				);
			} else {
				const statusMap = { Pending: 'pending', Rejected: 'rejected' };
				const status = statusMap[tab];
				const queryParams = new URLSearchParams();
				if (status) {
					queryParams.append('approvalStatus', status);
					queryParams.append('agentId', user._id);
				}
				queryParams.append('page', page);
				queryParams.append('pageSize', size);
				result = await getApi(
					`api/adminApproval/get?${queryParams}`,
					null,
					'baseUrl',
					cancelTokenRef.current.token,
				);
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
			setTotalLeads(
				result.data?.totalLeads || result.data?.totalApprovals || 0,
			);
		} catch (error) {
			if (!axios.isCancel(error)) {
				console.error('FetchTabData Error:', error);
				setError(error.message || 'Failed to fetch tab data');
				setData([]);
				setTotalPages(0);
				setTotalLeads(0);
			}
		} finally {
			fetchLockRef.current = false;
			setIsLoading(false);
			setHasFetched(true);
			forceRefresh && setForceRefresh(false);
		}
	};

	const fetchSearchedData = async (term = '', pageNo = 1, size = pageSize) => {
		if (fetchLockRef.current) return;

		const fetchKey = `search_${activeTab}_${pageNo}_${size}_${term}`;
		if (lastFetchRef.current === fetchKey) return;

		fetchLockRef.current = true;
		setIsLoading(true);
		setError(null);
		lastFetchRef.current = fetchKey;

		if (cancelTokenRef.current) {
			cancelTokenRef.current.cancel('New search request initiated');
		}
		cancelTokenRef.current = axios.CancelToken.source();

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
				result = await getApi(
					`api/adminApproval/search?${queryParams}`,
					null,
					'baseUrl',
					cancelTokenRef.current.token,
				);

				const rawData = result.data?.result || result.data || [];
				const newData = Array.isArray(rawData)
					? rawData.map((lead) => ({
							...lead,
							ip: lead?.ip?.split('-')?.[1] || lead?.ip || '',
						}))
					: [];

				setDisplaySearchData(true);
				setSearchedData(newData);
				setData(newData);
				setCurrentPage(pageNo);

				setTotalPages(
					result.data?.totalPages || Math.ceil(newData.length / size) || 0,
				);
				setTotalLeads(result.data?.totalLeads || newData.length || 0);
			} else if (activeTab === 'Buy Leads') {
				result = await getApi(
					`api/lead/search?term=${term}&page=${pageNo}&pageSize=${size}&isInLeadPool=true&excludeUser=${user._id}&role=Agent`,
					null,
					'baseUrl',
					cancelTokenRef.current.token,
				);

				const rawData = result.data?.result || [];
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
			setSearchedData([]);
			setTotalPages(0);
			setTotalLeads(0);
		} finally {
			fetchLockRef.current = false;
			setIsLoading(false);
		}
	};

	const fetchAdvancedSearch = async (
		data = {},
		pageNo = 1,
		size = pageSize,
	) => {
		if (fetchLockRef.current) return;

		const fetchKey = `advanced_${activeTab}_${pageNo}_${size}_${JSON.stringify(data)}`;
		if (lastFetchRef.current === fetchKey) return;

		fetchLockRef.current = true;
		setIsLoading(true);
		setError(null);
		lastFetchRef.current = fetchKey;

		if (cancelTokenRef.current) {
			cancelTokenRef.current.cancel('New advanced search request initiated');
		}
		cancelTokenRef.current = axios.CancelToken.source();

		try {
			let result = await getApi(
				activeTab === 'Buy Leads'
					? `api/lead/v2/advanced-search?data=${JSON.stringify(data)}&role=Agent&page=${pageNo}&pageSize=${size}&isInLeadPool=true&excludeUser=${user._id}`
					: `api/adminApproval/advanced-search?data=${JSON.stringify(data)}&page=${pageNo}&pageSize=${size}&activeTab=${activeTab}`,
				null,
				'baseUrl',
				cancelTokenRef.current.token,
			);

			const newData =
				activeTab === 'Buy Leads'
					? result.data?.result || []
					: result.data?.result || result.data || [];
			const validatedData = Array.isArray(newData)
				? newData.map((lead) => ({
						...lead,
						ip: lead?.ip?.split('-')?.[1] || lead?.ip || '',
					}))
				: [];

			// setDisplaySearchData(true);
			setDisplayAdvSearchData(true);
			setSearchedData(validatedData);
			setData(validatedData);
			setCurrentPage(pageNo);
			updateUrl(pageNo, size, activeTab);

			setTotalPages(result.data?.totalPages || 0);
			setTotalLeads(result.data?.totalLeads || validatedData.length || 0);
		} catch (err) {
			console.error('Fetch Advanced Search Error:', err);
			setError(err.message || 'Failed to fetch advanced search leads');
			setData([]);
			setSearchedData([]);
			setTotalPages(0);
			setTotalLeads(0);
		} finally {
			fetchLockRef.current = false;
			setIsLoading(false);
		}
	};

	const fetchUserData = async () => {
		try {
			const response = await getApi(`api/user/view/${user._id}`);
			setUserData(response.data);
		} catch (error) {
			console.error('Fetch User Data Error:', error);
			setUserData(null);
		}
	};

	// const fetchAgentLeadsStats = async (userId) => {
	// 	if (!userId) {
	// 		console.error('User ID is missing');
	// 		return { canAddLeads: false };
	// 	}
	// 	try {
	// 		const { data } = await getApi(`api/lead/leads-stats/${userId}`);
	// 		return data?.doc || { canAddLeads: false };
	// 	} catch (error) {
	// 		console.error('Error fetching agent lead stats:', error);
	// 		return { canAddLeads: false };
	// 	}
	// };

	const refreshBuyLeads = (leadId) => {
		const filterLeads = (leads) => leads.filter((lead) => lead._id !== leadId);

		displaySearchData
			? setSearchedData((prev) => filterLeads(prev))
			: setData((prev) => filterLeads(prev));
	};

	const sendRequest = async (leadId) => {
		if (isPurchasing) return;
		setIsPurchasing(true);
		setBuyLoading((prev) => ({ ...prev, [leadId]: true }));
		try {
			const userResponse = await getApi(`api/user/view/${user._id}`);
			const currentCoins = userResponse?.data?.coins || 0;

			const lead = data.find((l) => l._id === leadId);
			const coinCost = lead?.eLeadStatus === 'new' ? 300 : 50;

			if (currentCoins < coinCost) {
				throw new Error(
					`Insufficient coins. You need at least ${coinCost} coins to purchase this lead.`,
				);
			}

			// const stats = await fetchAgentLeadsStats(user._id);

			const userStats = await fetchUserStats({
				path: '/lead/v2/leads-stats',
				body: {
					userIds: [user._id],
					type: 'purchase',
				},
			}).unwrap();

			if (fetchUserStatsError) {
				setIsPurchasing(false);
				return toast.error(
					fetchUserStatsError?.message || 'Failed to fetch user stats',
				);
			}

			if (!userStats?.doc?.canAddLeads) {
				setErrorLeadData(userStats?.doc);
				setIsErrorModalOpen(true);
				return;
			}
			// if (!stats.canAddLeads) {
			// 	setErrorLeadData({
			// 		assignedLeads: stats.assignedLeads || 0,
			// 		pendingApprovals: stats.pendingApprovals || 0,
			// 		totalLeads: stats.totalLeads || 0,
			// 		maxLeadLimit: stats.maxLeadLimit || 0,
			// 	});
			// 	setIsErrorModalOpen(true);
			// 	return;
			// }

			const payload = { leadId, agentId: user._id, approvalStatus: 'pending' };

			await axios.post(constant['baseUrl'] + 'api/adminApproval/add', payload, {
				headers: {
					Authorization:
						localStorage.getItem('token') || sessionStorage.getItem('token'),
				},
			});
			// const approvalResponse = await postApi('api/adminApproval/add', payload);
			// if (approvalResponse.status !== 200) {
			// 	throw new Error('Failed to send lead for approval');
			// }

			const updatedCoins = currentCoins - coinCost;
			const updateResponse = await putApi(`api/user/edit/${user._id}`, {
				coins: updatedCoins,
			});

			if (updateResponse.status === 200) {
				setUserData((prev) => ({ ...prev, coins: updatedCoins }));
				// filter the leads
				refreshBuyLeads(leadId);

				setTotalLeads((prev) => prev - 1);
				toast.success('Lead purchased and sent for approval', {
					position: toast.POSITION.TOP_RIGHT,
					autoClose: 3000,
				});

				// update user activity log
				createUserLog({
					userId: user?._id,
					action: 'PURCHASE',
					entity: 'Lead_Pool',
					enityType: 'Lead',
					entityId: leadId || null,
					status: 'success',
					message: `${user?.fullName} request to purchase the '${lead?.leadName || ''}' lead.`,
					rawPayload: {
						leadId: lead?.intID || null,
					},
				});
			} else {
				throw new Error('Failed to update user coins');
			}
		} catch (error) {
			// console.error('Send Request Error:', error);
			// toast.error(error?.response?.data?.message || 'Failed to purchase lead', {
			// 	position: toast.POSITION.TOP_RIGHT,
			// 	autoClose: 3000,
			// });

			if (error.response?.status === 400) {
				const errorDetails =
					error.response.data?.message || 'Invalid input provided.';
				toast.error(`${errorDetails}`);

				if (errorDetails?.startsWith(`We're sorry`)) {
					setForceRefresh(true);
					debouncedFetchTabData(activeTab, currentPage, pageSize);
				}

				// update user activity log
				createUserLog({
					userId: user?._id,
					action: 'PURCHASE',
					entity: 'Lead_Pool',
					enityType: 'Lead',
					entityId: leadId || null,
					status: 'fail',
					message: `Failed to purchase the lead.`,
				});
			} else {
				console.error('Unexpected error:', error);
				toast.error('Something went wrong!');

				// update user activity log
				createUserLog({
					userId: user?._id,
					action: 'PURCHASE',
					entity: 'Lead_Pool',
					enityType: 'Lead',
					entityId: leadId || null,
					status: 'error',
					message: `Error: Failed to purchase the lead.`,
				});
			}
		} finally {
			setBuyLoading((prev) => ({ ...prev, [leadId]: false }));
			setIsPurchasing(false);
		}
	};

	const cancelRequest = async (id, leadId, userId) => {
		if (isCancelling) return;
		setIsCancelling(true);
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
				},
			);
			if (res.status !== 200)
				throw new Error('Failed to delete approval request');

			const leadResponse = await getApi(`api/lead/view/${leadId}`);
			if (!leadResponse?.data?.lead) throw new Error('Lead not found');

			const userResponse = await getApi(`api/user/view/${userId}`);
			const coinRefund =
				leadResponse.data.lead.eLeadStatus === 'new' ? 300 : 50;
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

				createUserLog({
					userId: user?._id,
					action: 'CANCEL',
					entity: 'Lead_Pool',
					enityType: 'Lead',
					entityId: leadId || null,
					status: 'success',
					message: `${user?.fullName} canceled the request to purchase the '${leadResponse?.data?.lead?.leadName || ''}' lead.`,
					rawPayload: {
						leadId: leadResponse?.data?.lead?.intID || null,
					},
				});
			}
		} catch (error) {
			console.error('Cancel Request Error:', error);
			toast.error(error?.message || 'Unable to cancel request', {
				position: toast.POSITION.TOP_RIGHT,
				autoClose: 3000,
			});

			createUserLog({
				userId: user?._id,
				action: 'CANCEL',
				entity: 'Lead_Pool',
				enityType: 'Lead',
				entityId: leadId || null,
				status: error?.response?.status === 500 ? 'error' : 'fail',
				message: `Failed to cancel the request to purchase the lead from ${user?.fullName}.`,
			});
		} finally {
			setBuyLoading((prev) => ({ ...prev, [id]: false }));
			setIsCancelling(false);
		}
	};

	const debouncedFetchTabData = useCallback(debounce(fetchTabData, 300), [
		user,
		currentState,
		activeTab,
	]);

	const debouncedFetchSearchedData = useCallback(
		debounce(fetchSearchedData, 300),
		[user, activeTab],
	);

	const debouncedFetchAdvancedSearch = useCallback(
		debounce(fetchAdvancedSearch, 300),
		[dateTime, user, activeTab],
	);

	useEffect(() => {
		const newState =
			activeTab === 'Buy Leads' ? 'buy_leads' : activeTab.toLowerCase();
		setCurrentState(newState);
	}, [activeTab]);

	useEffect(() => {
		const { page, size, tab } = getInitialStateFromUrl();
		setCurrentPage(page);
		setPageSize(size);
		setActiveTab(tab);
		fetchUserData();
		fetchTabData(tab, page, size);

		return () => {
			if (cancelTokenRef.current) {
				cancelTokenRef.current.cancel('Component unmounted');
			}
		};
	}, []);

	if (error) return <div>Error: {error}</div>;

	return (
		<>
			<PaginationPage
				data={displaySearchData ? searchedData : data || []}
				totalPages={totalPages}
				totalLeads={totalLeads}
				isLoading={isLoading}
				hasFetched={hasFetched} // Pass hasFetched to Pagination
				fetchData={(tab, page, size) => {
					setIsLoading(true);
					setData([]);
					setActiveTab(tab);
					setCurrentPage(page);
					setPageSize(size);
					updateUrl(page, size, tab);
					setDisplaySearchData(false);
					debouncedFetchTabData(tab, page, size);
				}}
				fetchSearchedData={debouncedFetchSearchedData}
				fetchAdvancedSearch={debouncedFetchAdvancedSearch}
				setCurrentState={setCurrentState}
				currentState={currentState}
				pageSize={pageSize}
				setPageSize={(size) => {
					setPageSize(size);
					updateUrl(currentPage, size, activeTab);
					// setData([]);
					// debouncedFetchTabData(activeTab, currentPage, size);
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
					debouncedFetchTabData(tab, 1, pageSize);
				}}
				currentPage={currentPage}
				setCurrentPage={(page) => {
					setCurrentPage(page);
					updateUrl(page, pageSize, activeTab);
					// setData([]);
					// debouncedFetchTabData(activeTab, page, pageSize);
				}}
				setData={setData}
				setTotalPages={setTotalPages}
				setTotalLeads={setTotalLeads}
				setIsLoading={setIsLoading}
				displaySearchData={displaySearchData}
				setDisplaySearchData={setDisplaySearchData}
				setDisplayAdvSearchData={setDisplayAdvSearchData}
				displayAdvSearchData={displayAdvSearchData}
				userData={userData}
				sendRequest={sendRequest}
				cancelRequest={cancelRequest}
				buyLoading={buyLoading}
				isPurchasing={isPurchasing}
				isCancelling={isCancelling}
				setDateTime={setDateTime}
			/>
			{isErrorModalOpen && (
				<ErrorLeadLimitMessage
					isOpen={isErrorModalOpen}
					onClose={() => setIsErrorModalOpen(false)}
					errorLeadData={errorLeadData}
					type='purchase'
				/>
			)}
		</>
	);
};

export default Index;
