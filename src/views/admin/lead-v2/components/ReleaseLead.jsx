import { Button, Spinner } from '@chakra-ui/react';
import ReleaseLeadModal from 'components/Permission/ReleaseLeadModal';
import { useUserActivityLog } from 'hooks/useUserActivityLog';
import useUserSession from 'hooks/useUserSession';
import { useState } from 'react';
import { RiUserUnfollowLine } from 'react-icons/ri';
import { toast } from 'react-toastify';
import { putApi } from 'services/api';

const ReleaseLead = ({
	isReleased,
	role,
	leadId,
	lead,
	as: Component = Button,
	refreshData,
}) => {
	const shouldRenderButton =
		(isReleased && role === 'Manager') || role === 'Agent';

	const { user } = useUserSession();
	const { createUserLog } = useUserActivityLog();

	const [isLoading, setIsLoading] = useState(false);
	const [isOpen, setIsOpen] = useState(false);

	const handleRelease = async () => {
		try {
			setIsLoading(true);
			await putApi(`api/lead/release/${leadId}`);
			toast.success('Lead released successfully');
			refreshData();

			// update user activity log
			createUserLog({
				userId: user?._id,
				action: 'RELEASE',
				entity: 'Lead',
				enityType: 'Lead',
				entityId: leadId || null,
				status: 'success',
				message: `${user?.fullName} released the lead "${lead?.leadName}".`,
				rawPayload: {
					leadId: lead?.intID || null,
				},
			});
		} catch (error) {
			console.error(error);
			const errorMsg = error.data.message || 'Failed to release lead';
			toast.error(errorMsg);

			// update user activity log
			createUserLog({
				userId: user?._id,
				action: 'RELEASE',
				entity: 'Lead',
				enityType: 'Lead',
				entityId: leadId || null,
				status: error?.data?.status === 500 ? 'error' : 'fail',
				message: `${user?.fullName} attempted to release the lead "${lead?.leadName}", but the process failed.`,
				rawPayload: {
					leadId: lead?.intID || null,
				},
			});
		} finally {
			setIsLoading(false);
		}
	};

	return shouldRenderButton ? (
		<>
			{isOpen && (
				<ReleaseLeadModal
					isOpen={isOpen}
					onClose={() => setIsOpen(false)}
					onConfirm={handleRelease}
				/>
			)}
			<Component
				onClick={() => setIsOpen(true)}
				isDisabled={isLoading}
				icon={<RiUserUnfollowLine fontSize={15} />}
				color='brand.400'
			>
				{isLoading ? <Spinner size='sm' /> : 'Release'}
			</Component>
		</>
	) : null;
};

export default ReleaseLead;
