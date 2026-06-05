import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalFooter,
	ModalCloseButton,
	Button,
	Select,
	FormLabel,
} from '@chakra-ui/react';
import { useFetchItemsQuery } from 'api/apiSlice';
import { buttonStyle } from '../../constants';
import { useModalColors } from 'hooks/useModalColors';

const AgencyFilter = ({
	isOpen,
	onClose,
	handleApplyFilter,
	selectedAgency,
	setSelectedAgency,
}) => {
	const { data: agencies } = useFetchItemsQuery({ path: '/agencies' });
	const colors = useModalColors();

	const handleChange = (e) => {
		const selectedId = e.target.value;
		setSelectedAgency(
			agencies?.doc?.find((agency) => agency._id === selectedId) || null
		);
	};

	return (
		<>
			<Modal isOpen={isOpen} onClose={onClose} size='md' isCentered>
				<ModalOverlay bg={colors.overlayBg} backdropFilter='blur(2px)' />
				<ModalContent mx='2' borderRadius='xl' boxShadow={colors.modalShadow} bg={colors.bg}>
					<ModalHeader
						display='flex'
						gap='2'
						bg={colors.headerBg}
						color={colors.headerText}
						borderTopRadius='xl'
						py={4}
						px={6}
						alignItems='center'
						w='100%'
					>
						Agency Filter
					</ModalHeader>
					<ModalCloseButton
						color={colors.closeBtnColor}
						_hover={{ bg: colors.closeBtnHoverBg }}
					/>
					<ModalBody>
						<FormLabel fontSize='md' color={colors.labelColor}>Select Agency</FormLabel>
						<Select
							value={selectedAgency?._id ?? ''}
							onChange={handleChange}
							bg={colors.bgInput}
							borderColor={colors.borderColor}
							color={colors.headingText}
							_hover={{ borderColor: colors.accentGold }}
							_focus={{
								borderColor: colors.accentGold,
								boxShadow: `0 0 0 1px ${colors.accentGold}`,
							}}
						>
							<option value='' style={{ background: colors.bg, color: colors.headingText }}>All</option>
							{agencies?.doc?.map((agency) => (
								<option key={agency._id} value={agency._id} style={{ background: colors.bg, color: colors.headingText }}>
									{agency.name}
								</option>
							))}
						</Select>
					</ModalBody>
					<ModalFooter
						bg={colors.footerBg}
						borderTop={`1px solid ${colors.borderColor}`}
						gap={3}
						py={4}
					>
						<Button
							{...buttonStyle}
							variant='ghost'
							py='5'
							px='8'
							mr='3'
							fontSize='lg'
							aria-label='close'
							onClick={onClose}
							color={colors.bodyText}
							_hover={{
								bg: colors.secondaryBtnHoverBg,
								color: colors.headingText,
							}}
						>
							Close
						</Button>
						<Button
							{...buttonStyle}
							bg={colors.accentGold}
							color={colors.headerText}
							py='5'
							px='8'
							fontSize='lg'
							aria-label='update'
							onClick={() => handleApplyFilter(selectedAgency?._id)}
							_hover={{
								bg: colors.goldLight,
								transform: 'translateY(-1px)',
								boxShadow: colors.goldGlow,
							}}
							_active={{ bg: colors.goldDark }}
							transition='all 0.2s ease'
						>
							Apply
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
};

export default AgencyFilter;