import { Icon, SimpleGrid, Box } from "@chakra-ui/react";
import MiniStatistics from "components/card/MiniStatistics";
import { FaCreativeCommonsBy, FaWpforms, FaWhatsapp } from "react-icons/fa";
import { HiOfficeBuilding, HiUsers } from "react-icons/hi";
import { TbExchange, TbTableColumn } from "react-icons/tb";
import { MdSettings } from "react-icons/md";
import { GrValidate } from "react-icons/gr";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();
  // const { hasPermission } = usePermissions();
  const iconStyle = {
    w: "24px",
    h: "24px",
    color: "white",
    flexShrink: 0,
  };

  const iconBoxStyle = {
    w: "58px",
    h: "58px",
    minW: "58px",
    minH: "58px",
    bg: "linear-gradient(90deg, #4481EB 0%, #04BEFE 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "full",
    shadow: "md",
    flexShrink: 0,
    transition: "all 0.25s ease-in-out",
    _hover: { transform: "scale(1.05)", shadow: "lg" },
  };

  return (
    <Box w="100%">
      <SimpleGrid
        columns={{ base: 1, sm: 2, md: 3, lg: 4, xl: 5 }}
        spacing={{ base: 5, md: 6, lg: 8 }}
        justifyItems="center"
        alignItems="stretch"
      >
        <MiniStatistics
          onClick={() => navigate("/admin-setting/users")}
          name="Users"
          startContent={
            <Box {...iconBoxStyle}>
              <Icon as={HiUsers} {...iconStyle} />
            </Box>
          }
          // value={task?.length || 0}
        />

        <MiniStatistics
          onClick={() => navigate("/role")}
          name="Roles & Permissions"
          startContent={
            <Box {...iconBoxStyle}>
              <Icon as={FaCreativeCommonsBy} {...iconStyle} />
            </Box>
          }
          // value={contactData?.length || 0}
        />

        <MiniStatistics
          onClick={() => navigate("/change-images")}
          name="Change Images"
          startContent={
            <Box {...iconBoxStyle}>
              <Icon as={TbExchange} {...iconStyle} />
            </Box>
          }
        />

        <MiniStatistics
          onClick={() => navigate("/custom-Fields")}
          name="Custom Fields"
          startContent={
            <Box {...iconBoxStyle}>
              <Icon as={FaWpforms} {...iconStyle} />
            </Box>
          }
        />

        <MiniStatistics
          onClick={() => navigate("/validations")}
          name="Validations"
          startContent={
            <Box {...iconBoxStyle}>
              <Icon as={GrValidate} {...iconStyle} />
            </Box>
          }
        />

        <MiniStatistics
          onClick={() => navigate("/table-field")}
          name="Table Fields"
          startContent={
            <Box {...iconBoxStyle}>
              <Icon as={TbTableColumn} {...iconStyle} />
            </Box>
          }
        />
        {/* <MiniStatistics
					fontsize='md'
					onClick={() => navigate('/developers')}
					startContent={
						<IconBox
							w='56px'
							h='56px'
							bg='linear-gradient(90deg, #4481EB 0%, #04BEFE 100%)'
							icon={
								<Icon w='28px' h='28px' as={MdConstruction} color='white' />
							}
						/>
					}
					name='Developers'
				/>
				<MiniStatistics
					fontsize='md'
					onClick={() => navigate('/bank-accounts')}
					startContent={
						<IconBox
							w='56px'
							h='56px'
							bg='linear-gradient(90deg, #4481EB 0%, #04BEFE 100%)'
							icon={
								<Icon
									w='28px'
									h='28px'
									as={MdAccountBalanceWallet}
									color='white'
								/>
							}
						/>
					}
					name='Bank Accounts'
				/> */}
        {/* <MiniStatistics
					fontsize="md"
					onClick={() => navigate("/announcements")}
					startContent={
						<IconBox
							w="56px"
							h="56px"
							bg="linear-gradient(90deg, #4481EB 0%, #04BEFE 100%)"
							icon={<Icon w="28px" h="28px" as={MdCampaign} color="white" />}
						/>
					}
					name="Announcement"
				/> */}
        <MiniStatistics
          onClick={() => navigate("/lead-settings")}
          name="Lead Settings" // Update the name to reflect the new purpose
          startContent={
            <Box {...iconBoxStyle}>
              <Icon as={MdSettings} {...iconStyle} />
            </Box>
          }
        />

        <MiniStatistics
          onClick={() => navigate("/agencies")}
          name="Agencies"
          startContent={
            <Box {...iconBoxStyle}>
              <Icon as={HiOfficeBuilding} {...iconStyle} />
            </Box>
          }
        />

        <MiniStatistics
          onClick={() => navigate("/admin-setting/whatsapp/settings")}
          name="WhatsApp Manager"
          startContent={
            <Box {...iconBoxStyle}>
              <Icon as={FaWhatsapp} {...iconStyle} />
            </Box>
          }
        />
      </SimpleGrid>
    </Box>
  );
};

export default Index;
