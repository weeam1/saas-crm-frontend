import React from 'react';
import { Box, Button, Flex, Text } from '@chakra-ui/react';
import { BiX } from 'react-icons/bi';
import { getUserNameById } from 'utils';
import { useSelector } from 'react-redux';
import SearchTags from 'components/search/SearchTags';

const ClearAdvancedSearchButton = ({
	clearAdvancedSearch,
	loading,
	searchQuery,
	formValues,
	tagValues,
	setSearchQuery,
}) => {
	const handleClear = () => {
		clearAdvancedSearch();
		setSearchQuery('');
	};

	const users = useSelector((state) => state.user?.users) || [];
	const getSearchLabel = () => {
		const agentName = formValues?.agentAssigned
			? getUserNameById(formValues.agentAssigned, users) ||
				formValues.agentAssigned
			: null;

		if (searchQuery && Object.keys(formValues).length === 0) {
			return `Lead Name: ${searchQuery}`;
		}

		// Advanced search
		// if (Object.keys(formValues).length > 0) {
		// 	const searchFields = Object.entries(formValues)
		// 		.filter(
		// 			([key, value]) =>
		// 				value !== '' &&
		// 				value !== undefined &&
		// 				key !== 'agentAssigned' &&
		// 				key !== 'managerAssigned'
		// 		)
		// 		.map(([key, value]) => {
		// 			switch (key) {
		// 				case 'leadName':
		// 					return `Lead Name: ${value}`;
		// 				case 'nationality':
		// 					return `Nationality: ${value}`;
		// 				case 'leadStatus':
		// 					return `Lead Status: ${value === 'active' ? 'Interested' : value === 'pending' ? 'Not Interested' : value}`;
		// 				case 'eLeadStatus':
		// 					return `M Status: ${value === '-1' ? 'No M Status' : value}`;
		// 				case 'leadEmail':
		// 					return `Email: ${value}`;
		// 				case 'leadPhoneNumber':
		// 					return `Phone: ${value}`;
		// 				case 'leadWhatsappNumber':
		// 					return `WhatsApp: ${value}`;
		// 				case 'agentName':
		// 					return `Agent: ${value}`; // Use agentName if provided (unlikely in this case)
		// 				case 'managerName':
		// 					return `Manager: ${value}`;
		// 				case 'ip':
		// 					return `IP: ${value}`;
		// 				case 'leadAddress':
		// 					return `Address: ${value}`;
		// 				case 'leadCampaign':
		// 					return `Campaign: ${value}`;
		// 				case 'leadSourceDetails':
		// 					return `Source Details: ${value}`;
		// 				case 'leadSourceMedium':
		// 					return `Source Medium: ${value}`;
		// 				case 'pageUrl':
		// 					return `Page URL: ${value}`;
		// 				case 'r_u_in_uae':
		// 					return `In UAE: ${value}`;
		// 				case 'timetocall':
		// 					return `Time to Call: ${value}`;
		// 				case 'leadLang':
		// 					return `Language: ${value}`;
		// 				case 'lastNote':
		// 					return `Last Note: ${value}`;
		// 				case 'budget':
		// 					return `Budget: ${value}`;
		// 				default:
		// 					return `${key}: ${value}`; // Fallback for other fields
		// 			}
		// 		});

		// 	// Add agent name if agentAssigned exists, using getUserNameById result
		// 	if (formValues.agentAssigned && agentName) {
		// 		searchFields.push(`Agent: ${agentName}`);
		// 	}
		// 	// Add manager name if needed (assuming similar utility exists, or fallback to ID)
		// 	if (formValues.managerAssigned) {
		// 		const managerName =
		// 			getUserNameById(formValues.managerAssigned) ||
		// 			formValues.managerAssigned;
		// 		searchFields.push(`Manager: ${managerName}`);
		// 	}

		// 	return searchFields.join(', ') || null;
		// }

		return null; // No search criteria available
	};

	const searchLabel = getSearchLabel();

	return (
		<Flex
			width='100%'
			justifyContent='space-between'
			alignItems='center'
			gap={2}
			mt='4px'
		>
			{/* {searchLabel ? (
				<Text fontSize='sm' color='gray.600' fontFamily='DM Sans'>
					{searchLabel}
				</Text>
			) : (
				<Box />
			)} */}

			<SearchTags searchTags={tagValues} />

			<Button
				bg='#f56565'
				color='white'
				w='80px'
				h='35px'
				borderRadius='5px'
				_hover={{
					bg: '#e53e3e',
				}}
				fontWeight='normal'
				variant='solid'
				size='sm'
				fontFamily='DM Sans'
				fontSize={{ base: 'xs', md: 'sm', lg: '14px' }}
				display='flex'
				alignItems='center'
				justifyContent='center'
				lineHeight='1'
				onClick={handleClear}
				leftIcon={<BiX />}
			>
				Clear
			</Button>
		</Flex>
	);
};

export default ClearAdvancedSearchButton;
