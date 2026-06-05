import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalCloseButton,
	Button,
	Grid,
	Spinner,
	HStack,
	Box,
	Stack,
	ModalFooter,
	Text,
	useDisclosure,
} from '@chakra-ui/react';
import ExperienceDetails from './ExperienceDetails';
import DisplayField from 'components/displays/DisplayField';
import ApplicationStatus from './ApplicationStatus';
import { useUpdateItemMutation } from 'api/apiSlice';
import { toast } from 'react-toastify';
import { useState } from 'react';
import { format } from 'date-fns';
import StatusBadge from 'components/shared/StatusBadge';
import EditCandidate from './EditCandidate';
import { FiEdit } from 'react-icons/fi';
import { buttonStyle } from 'utils/btn';
import useUserSession from 'hooks/useUserSession';
import { useUserActivityLog } from 'hooks/useUserActivityLog';
import { FaClockRotateLeft } from 'react-icons/fa6';
import CandidateStatusHistory from '../../_components/CandidateStatusHistory';
import { useModalColors } from 'hooks/useModalColors';
import { sendHiringMetaFeedback } from 'api';

const CandidateView = ({
	isOpen,
	onClose,
	candidate,
	onViewCV,
	onDownloadCV,
	refetch,
	missingFiles,
}) => {
	const [newStatus, setNewStatus] = useState(candidate.status);
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);

	const [updateItemMutation, { isLoading }] = useUpdateItemMutation();

	const { user } = useUserSession();
	const { createUserLog } = useUserActivityLog();

	const colors = useModalColors();

	const {
		isOpen: isApplicationHistoryOpen,
		onOpen: onApplicationHistoryOpen,
		onClose: onApplicationHistoryClose,
	} = useDisclosure();

	const handleApplicationStatus = async () => {
		try {
			await updateItemMutation({
				path: `/applications/status/${candidate._id}`,
				body: { status: newStatus },
			}).unwrap();

			refetch();
			onClose();
			toast.success('Application status successfully updated');

			createUserLog({
				userId: user?._id,
				action: 'UPDATE',
				entity: 'Hiring',
				entityType: 'Application',
				entityId: candidate._id,
				status: 'success',
				message: `${user?.fullName} changed the candidate’s application status to "${newStatus}".`,
			});

			// send hiring meta feedback converstion api
			sendHiringMetaFeedback({ ...candidate, status: newStatus });
		} catch (error) {
			const errorMsg = error?.data?.message || 'Application status not updated';
			toast.error(errorMsg);

			createUserLog({
				userId: user?._id,
				action: 'UPDATE',
				entity: 'Hiring',
				entityType: 'Application',
				entityId: candidate._id,
				status: error?.status === '500' ? 'error' : 'fail',
				message: errorMsg,
			});
		}
	};

	return (
		<>
			<Modal isOpen={isOpen} onClose={onClose} isCentered size='4xl'>
				<ModalOverlay bg={colors.overlayBg} backdropFilter='blur(2px)' />
				<ModalContent mx='2' borderRadius='xl' boxShadow={colors.modalShadow}>
			<ModalHeader
  display='flex'
  gap='2'
  bg={colors.viewHeaderBg}
  color={colors.viewHeaderText}
  borderBottom={`1px solid ${colors.viewHeaderBorder}`}
  borderTopRadius='xl'
  py={4}
  alignItems='center'
  w='100%'
>
  <Stack
    flexDir={{ base: 'column', md: 'row' }}
    align={{ base: 'flex-start', md: 'center' }}
    gap='4'
  >
    <HStack>
      <Text color={colors.viewHeaderText}>Application</Text>
      {candidate?.isInterviewed && (
        <StatusBadge status='Interviewed' color='green' />
      )}
    </HStack>

    <HStack spacing={2} mt={{ base: 2, md: 0 }} ml='auto'>
      <Button
        py='2'
        px='4'
variant='outline'
		leftIcon={<FiEdit />}
        onClick={() => setIsEditModalOpen(true)}
      >
        Edit
      </Button>

      <Button
        py='2'
        px='4'
        leftIcon={<FaClockRotateLeft />}
        onClick={onApplicationHistoryOpen}
variant='outline'
>
        History
      </Button>
    </HStack>
  </Stack>
</ModalHeader>

<ModalCloseButton
  color={colors.bodyText}
  _hover={{ color: colors.accentGold, bg: colors.secondaryBtnHoverBg }}
/>
					<ModalBody bg={colors.viewBg} width='100%' p={4} >
						<Box  overflow='scroll'  height='60vh' p='4'>
							<Grid
								templateColumns={{
									base: '1fr',
									md: 'repeat(2, 1fr)',
									lg: candidate.invited ? 'repeat(3, 1fr)' : 'repeat(2, 1fr)',
								}}
								gap={3}
							>
								<DisplayField
									label='Name'
									value={candidate?.name}
									textTransform='capitalize'
								/>
								<DisplayField label='Date of Birth' value={candidate?.dob} />
								<DisplayField label='Email' value={candidate?.email} />
								<DisplayField label='Phone' value={candidate?.phone} />
								<DisplayField label='Gender' value={candidate?.gender} />
								<DisplayField label='Visa Type' value={candidate?.visaType} />
								<DisplayField label='WhatsApp' value={candidate?.whatsApp} />
								<DisplayField
									label='Nationality'
									value={candidate?.nationality}
								/>
								<DisplayField
									label='Driving License'
									value={candidate?.drivingLice ? 'Yes' : 'No'}
								/>
								<DisplayField
									label='Experience Years'
									value={
										candidate?.experienceYears > 9
											? 'More then 9 Years'
											: `${candidate?.experienceYears} ${candidate?.experienceYears > 1 ? 'Years' : 'Year'}`
									}
								/>
								<DisplayField
									label='Applying for'
									value={candidate?.position.name}
								/>
								<DisplayField
									label='English Level'
									value={candidate?.engLangLevel || 'N/A'}
								/>
								<DisplayField
									label='Agency'
									value={candidate?.agency?.name || 'N/A'}
								/>
								<DisplayField
									label='Source'
									value={candidate?.source || 'N/A'}
								/>

								{candidate.invited && (
									<>
										<DisplayField
											label='Intivite Status'
											value={candidate?.inviteAccepted ? 'Accepted' : 'Pending'}
										/>
										<DisplayField
											label='Interview Date'
											value={format(
												new Date(candidate?.interviewDate),
												'MMM d, yyyy'
											)}
										/>

										<DisplayField
											label='Interview Time'
											value={candidate?.interviewTime}
										/>
										<DisplayField
											label='Candidate Status'
											value={candidate?.status}
										/>
									</>
								)}
							</Grid>
							<ExperienceDetails experience={candidate?.experience} />
						</Box>


					</ModalBody>
					<ModalFooter
  bg={colors.viewFooterBg}
  borderTop={`1px solid ${colors.viewFooterBorder}`}
  gap={3}
  py={4}
>
  <Button
    onClick={() => onViewCV(candidate?.resume)}
    bg={colors.accentGold}
    color={colors.headerText}
    width='100%'
    rounded='md'
    _hover={{
      bg: colors.goldLight,
    }}
    _active={{
      bg: colors.goldDark,
    }}
    disabled={missingFiles.includes(candidate?.resume)}
  >
    View CV
  </Button>

  <Button
    onClick={() => onDownloadCV(candidate?.resume)}
    bg={colors.accentGold}
    color={colors.headerText}
    width='100%'
    rounded='md'
    _hover={{
      bg: colors.goldLight,
    }}
    _active={{
      bg: colors.goldDark,
    }}
    disabled={missingFiles.includes(candidate?.resume)}
  >
    Download CV
  </Button>
</ModalFooter>
					{!candidate.invited && (
						<HStack
							justifyContent='space-between'
							alignItems='end'
							spacing={2}
							flexDir={{ base: 'column', md: 'row' }}
							pb='4'
							px='4'
							mt={2}
						>
							<ApplicationStatus
								candidate={candidate}
								newStatus={newStatus}
								setNewStatus={setNewStatus}
							/>

							<div>
								<Button
									variant='ghost'
									onClick={onClose}
									size='sm'
									rounded='md'
									mr={2}
									color={colors.bodyText}
									_hover={{
										bg: colors.secondaryBtnHoverBg,
										color: colors.headingText,
									}}
								>
									Cancel
								</Button>
								<Button
									bg={colors.accentGold}
									color={colors.headerText}
									_hover={{
										bg: colors.goldLight,
									}}
									_active={{
										bg: colors.goldDark,
									}}
									size='sm'
									rounded='md'
									disabled={
										candidate.status === 'Eligible' && candidate.inviteAccepted
									}
									onClick={handleApplicationStatus}
								>
									{isLoading ? <Spinner color={colors.headerText} /> : 'Save'}
								</Button>
							</div>
						</HStack>
					)}
				</ModalContent>
			</Modal>

			{isEditModalOpen && (
				<EditCandidate
					isOpen={isEditModalOpen}
					onClose={() => {
						setIsEditModalOpen(false);
						onClose();
					}}
					candidate={candidate}
					refetch={refetch}
				/>
			)}

			{isApplicationHistoryOpen && (
				<CandidateStatusHistory
					isOpen={isApplicationHistoryOpen}
					onClose={onApplicationHistoryClose}
					candidate={candidate}
				/>
			)}
		</>
	);
};

export default CandidateView;