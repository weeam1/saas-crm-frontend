import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalFooter,
	ModalBody,
	Button,
	Box,
	IconButton,
	Textarea,
	Flex,
} from '@chakra-ui/react';
import { EditIcon, CheckIcon, CloseIcon } from '@chakra-ui/icons';
import { useState, useEffect } from 'react';
import { useModalColors } from 'hooks/useModalColors';
import { useUpdateItemMutation } from 'api/apiSlice';
import { toast } from 'react-toastify';

const InterviewNoteView = ({
	title,
	message,
	isOpen,
	onClose,
	interviewId,
	mode = 'view',
	interviewRefetch,
}) => {
	const colors = useModalColors();

	const [isEditing, setIsEditing] = useState(false);
	const [note, setNote] = useState(message);

	const [updateItemMutation, { isLoading }] = useUpdateItemMutation();

	useEffect(() => {
		if (mode === 'add') {
			setNote('');
			setIsEditing(true);
		} else {
			setNote(message);
			setIsEditing(false);
		}
	}, [message, isOpen]);

	const handleSave = async () => {
		try {
			if (note === message) {
				setIsEditing(false);
				return;
			}
			await updateItemMutation({
				path: `/interviews/note/${interviewId}`,
				body: { interviewNote: note },
			}).unwrap();

			setIsEditing(false);
			interviewRefetch();
			toast.success('Note updated successfully');
		} catch (err) {
			console.error(err);
			toast.error(err?.data?.message || 'Failed to updated the note!');
		}
	};

	return (
		<Modal isOpen={isOpen} onClose={onClose} size='2xl' isCentered>
			<ModalOverlay bg={colors.overlayBg} backdropFilter='blur(2px)' />
			<ModalContent mx='2' borderRadius='xl' boxShadow={colors.modalShadow} bg={colors.bg}>
				<ModalHeader
					display='flex'
					justifyContent='space-between'
					alignItems='center'
					bg={colors.headerBg}
					color={colors.headerText}
					borderTopRadius='xl'
					py={4}
					px={6}
				>
					{title}
<Flex gap={2}>
  {!isEditing ? (
    <IconButton
      icon={<EditIcon />}
      size='sm'
      onClick={() => setIsEditing(true)}
      aria-label='Edit note'
      variant='ghost'
      color={colors.closeBtnColor}
      _hover={{
        bg: colors.closeBtnHoverBg,
        transform: 'scale(1.05)',
      }}
      transition='all 0.2s ease'
    />
  ) : (
    <>
      <IconButton
        icon={<CheckIcon />}
        size='sm'
        onClick={handleSave}
        aria-label='Save'
        variant='ghost'
        color={colors.closeBtnColor}
        _hover={{
          bg: colors.closeBtnHoverBg,
          transform: 'scale(1.05)',
        }}
        transition='all 0.2s ease'
      />
      <IconButton
        icon={<CloseIcon />}
        size='sm'
        onClick={() => {
          setNote(message);
          setIsEditing(false);
        }}
        aria-label='Cancel'
        variant='ghost'
        color={colors.closeBtnColor}
        _hover={{
          bg: colors.closeBtnHoverBg,
          transform: 'scale(1.05)',
        }}
        transition='all 0.2s ease'
      />
    </>
  )}
</Flex>
				</ModalHeader>

				<ModalBody>
					{isEditing ? (
						<Textarea
							value={note}
							onChange={(e) => setNote(e.target.value)}
							bg={colors.bgInput}
							borderColor={colors.borderColor}
							color={colors.headingText}
							minH='120px'
							resize='vertical'
							_hover={{ borderColor: colors.accentGold }}
							_focus={{
								borderColor: colors.accentGold,
								boxShadow: `0 0 0 1px ${colors.accentGold}`,
							}}
							_placeholder={{ color: colors.mutedText }}
							placeholder="Enter your note here..."
						/>
					) : (
						<Box
							bg={colors.bgInput}
							py='2'
							px='3'
							rounded='md'
							shadow='sm'
							minH='100px'
							overflowY='auto'
							color={colors.bodyText}
						>
							{note || 'No note available'}
						</Box>
					)}
				</ModalBody>

				<ModalFooter
					bg={colors.footerBg}
					borderTop={`1px solid ${colors.borderColor}`}
					py={3}
					px={6}
				>
					<Button
						onClick={onClose}
						rounded='md'
						variant='ghost'
						color={colors.bodyText}
						_hover={{
							bg: colors.secondaryBtnHoverBg,
							color: colors.headingText,
						}}
					>
						Close
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};

export default InterviewNoteView;