import { Tabs, TabList, Tab } from "@chakra-ui/react";
import { useModalColors } from "hooks/useModalColors";

const TabsComponent = ({ selectedTab, onTabChange }) => {
	const colors = useModalColors();

	return (
		<Tabs index={selectedTab} onChange={onTabChange} mb={5} variant="unstyled">
			<TabList gap={4} borderBottom="none">
				<Tab
					bg={colors.bgInput}
					_selected={{ bg: colors.accentGold, color: colors.headerText }}
					w="156px"
					borderRadius="5px"
					fontFamily="Poppins"
					fontWeight="300"
					fontSize="20px"
					color={colors.bodyText}
					_hover={{ color: colors.accentGold }}
				>
					Admin
				</Tab>
				<Tab
					bg={colors.bgInput}
					_selected={{ bg: colors.accentGold, color: colors.headerText }}
					borderRadius="5px"
					fontFamily="Poppins"
					fontWeight="300"
					fontSize="20px"
					color={colors.bodyText}
					_hover={{ color: colors.accentGold }}
				>
					Manager
				</Tab>
				<Tab
					bg={colors.bgInput}
					_selected={{ bg: colors.accentGold, color: colors.headerText }}
					borderRadius="5px"
					fontFamily="Poppins"
					fontWeight="300"
					fontSize="20px"
					color={colors.bodyText}
					_hover={{ color: colors.accentGold }}
				>
					HR
				</Tab>
			</TabList>
		</Tabs>
	);
};

export default TabsComponent;