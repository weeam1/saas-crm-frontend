import React, { useState } from 'react';
import { Grid, GridItem } from '@chakra-ui/react';
import CallCard from './CallCard';
import { CallGridSkeleton } from './CallCardSkeleton';
import TranscribeModal from './Component/TranscribeModal';

const CallGrid = ({
	calls,
	currentlyPlayingId,
	handleSetCurrentlyPlaying,
	handleCopy,
	loading,
	pageSize,
}) => {
	const [transcribeModal, setTranscribeModal] = useState(false);
	const [currentCall, setCurrentCall] = useState(false);

	if (loading) {
		return <CallGridSkeleton count={pageSize} />;
	}

	const handleOpenTranscribe = (data) => {
		setCurrentCall(data);
		setTranscribeModal(true);
	};

	const handleTranscribeClose = () => {
		setTranscribeModal(false);
		setCurrentCall(null);
	};

	return (
		<>
			<Grid
				templateColumns={{
					base: 'repeat(1, minmax(0, 1fr))',
					sm: 'repeat(1, minmax(0, 1fr))',
					md: 'repeat(2, minmax(0, 1fr))',
					lg: 'repeat(3, minmax(0, 1fr))',
					xl: 'repeat(4, minmax(0, 1fr))',
				}}
				autoRows='minmax(360px, auto)'
				gap={4}
				p={4}
				width='100%'
			>
				{calls.map((call, index) => (
					<GridItem key={call.id || call.uniqueid || index}>
						<CallCard
							call={call}
							currentlyPlayingId={currentlyPlayingId}
							handleSetCurrentlyPlaying={handleSetCurrentlyPlaying}
							handleCopy={handleCopy}
							handleOpenTranscribe={handleOpenTranscribe}
							index={index}
						/>
					</GridItem>
				))}
			</Grid>

			{transcribeModal && (
				<TranscribeModal
					isOpen={transcribeModal}
					onClose={handleTranscribeClose}
					data={currentCall}
				/>
			)}
		</>
	);
};

export default CallGrid;
