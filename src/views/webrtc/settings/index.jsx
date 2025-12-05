import { Box, Button, Center, Text } from '@chakra-ui/react';
import { useCallback, useEffect, useState } from 'react';
import { getSettings } from 'storage';

import AccountForm from './accountForm';
import { AccordionList } from './accordionList';

const MAX_NUM_OF_ACCOUNTS = 5;

export const Settings = () => {
	const [showForm, setShowForm] = useState(false);
	const [showFormInAccordion, setShowFormInAccordion] = useState(false);
	const [allSettings, setAllSettings] = useState([]);

	const loadSettings = useCallback(() => {
		const settings = getSettings();
		setAllSettings(settings);
	}, []);

	useEffect(() => {
		loadSettings();
	}, [loadSettings, showForm]);

	function handleOpenForm() {
		setShowForm(true);
	}

	function handleCloseForm() {
		setShowForm(false);
	}

	function handleOpenFormInAccordion() {
		setShowFormInAccordion(true);
	}

	function handleCloseFormInAccordion() {
		setShowFormInAccordion(false);
	}

	const btnIsDisabled = allSettings.length >= MAX_NUM_OF_ACCOUNTS;

	return (
		<div>
			<Box>
				<AccordionList
					handleOpenFormInAccordion={handleOpenFormInAccordion}
					handleCloseFormInAccordion={handleCloseFormInAccordion}
					allSettings={allSettings}
					reload={loadSettings}
					isNewFormOpen={showForm}
					handleCloseNewForm={handleCloseForm}
				/>
			</Box>

			{!showForm && !showFormInAccordion && (
				<Button
					marginY='3'
					colorScheme='brand'
					w='full'
					size='sm'
					onClick={handleOpenForm}
					isDisabled={btnIsDisabled}
				>
					Add Account
				</Button>
			)}

			{showForm && <AccountForm closeForm={handleCloseForm} />}

			<Center marginBottom='2.5' flexDirection='column'>
				<Text>
					{allSettings.length} of {MAX_NUM_OF_ACCOUNTS}{' '}
				</Text>
				{btnIsDisabled && <Text>Limit has been reached</Text>}
			</Center>

			{/* Uncomment if you want tabs
      <Tabs isFitted colorScheme={DEFAULT_COLOR_SCHEME}>
        <TabList mb="1em" gap={1}>
          <Tab>Basic</Tab>
          <Tab>Advanced</Tab>
        </TabList>

        <TabPanels mt={1}>
          <TabPanel p={0}>
            <BasicSettings />
          </TabPanel>
          <TabPanel p={0}>
            <AdvancedSettings />
          </TabPanel>
        </TabPanels>
      </Tabs> */}
		</div>
	);
};

export default Settings;
