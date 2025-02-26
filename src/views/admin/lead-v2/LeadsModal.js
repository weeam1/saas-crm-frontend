import {
	Box,
	Modal,
	ModalContent,
	ModalOverlay,
	ModalCloseButton,
} from '@chakra-ui/react';
import View from './View';
import { motion } from 'framer-motion';

const modalVariants = {
	hidden: { opacity: 0, scale: 0.95, y: 20 },
	visible: {
		opacity: 1,
		scale: 1,
		y: 0,
		transition: { duration: 0.3, ease: 'easeOut' },
	},
	exit: {
		opacity: 0,
		scale: 0.95,
		y: -20,
		transition: { duration: 0.2, ease: 'easeIn' },
	},
};

const LeadsModal = ({ leadsModal, onClose, reFreshData, isInLeadPool }) => {
	return (
		<Modal onClose={onClose} isOpen={leadsModal.isOpen} isCentered>
			<ModalOverlay
				as={motion.div}
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				exit={{ opacity: 0 }}
			/>

			<ModalContent
				as={motion.div}
				variants={modalVariants}
				initial='hidden'
				animate='visible'
				exit='exit'
				overflowY='scroll'
				height='90vh'
				style={{ maxWidth: '90vw' }}
			>
				<ModalCloseButton />
				<Box p={4} pt={16}>
					<View
						isInLeadPool={isInLeadPool}
						param={{ id: leadsModal.lid }}
						reFreshData={reFreshData}
					/>
				</Box>
			</ModalContent>
		</Modal>
	);
};

export default LeadsModal;
