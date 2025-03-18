import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import PaginationPage from './components/Pagination';
import { getApi, postApi, putApi } from 'services/api';
import { constant } from 'constant';
import axios from 'axios';
import { toast } from 'react-toastify';
import ErrorLeadLimitMessage from 'components/Message/ErrorLeadLimitMessage';

const Index = () => {
	const user = JSON.parse(localStorage.getItem('user'));

	const roleName =
		user?.role === 'superAdmin' ? 'superAdmin' : user?.roles[0]?.roleName;

	const location = useLocation();
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
	const [lastFetchedTab, setLastFetchedTab] = useState(null);

	const debounce = (func, delay) => {
		let timeoutId;
		return (...args) => {
			clearTimeout(timeoutId);
			timeoutId = setTimeout(() => func(...args), delay);
		};
	};
	const fetchData = async (pageNo = 1, size = pageSize, source) => {
		if (isLoading) return;
		let isMounted = true;
		setIsLoading(true);
		setError(null);
		try {
			let result;
			if (user.role !== 'superAdmin' && currentState === 'buy_leads') {
				result = await getApi(
					`api/lead/?dateTime=${dateTime?.from}|${dateTime?.to}&page=${pageNo}&pageSize=${size}&isInLeadPool=true&excludeUser=${user._id}&excludeApprovalStatus=pending`,
					null,
					'baseUrl',
					source
				);
			} else {
				result = await axios.get(`${constant.baseUrl}api/adminApproval/get`, {
					headers: {
						Authorization:
							localStorage.getItem('token') || sessionStorage.getItem('token'),
					},
					params: {
						approvalStatus: currentState === 'buy_leads' ? '' : currentState,
						page: pageNo,
						pageSize: size,
						managerId: user?.roles[0]?.roleName === 'Manager' ? user?._id : '',
						agentId: user?.roles[0]?.roleName === 'Agent' ? user?._id : '',
					},
					cancelToken: source?.token,
				});
			}

			let newData = [];
			if (Array.isArray(result.data?.result)) {
				newData = result.data.result;
			} else if (Array.isArray(result.data?.approvals)) {
				newData = result.data.approvals;
			} else {
				console.error('Unexpected response format:', result.data);
				throw new Error('API returned invalid data format');
			}

			newData = newData.map((lead) => {
				if (lead?.ip) {
					const parts = lead.ip.split('-');
					lead.ip = parts?.length > 1 ? parts[1] : parts[0];
				}
				return { ...lead };
			});

			if (isMounted) {
				setData(newData);
				setTotalPages(result.data?.totalPages || 0);
				setTotalLeads(
					result.data?.totalLeads || result.data?.totalApprovals || 0
				);
			}
		} catch (error) {
			if (!axios.isCancel(error)) {
				console.error('Fetch Error:', error);
				if (isMounted) {
					setError(error.message || 'Failed to fetch data');
					setData([]);
					setTotalPages(0);
					setTotalLeads(0);
				}
			}
		} finally {
			if (isMounted) {
				setIsLoading(false);
			}
		}
		return () => {
			isMounted = false;
		};
	};
	const fetchUserData = async () => {
		let isMounted = true;
		setIsLoading(true);
		try {
			const response = await getApi(`api/user/view/${user._id}`);
			if (isMounted) {
				setUserData(response.data);
			}
		} catch (error) {
			console.error('Fetch User Data Error:', error);
			if (isMounted) {
				setUserData(null);
			}
		} finally {
			if (isMounted) {
				setIsLoading(false);
			}
		}
		return () => {
			isMounted = false;
		};
	};

	const fetchLeads = async (
		tab = activeTab,
		page = currentPage,
		size = pageSize
	) => {
		if (isLoading) return;
		let isMounted = true;
		setIsLoading(true);
		setError(null);
		try {
			const queryParams = new URLSearchParams();
			if (tab === 'Buy Leads') {
				// Fetch leads available for purchase (in lead pool, not requested by user)
				queryParams.append('isInLeadPool', 'true');
				queryParams.append('excludeUser', user._id); // Exclude leads already requested by user
			} else {
				const statusMap = {
					Pending: 'pending',
					Rejected: 'rejected',
				};
				const status = statusMap[tab];
				if (!status && tab !== 'Buy Leads') {
					console.error(`Invalid tab value: ${tab}`);
					throw new Error('Invalid tab value');
				}
				if (status) {
					queryParams.append('approvalStatus', status);
					queryParams.append('agentId', user._id); // Show only user's requests
				}
			}
			queryParams.append('page', page);
			queryParams.append('pageSize', size);

			const endpoint =
				tab === 'Buy Leads' ? 'api/lead/' : 'api/adminApproval/get';
			const result = await getApi(`${endpoint}?${queryParams}`);

			let newData = [];
			if (tab === 'Buy Leads') {
				newData = result.data?.result || [];
			} else {
				newData = result.data?.approvals || result.data || [];
			}

			newData = newData.map((lead) => {
				if (lead?.ip) {
					const parts = lead.ip.split('-');
					lead.ip = parts?.length > 1 ? parts[1] : parts[0];
				}
				return { ...lead };
			});

			if (isMounted) {
				setData(newData);
				setTotalPages(result.data?.totalPages || 0);
				setTotalLeads(
					result.data?.totalLeads ||
						result.data?.totalApprovals ||
						newData.length
				);
			}
		} catch (err) {
			console.error('Fetch Leads Error:', err);
			if (isMounted) {
				setError(err.message || 'Failed to fetch leads');
				setData([]);
				setTotalPages(0);
				setTotalLeads(0);
			}
		} finally {
			if (isMounted) {
				setIsLoading(false);
			}
		}
		return () => {
			isMounted = false;
		};
	};

	const fetchSearchedData = async (term = '', pageNo = 1, size = pageSize) => {
		if (isLoading) return;
		let isMounted = true;
		setIsLoading(true);
		setError(null);
		try {
			let result;
			if (activeTab === 'Pending' || activeTab === 'Rejected') {
				// const statusMap = {
				// 	Pending: 'pending',
				// 	Rejected: 'rejected',
				// };
				// const approvalStatus = statusMap[activeTab];
				const queryParams = new URLSearchParams();
				queryParams.append('activeTab', activeTab);
				queryParams.append('agentId', user._id);
				queryParams.append('term', term);
				queryParams.append('page', pageNo);
				queryParams.append('pageSize', size);
				result = await getApi(`api/adminApproval/search?${queryParams}`);

				let newData = result?.data?.result || [];
				// if (newData.length > 0 && term.trim() !== '') {
				// 	newData = newData.filter((lead) =>
				// 		lead.leadName?.toLowerCase().includes(term.toLowerCase())
				// 	);
				// }

				// newData = newData.map((lead) => {
				// 	if (lead?.ip) {
				// 		const parts = lead.ip.split('-');
				// 		lead.ip = parts?.length > 1 ? parts[1] : parts[0];
				// 	}
				// 	return { ...lead };
				// });

				if (isMounted) {
					setDisplaySearchData(true);
					setSearchedData(newData);
					setData(newData);
					setTotalPages(result.data?.totalPages || 0);
					setTotalLeads(result.data?.totalLeads || 0);
				}
			} else if (activeTab === 'Buy Leads') {
				// Search within available leads for purchase
				result = await getApi(
					`api/lead/search?term=${term}&dateTime=${dateTime?.from}|${dateTime?.to}&page=${pageNo}&pageSize=${size}
          &role=${roleName}&isInLeadPool=true&excludeUser=${user._id}`
				);

				const newData =
					result.data?.result?.map((lead) => {
						if (lead?.ip) {
							const parts = lead.ip.split('-');
							lead.ip = parts?.length > 1 ? parts[1] : parts[0];
						}
						return { ...lead, agentId: lead.agentAssigned };
					}) || [];

				if (isMounted) {
					setDisplaySearchData(true);
					setSearchedData(newData);
					setData(newData);
					setTotalPages(result.data?.totalPages || 0);
					setTotalLeads(result.data?.totalLeads || newData.length);
				}
			}
		} catch (err) {
			console.error('Fetch Searched Data Error:', err);
			if (isMounted) {
				setError(err.message || 'Failed to fetch searched leads');
				setData([]);
				setTotalPages(0);
				setTotalLeads(0);
			}
		} finally {
			if (isMounted) {
				setIsLoading(false);
			}
		}
		return () => {
			isMounted = false;
		};
	};

	const fetchAdvancedSearch = async (
		data = {},
		pageNo = 1,
		size = pageSize
	) => {
		if (isLoading) return;
		let isMounted = true;
		setIsLoading(true);
		setError(null);
		try {
			let result = await getApi(
				activeTab === 'Buy Leads'
					? `api/lead/v2/advanced-search?data=${JSON.stringify(data)}&dateTime=${dateTime?.from}|${dateTime?.to}
          &page=${pageNo}&role=${roleName}&pageSize=${size}&isInLeadPool=true&excludeUser=${user._id}`
					: `api/adminApproval/advanced-search?data=${JSON.stringify(data)}&agentId=${user._id}&activeTab=${activeTab}&page=${pageNo}&pageSize=${size}`
			);

			const newData =
				(activeTab === 'Buy Leads'
					? result.data?.result
					: result.data?.result || result.data
				)?.map((lead) => {
					if (lead?.ip) {
						const parts = lead.ip.split('-');
						lead.ip = parts?.length > 1 ? parts[1] : parts[0];
					}
					return { ...lead, agentId: lead.agentAssigned };
				}) || [];

			if (isMounted) {
				setDisplaySearchData(true);
				setSearchedData(newData);
				setData(newData);
				setTotalPages(result.data?.totalPages || 0);
				setTotalLeads(result.data?.totalLeads || newData.length);
			}
		} catch (err) {
			console.error('Fetch Advanced Search Error:', err);
			if (isMounted) {
				setError(err.message || 'Failed to fetch advanced search leads');
				setData([]);
				setTotalPages(0);
				setTotalLeads(0);
			}
		} finally {
			if (isMounted) {
				setIsLoading(false);
			}
		}
		return () => {
			isMounted = false;
		};
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
		let isMounted = true;
		setBuyLoading((prev) => ({ ...prev, [leadId]: true }));

		try {
			const stats = await fetchAgentLeadsSats(user._id);
			if (!stats.canAddLeads) {
				if (!stats || typeof stats !== 'object') {
					console.error('Invalid stats object:', stats);
					toast.error('Failed to retrieve lead stats', {
						position: toast.POSITION.TOP_RIGHT,
						autoClose: 3000,
					});
					return;
				}
				setErrorLeadData({
					assignedLeads: stats.assignedLeads || 0,
					pendingApprovals: stats.pendingApprovals || 0,
					totalLeads: stats.totalLeads || 0,
					maxLeadLimit: stats.maxLeadLimit || 0,
				});
				setIsErrorModalOpen(true);
				return;
			}

			let payload = {
				leadId,
				agentId: user._id,
				approvalStatus: 'pending',
			};

			const approvalResponse = await postApi('api/adminApproval/add', payload);
			if (approvalResponse.status !== 200) {
				throw new Error('Failed to send lead for approval');
			}

			const userResponse = await getApi(`api/user/view/${user._id}`);
			const lead = data.find((l) => l._id === leadId);
			const coinCost = lead?.leadStatus === 'new' ? 300 : 50;
			const currentCoins = userResponse?.data?.coins || 0;
			const updatedCoins = currentCoins - coinCost;

			if (updatedCoins < 0) {
				throw new Error('Insufficient coins to purchase this lead');
			}

			const updateResponse = await putApi(`api/user/edit/${user._id}`, {
				coins: updatedCoins,
			});

			if (updateResponse.status === 200 && isMounted) {
				setUserData((prev) => ({ ...prev, coins: updatedCoins }));
				const updatedData = data.filter((lead) => lead._id !== leadId);
				setData(updatedData);
				setTotalLeads((prev) => prev - 1);
				toast.success('Lead purchased and sent for approval', {
					position: toast.POSITION.TOP_RIGHT,
					autoClose: 3000,
				});
			}
		} catch (error) {
			console.error('Send Request Error:', error);
			if (isMounted) {
				toast.error(error.message || 'Failed to purchase lead', {
					position: toast.POSITION.TOP_RIGHT,
					autoClose: 3000,
				});
			}
		} finally {
			if (isMounted) {
				setBuyLoading((prev) => ({ ...prev, [leadId]: false }));
			}
		}

		return () => {
			isMounted = false;
		};
	};

	const cancelRequest = async (id, leadId, userId) => {
		let isMounted = true;
		setBuyLoading((prev) => ({ ...prev, [id]: true }));

		try {
			if (!leadId || !userId) {
				console.error('leadId or userId is missing:', { leadId, userId });
				toast.error('Error: Lead ID or User ID is missing.');
				return;
			}

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

			if (res.status !== 200) {
				throw new Error('Failed to delete approval request');
			}

			const leadResponse = await getApi(`api/lead/view/${leadId}`);
			if (!leadResponse?.data?.lead) {
				console.error('Lead not found:', leadId);
				throw new Error('Lead not found');
			}

			const userResponse = await getApi(`api/user/view/${userId}`);
			if (!userResponse?.data) {
				console.error('User not found:', userId);
			}

			const coinRefund = leadResponse.data.lead.leadStatus === 'new' ? 300 : 50;
			const currentCoins = userResponse.data.coins || 0;
			const updatedCoins = currentCoins + coinRefund;

			const updateResponse = await putApi(`api/user/edit/${userId}`, {
				coins: updatedCoins,
			});

			if (updateResponse.status === 200 && isMounted) {
				setUserData((prev) => ({ ...prev, coins: updatedCoins }));
				const updatedData = data.filter((lead) => lead._id !== id);
				setData(updatedData);
				setTotalLeads((prev) => prev - 1);
				toast.success('Request canceled successfully. Coins refunded.', {
					position: toast.POSITION.TOP_RIGHT,
					autoClose: 3000,
				});
			}
		} catch (error) {
			console.error('Cancel Request Error:', error);
			if (isMounted) {
				toast.error(error.message || 'Unable to cancel request', {
					position: toast.POSITION.TOP_RIGHT,
					autoClose: 3000,
				});
			}
		} finally {
			if (isMounted) {
				setBuyLoading((prev) => ({ ...prev, [id]: false }));
			}
		}

		return () => {
			isMounted = false;
		};
	};

	const debouncedFetchData = useCallback(debounce(fetchData, 300), [
		dateTime,
		user,
		currentState,
	]);
	const debouncedFetchLeads = useCallback(debounce(fetchLeads, 300), [user]);
	const debouncedFetchSearchedData = useCallback(
		debounce(fetchSearchedData, 300),
		[dateTime, user, activeTab]
	);
	const debouncedFetchAdvancedSearch = useCallback(
		debounce(fetchAdvancedSearch, 300),
		[dateTime, user]
	);

	useEffect(() => {
		if (!displaySearchData && activeTab !== lastFetchedTab) {
			setCurrentPage(1);
			if (activeTab === 'Buy Leads') {
				debouncedFetchData(1, pageSize); // Fetch available leads
			} else {
				debouncedFetchLeads(activeTab, 1, pageSize); // Fetch user's requests
			}
			setLastFetchedTab(activeTab);
		}
	}, [
		activeTab,
		pageSize,
		displaySearchData,
		debouncedFetchData,
		debouncedFetchLeads,
		lastFetchedTab,
	]);

	useEffect(() => {
		const source = axios.CancelToken.source();
		setCurrentPage(1);
		setPageSize(50);
		setActiveTab('Buy Leads'); // Default to "Buy Leads"
		setDisplaySearchData(false);
		setData([]);
		setTotalPages(0);
		setTotalLeads(0);
		setError(null);
		setLastFetchedTab(null);
		setBuyLoading({});

		fetchUserData();
		debouncedFetchData(1, 50, source);

		return () => {
			source.cancel('Component unmounted');
		};
	}, [location.pathname]);

	if (error) {
		return <div>Error: {error}</div>;
	}

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
					if (tab === 'Buy Leads') {
						setDateTime({ from: '', to: '' });
						setDisplaySearchData(false);
						debouncedFetchData(page, size);
					} else {
						debouncedFetchLeads(tab, page, size);
					}
					setLastFetchedTab(tab);
				}}
				fetchSearchedData={debouncedFetchSearchedData}
				fetchAdvancedSearch={debouncedFetchAdvancedSearch}
				setCurrentState={setCurrentState}
				currentState={currentState}
				pageSize={pageSize}
				setPageSize={setPageSize}
				user={user}
				dateTime={dateTime}
				activeTab={activeTab}
				setActiveTab={setActiveTab}
				currentPage={currentPage}
				setCurrentPage={setCurrentPage}
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
