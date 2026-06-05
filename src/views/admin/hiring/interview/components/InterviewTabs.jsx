import {
	Tabs,
	TabList,
	Tab,
	TabPanels,
	TabPanel,
	Box,
	HStack,
	Text,
} from '@chakra-ui/react';
import { LuUsers, LuFileText, LuCheckSquare } from 'react-icons/lu';
import SelectInterviewers from './SelectInterviewers';
import HiringInfo from './HiringInfo';
import EvaluationPoints from './EvaluationPoints';
import { toast } from 'react-toastify';
import { memo, useEffect, useMemo, useState } from 'react';
import { useUpdateItemMutation } from 'api/apiSlice';
import { useNavigate } from 'react-router-dom';
import { useFetchItemsQuery } from 'api/apiSlice';
import Loader from 'components/loading/Loader';
import { useModalColors } from 'hooks/useModalColors';

const InterviewTabs = memo(
	({
		handleTabChange,
		interview,
		user,
		activeTabIndex,
		isLeadInterviewer,
		isCreatedBy,
		interviewRefetch,
		setInterviewersSelected,
		isInterviewerSubmittedPoints,
	}) => {
		const colors = useModalColors();
		const [hiringData, setHiringData] = useState();
		const [updateItemMutation, { isLoading: updatingInterview }] =
			useUpdateItemMutation();

		const userRole = user?.roles[0]?.roleName || user?.role;

		const [loading, setLoading] = useState(false);

		useEffect(() => {
			if (loading) {
				const timer = setTimeout(() => {
					setLoading(false);
				}, 2000);
				return () => clearTimeout(timer);
			}
		}, [loading]);

		const { data: positionOptions, isLoading: positionsLoading } =
			useFetchItemsQuery(
				{
					path: `/positions/options`,
				},
				{ refetchOnMountOrArgChange: true }
			);

		const isInvitedInterviewer = useMemo(
			() =>
				interview?.isMultiRound
					? interview?.nextRound?.totalInterviewers > 0
					: interview?.totalInterviewers > 0,
			[
				interview?.isMultiRound,
				interview?.nextRound?.totalInterviewers,
				interview?.totalInterviewers,
			]
		);

		const navigate = useNavigate();

		const handleSubmit = async (data) => {
			try {
				let hiringInfo = {};

				hiringInfo = {
					jobType: data.jobType,
					position: data.position,
					interviewNote: hiringData.interviewNote,
				};

				hiringInfo.amount = data.jobType === 'Commission' ? null : data.amount;
				hiringInfo.commission =
					data.jobType === 'Salary' ? null : data.commission;
				hiringInfo.incentive = data.incentive || null;

				hiringInfo.isNextRound = data.isNextRound;

				await updateItemMutation({
					path: `/interviews/${interview._id}`,
					body: { hiringData: hiringInfo },
				}).unwrap();

				toast.success('Interview updated successfully');

				const redirectUrl = hiringInfo.isNextRound
					? `/hiring/multi-round`
					: isLeadInterviewer
						? `/hiring/interviewed-candidates`
						: ['superAdmin', 'HR'].includes(userRole)
							? '/hiring/dasboard'
							: '/';

				navigate(redirectUrl);
			} catch (error) {
				toast.error(error?.data?.message || 'Failed to update interview data');
			}
		};

		// Helper function to get tab text color
		const getTabTextColor = (index, isDisabled) => {
			if (activeTabIndex === index) return colors.headerText;
			if (isDisabled) return colors.mutedText;
			return colors.bodyText;
		};

		return positionsLoading || loading ? (
			<Loader />
		) : (
			<Box
				display='flex'
				bg={colors.bg}
				p={{ base: 4, lg: 8 }}
				rounded='md'
				shadow={colors.cardShadow}
				justifyContent='center'
				width='full'
				alignItems='center'
				border="1px solid"
				borderColor={colors.borderColor}
			>
				{isLeadInterviewer ? (
					<Tabs
						index={activeTabIndex}
						onChange={handleTabChange}
						width={{ base: 'full', md: '700px' }}
						variant="unstyled"
					>
						<TabList
							bg={colors.bgInput}
							width='full'
							mx='auto'
							py={{ base: '1', md: '2' }}
							px={{ base: '2', md: '4' }}
							rounded='lg'
							display='flex'
							flexDirection={{ base: 'column', sm: 'row' }}
							gap={{ base: '1', sm: '2' }}
						>
							<Tab
								isDisabled={isInvitedInterviewer}
								px={4}
								py={2}
								rounded='md'
								fontSize={{ base: 'xs', sm: 'sm', md: 'md' }}
								fontWeight="medium"
								transition="all 0.2s"
								bg={activeTabIndex === 0 ? colors.accentGold : 'transparent'}
								_hover={{
									bg: activeTabIndex === 0 ? colors.goldLight : colors.bgInputHover,
								}}
								_disabled={{
									opacity: 0.6,
									cursor: 'not-allowed',
								}}
							>
								<HStack spacing={{ base: '1', md: '2' }}>
									<Box
										as={LuUsers}
										fontSize={{ base: '14px', sm: '16px', md: '18px' }}
										color={getTabTextColor(0, isInvitedInterviewer)}
									/>
									<Text
										whiteSpace='nowrap'
										color={getTabTextColor(0, isInvitedInterviewer)}
									>
										Select Interviewers
									</Text>
								</HStack>
							</Tab>

							<Tab
								isDisabled={!isInvitedInterviewer || isInterviewerSubmittedPoints}
								px={4}
								py={2}
								rounded='md'
								fontSize={{ base: 'xs', sm: 'sm', md: 'md' }}
								fontWeight="medium"
								transition="all 0.2s"
								bg={activeTabIndex === 1 ? colors.accentGold : 'transparent'}
								_hover={{
									bg: activeTabIndex === 1 ? colors.goldLight : colors.bgInputHover,
								}}
								_disabled={{
									opacity: 0.6,
									cursor: 'not-allowed',
								}}
							>
								<HStack spacing={{ base: '1', md: '2' }}>
									<Box
										as={LuCheckSquare}
										fontSize={{ base: '14px', sm: '16px', md: '18px' }}
										color={getTabTextColor(1, !isInvitedInterviewer || isInterviewerSubmittedPoints)}
									/>
									<Text
										whiteSpace='nowrap'
										color={getTabTextColor(1, !isInvitedInterviewer || isInterviewerSubmittedPoints)}
									>
										Evaluation Points
									</Text>
								</HStack>
							</Tab>

							<Tab
								isDisabled={!isInvitedInterviewer || !isInterviewerSubmittedPoints}
								px={4}
								py={2}
								rounded='md'
								fontSize={{ base: 'xs', sm: 'sm', md: 'md' }}
								fontWeight="medium"
								transition="all 0.2s"
								bg={activeTabIndex === 2 ? colors.accentGold : 'transparent'}
								_hover={{
									bg: activeTabIndex === 2 ? colors.goldLight : colors.bgInputHover,
								}}
								_disabled={{
									opacity: 0.6,
									cursor: 'not-allowed',
								}}
							>
								<HStack spacing={{ base: '1', md: '2' }}>
									<Box
										as={LuFileText}
										fontSize={{ base: '14px', sm: '16px', md: '18px' }}
										color={getTabTextColor(2, !isInvitedInterviewer || !isInterviewerSubmittedPoints)}
									/>
									<Text
										whiteSpace='nowrap'
										color={getTabTextColor(2, !isInvitedInterviewer || !isInterviewerSubmittedPoints)}
									>
										Hiring Info
									</Text>
								</HStack>
							</Tab>
						</TabList>

						<TabPanels p={{ base: 4, md: 8 }} width={{ base: '100%', md: '700px' }} mx='auto'>
							<TabPanel p={{ base: 4, md: 8 }}>
								<SelectInterviewers
									user={user}
									interview={interview}
									interviewRefetch={interviewRefetch}
									setInterviewersSelected={setInterviewersSelected}
									handleTabChange={handleTabChange}
									isInvitedInterviewer={isInvitedInterviewer}
									setLoading={setLoading}
								/>
							</TabPanel>

							<TabPanel p={{ base: 4, md: 8 }}>
								<EvaluationPoints
									interview={interview}
									isLeadInterviewer={isLeadInterviewer}
									handleTabChange={handleTabChange}
									interviewRefetch={interviewRefetch}
									isInterviewerSubmittedPoints={isInterviewerSubmittedPoints}
								/>
							</TabPanel>

							<TabPanel p={{ base: 4, md: 8 }}>
								<HiringInfo
									interview={interview}
									hiringData={hiringData}
									setHiringData={setHiringData}
									onSubmit={handleSubmit}
									positionOptions={positionOptions?.doc}
									updatingInterview={updatingInterview}
								/>
							</TabPanel>
						</TabPanels>
					</Tabs>
				) : (
					<Box
						width={{ base: '100%', md: '700px' }}
						bg={colors.bgInput}
						p={{ base: 4, md: 8 }}
						mx='auto'
						rounded='md'
						border="1px solid"
						borderColor={colors.borderColor}
					>
						<EvaluationPoints
							interview={interview}
							isLeadInterviewer={isLeadInterviewer}
							handleTabChange={handleTabChange}
							interviewRefetch={interviewRefetch}
							isInterviewerSubmittedPoints={isInterviewerSubmittedPoints}
						/>
					</Box>
				)}
			</Box>
		);
	}
);

export default InterviewTabs;