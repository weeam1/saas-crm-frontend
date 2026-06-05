import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Input,
  Select,
  VStack,
  HStack,
  Text,
  Grid,
  useDisclosure,
  IconButton,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import {
  FiFilter,
  FiUser,
  FiPhone,
  FiMapPin,
  FiDollarSign,
  FiTrendingUp,
  FiCheckCircle,
  FiBriefcase,
  FiShield,
} from "react-icons/fi";
import { salaryTypes } from "utils/options";
import { getNameById } from "utils/filters";
import { useRoles } from "hooks/user/userRoles";
import CustomTooltip from "components/shared/CustomTooltip";
import { useModalColors } from "hooks/useModalColors";
import FilterButton from "components/base/FilterButton";

const MotionDrawerContent = motion(DrawerContent);

const initialFilters = {
  username: "",
  fullName: "",
  phoneNumber: "",
  location: "",

  minCoins: "",
  maxCoins: "",

  minSalary: "",
  maxSalary: "",
  salaryType: "",

  role: "",
  agency: "",

  isActive: "",

  minCommission: "",
  maxCommission: "",
  commissionType: "",

  minIncentive: "",
  maxIncentive: "",
};

const FilterSection = ({ title, icon, children }) => {
  const colors = useModalColors();
  return (
    <Box>
      <HStack mb={3} spacing={2}>
        <Box color={colors.accentGold}>{icon}</Box>
        <Text fontWeight="semibold" fontSize="sm" color={colors.headingText}>
          {title}
        </Text>
      </HStack>

      <Box
        p={4}
        bg={colors.bgInput}
        borderRadius="lg"
        border="1px solid"
        borderColor={colors.borderColor}
      >
        {children}
      </Box>
    </Box>
  );
};

