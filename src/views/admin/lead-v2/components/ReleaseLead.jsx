import { Button, Spinner } from '@chakra-ui/react';
import ReleaseLeadModal from 'components/Permission/ReleaseLeadModal';
import { useState } from 'react';
import { RiUserUnfollowLine } from 'react-icons/ri';
import { toast } from 'react-toastify';
import { putApi } from 'services/api';

const ReleaseLead = ({
	isReleased,
	role,
	leadId,
	as: Component = Button,
	refreshData,
}) => {
	const shouldRenderButton =
		(isReleased && role === 'Manager') || role === 'Agent';

	const [isLoading, setIsLoading] = useState(false);
	const [isOpen, setIsOpen] = useState(false);

	const handleRelease = async () => {
		try {
			setIsLoading(true);
			await putApi(`api/lead/release/${leadId}`);
			toast.success('Lead released successfully');
			refreshData();
		} catch (error) {
			console.error(error);
			toast.error('Failed to release lead' || error.data.message);
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