const UserFilterDrawer = ({
  filters,
  onApply,
  agencies = [],
  setActiveFilters,
  onReset,
}) => {
  const colors = useModalColors();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [localFilters, setLocalFilters] = useState(filters);

  const hasAnimated = useRef(false);

  const { roles: allRoles } = useRoles();

  const handleChange = (field, value) => {
    setLocalFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleApply = () => {
    const cleaned = Object.fromEntries(
      Object.entries(localFilters).filter(
        ([_, value]) => value !== "" && value !== undefined && value !== null,
      ),
    );

    onClose();
    onApply(cleaned);

    const { isActive, ...rest } = cleaned;

    const uiActiveFilters = {
      ...rest,

      ...(rest.salaryType && {
        salaryType: salaryTypes?.find((i) => i.value === rest.salaryType)
          ?.label,
      }),

      ...(rest.agency && {
        agency: getNameById(agencies, rest.agency),
      }),

      ...(rest.role && {
        role: getNameById(allRoles, rest.role, "roleName"),
      }),

      ...(isActive && {
        "Account Status": isActive === "true" ? "Active" : "Inactive",
      }),
    };

    setActiveFilters(uiActiveFilters);
  };

  const handleReset = () => {
    setLocalFilters(initialFilters);
    onReset?.();
  };

  return (
    <>
    <FilterButton
	label="Filters"
	onClick={onOpen}
	size="sm"
/>

      <Drawer isOpen={isOpen} placement="left" onClose={onClose} size="md">
        <DrawerOverlay bg={colors.overlayBg} />
        <MotionDrawerContent
          initial={hasAnimated.current ? false : { x: "-100%" }}
          animate={{ x: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 30 }}
          onAnimationComplete={() => (hasAnimated.current = true)}
          bg={colors.bg}
          borderRight={`1px solid ${colors.borderColor}`}
        >
          <DrawerCloseButton
            color={colors.bodyText}
            _hover={{ color: colors.accentGold, bg: colors.secondaryBtnHoverBg }}
          />
          <DrawerHeader borderBottomWidth="1px" borderBottomColor={colors.borderColor}>
            <HStack spacing={3}>
              <Box color={colors.accentGold}>
                <FiFilter size={20} />
              </Box>
              <Box>
                <Text fontSize="lg" fontWeight="bold" color={colors.headingText}>
                  User Filters
                </Text>
                <Text fontSize="xs" color={colors.mutedText}>
                  Narrow down users precisely
                </Text>
              </Box>
            </HStack>
          </DrawerHeader>

          <DrawerBody>
            <VStack
              spacing={6}
              overflow="scroll"
              p={2}
              maxH={{ base: "50vh", md: "60vh", lg: "75vh" }}
              align="stretch"
            >
              {/* User Info */}
              <FilterSection title="User Information" icon={<FiUser />}>
                <VStack spacing={3}>
                  <Input
                    size="sm"
                    placeholder="Email / Username"
                    value={localFilters.username}
                    onChange={(e) => handleChange("username", e.target.value)}
                    bg={colors.bgInput}
                    borderColor={colors.borderColor}
                    color={colors.headingText}
                    _hover={{ borderColor: colors.accentGold }}
                    _focus={{
                      borderColor: colors.accentGold,
                      boxShadow: `0 0 0 1px ${colors.accentGold}`,
                    }}
                    _placeholder={{ color: colors.mutedText }}
                  />
                  <Input
                    size="sm"
                    placeholder="Full Name"
                    value={localFilters.fullName}
                    onChange={(e) => handleChange("fullName", e.target.value)}
                    bg={colors.bgInput}
                    borderColor={colors.borderColor}
                    color={colors.headingText}
                    _hover={{ borderColor: colors.accentGold }}
                    _focus={{
                      borderColor: colors.accentGold,
                      boxShadow: `0 0 0 1px ${colors.accentGold}`,
                    }}
                    _placeholder={{ color: colors.mutedText }}
                  />
                  <Input
                    size="sm"
                    placeholder="Phone Number"
                    value={localFilters.phoneNumber}
                    onChange={(e) => handleChange("phoneNumber", e.target.value)}
                    bg={colors.bgInput}
                    borderColor={colors.borderColor}
                    color={colors.headingText}
                    _hover={{ borderColor: colors.accentGold }}
                    _focus={{
                      borderColor: colors.accentGold,
                      boxShadow: `0 0 0 1px ${colors.accentGold}`,
                    }}
                    _placeholder={{ color: colors.mutedText }}
                  />
                </VStack>
              </FilterSection>

              {/* Coins */}
              <FilterSection title="Coins" icon={<FiTrendingUp />}>
                <Grid templateColumns="repeat(2, 1fr)" gap={3}>
                  <Input
                    size="sm"
                    type="number"
                    placeholder="Min"
                    value={localFilters.minCoins}
                    onChange={(e) => handleChange("minCoins", e.target.value)}
                    bg={colors.bgInput}
                    borderColor={colors.borderColor}
                    color={colors.headingText}
                    _hover={{ borderColor: colors.accentGold }}
                    _focus={{
                      borderColor: colors.accentGold,
                      boxShadow: `0 0 0 1px ${colors.accentGold}`,
                    }}
                    _placeholder={{ color: colors.mutedText }}
                  />
                  <Input
                    size="sm"
                    type="number"
                    placeholder="Max"
                    value={localFilters.maxCoins}
                    onChange={(e) => handleChange("maxCoins", e.target.value)}
                    bg={colors.bgInput}
                    borderColor={colors.borderColor}
                    color={colors.headingText}
                    _hover={{ borderColor: colors.accentGold }}
                    _focus={{
                      borderColor: colors.accentGold,
                      boxShadow: `0 0 0 1px ${colors.accentGold}`,
                    }}
                    _placeholder={{ color: colors.mutedText }}
                  />
                </Grid>
              </FilterSection>

              {/* Salary */}
              <FilterSection title="Salary" icon={<FiDollarSign />}>
                <Grid templateColumns="repeat(2, 1fr)" gap={3}>
                  <Input
                    size="sm"
                    type="number"
                    placeholder="Min Salary"
                    value={localFilters.minSalary}
                    onChange={(e) => handleChange("minSalary", e.target.value)}
                    bg={colors.bgInput}
                    borderColor={colors.borderColor}
                    color={colors.headingText}
                    _hover={{ borderColor: colors.accentGold }}
                    _focus={{
                      borderColor: colors.accentGold,
                      boxShadow: `0 0 0 1px ${colors.accentGold}`,
                    }}
                    _placeholder={{ color: colors.mutedText }}
                  />
                  <Input
                    size="sm"
                    type="number"
                    placeholder="Max Salary"
                    value={localFilters.maxSalary}
                    onChange={(e) => handleChange("maxSalary", e.target.value)}
                    bg={colors.bgInput}
                    borderColor={colors.borderColor}
                    color={colors.headingText}
                    _hover={{ borderColor: colors.accentGold }}
                    _focus={{
                      borderColor: colors.accentGold,
                      boxShadow: `0 0 0 1px ${colors.accentGold}`,
                    }}
                    _placeholder={{ color: colors.mutedText }}
                  />
                </Grid>

                <Select
                  mt={3}
                  size="sm"
                  placeholder="Salary Type"
                  value={localFilters.salaryType}
                  onChange={(e) => handleChange("salaryType", e.target.value)}
                  bg={colors.bgInput}
                  borderColor={colors.borderColor}
                  color={colors.headingText}
                  _hover={{ borderColor: colors.accentGold }}
                  _focus={{
                    borderColor: colors.accentGold,
                    boxShadow: `0 0 0 1px ${colors.accentGold}`,
                  }}
                >
                  {salaryTypes?.map((item) => (
                    <option key={item.value} value={item.value} style={{ background: colors.bg, color: colors.headingText }}>
                      {item.label}
                    </option>
                  ))}
                </Select>
              </FilterSection>

              {/* Agency */}
              <FilterSection title="Agency" icon={<FiBriefcase />}>
                <Select
                  size="sm"
                  placeholder="Select Agency"
                  value={localFilters.agency}
                  onChange={(e) => handleChange("agency", e.target.value)}
                  bg={colors.bgInput}
                  borderColor={colors.borderColor}
                  color={colors.headingText}
                  _hover={{ borderColor: colors.accentGold }}
                  _focus={{
                    borderColor: colors.accentGold,
                    boxShadow: `0 0 0 1px ${colors.accentGold}`,
                  }}
                >
                  {agencies.map((a) => (
                    <option key={a._id} value={a._id} style={{ background: colors.bg, color: colors.headingText }}>
                      {a.name}
                    </option>
                  ))}
                </Select>
              </FilterSection>

              {/* Role */}
              <FilterSection title="Role" icon={<FiShield />}>
                <Select
                  size="sm"
                  placeholder="Select Role"
                  value={localFilters.role}
                  onChange={(e) => handleChange("role", e.target.value)}
                  bg={colors.bgInput}
                  borderColor={colors.borderColor}
                  color={colors.headingText}
                  _hover={{ borderColor: colors.accentGold }}
                  _focus={{
                    borderColor: colors.accentGold,
                    boxShadow: `0 0 0 1px ${colors.accentGold}`,
                  }}
                >
                  {allRoles?.map((a) => (
                    <option key={a._id} value={a._id} style={{ background: colors.bg, color: colors.headingText }}>
                      {a.roleName}
                    </option>
                  ))}
                </Select>
              </FilterSection>

              {/* Status */}
              <FilterSection title="Account Status" icon={<FiCheckCircle />}>
                <Select
                  size="sm"
                  placeholder="Account Status"
                  value={localFilters.isActive}
                  onChange={(e) => handleChange("isActive", e.target.value)}
                  bg={colors.bgInput}
                  borderColor={colors.borderColor}
                  color={colors.headingText}
                  _hover={{ borderColor: colors.accentGold }}
                  _focus={{
                    borderColor: colors.accentGold,
                    boxShadow: `0 0 0 1px ${colors.accentGold}`,
                  }}
                >
                  <option value="true" style={{ background: colors.bg, color: colors.headingText }}>Active</option>
                  <option value="false" style={{ background: colors.bg, color: colors.headingText }}>Inactive</option>
                </Select>
              </FilterSection>
            </VStack>

            <HStack p={2} borderTop="1px solid" borderColor={colors.borderColor} mt={4}>
              <Button
                flex={1}
                variant="ghost"
                onClick={handleReset}
                color={colors.bodyText}
                _hover={{
                  bg: colors.secondaryBtnHoverBg,
                  color: colors.headingText,
                }}
              >
                Reset
              </Button>
              <Button
                flex={1}
                bg={colors.accentGold}
                color={colors.headerText}
                onClick={handleApply}
                _hover={{
                  bg: colors.goldLight,
                  transform: "translateY(-1px)",
                  boxShadow: colors.goldGlow,
                }}
                _active={{ bg: colors.goldDark }}
                transition="all 0.2s ease"
              >
                Apply
              </Button>
            </HStack>
          </DrawerBody>
        </MotionDrawerContent>
      </Drawer>
    </>
  );
};

export default UserFilterDrawer;