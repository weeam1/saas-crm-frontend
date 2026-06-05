import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  Box,
  Flex,
  Text,
  Avatar,
  IconButton,
  Grid,
  Input,
  Select,
  Tooltip,
  Button,
  Textarea,
} from "@chakra-ui/react";
import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, Trash2, Upload, UserIcon, Wand2 } from "lucide-react";
import { useModalColors } from "hooks/useModalColors";

const MotionBox = motion(Box);

export default function EditUserModal({ isOpen, onClose }) {
  const colors = useModalColors();

  // -----------------------------
  // 🔹 FORM STATES ADDED HERE
  // -----------------------------
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    nationality: "",
    dob: "",
    role: "",
    agency: "",
    password: "",
    passport_id: "",
    uae_id: "",
    driving_license: "",
    education: "",
    uae_address: "",
    home_country: "",
    home_country_address: "",
    intl_phone: "",
  });

  const [errors, setErrors] = useState({});

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  // -----------------------------
  // IMAGE UPLOAD HANDLING
  // -----------------------------
  const [profileImage, setProfileImage] = useState("");
  const [profileFile, setProfileFile] = useState(null);

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setProfileFile(file);
    setProfileImage(URL.createObjectURL(file));
  };

  // -----------------------------
  // PASSWORD GENERATION
  // -----------------------------
  const [showPassword, setShowPassword] = useState(false);

  const handleGeneratePassword = () => {
    const chars =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";
    let newPassword = "";
    for (let i = 0; i < 12; i++) {
      newPassword += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    updateField("password", newPassword);
  };

  const validateForm = () => {
    let temp = {};

    if (!form.first_name.trim()) temp.first_name = "First name is required";
    if (!form.last_name.trim()) temp.last_name = "Last name is required";

    if (!form.email.trim()) temp.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      temp.email = "Enter a valid email";

    if (!form.phone.trim()) temp.phone = "Phone number is required";

    if (!form.nationality) temp.nationality = "Nationality is required";
    if (!form.dob) temp.dob = "Date of birth is required";

    if (!form.role) temp.role = "Role is required";
    if (!form.agency) temp.agency = "Agency is required";

    if (!form.password.trim()) temp.password = "Password is required";
    else if (form.password.length < 8)
      temp.password = "Must be at least 8 characters";

    if (form.passport_id && form.passport_id.length < 6)
      temp.passport_id = "Enter a valid passport number";

    if (form.uae_id && !/^\d{3}-\d{4}-\d{7}-\d$/.test(form.uae_id))
      temp.uae_id = "UAE ID format must be 784-XXXX-XXXXXXX-X";

    if (!form.intl_phone.trim())
      temp.intl_phone = "International phone number is required";

    setErrors(temp);

    return Object.keys(temp).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      console.log("❌ Validation failed");
      return;
    }

    try {
      const fd = new FormData();

      Object.keys(form).forEach((key) => {
        fd.append(key, form[key]);
      });

      if (profileFile) fd.append("profile_image", profileFile);

      const res = await fetch("/api/users", {
        method: "POST",
        body: fd,
      });

      const data = await res.json();
      console.log("USER CREATED:", data);

      onClose();
    } catch (err) {
      console.error("Submit Error:", err);
    }
  };

  return (
    <Modal onClose={onClose} isOpen={isOpen} size="6xl" isCentered>
      <ModalOverlay bg={colors.overlayBg} backdropFilter="blur(4px)" />
      <ModalContent
        m="3"
        borderRadius="2xl"
        shadow={colors.modalShadow}
        overflow="hidden"
        w={{ base: "95vw", md: "1024px" }}
        maxH={{ base: "80vh", md: "90vh" }}
        display="flex"
        flexDirection="column"
        bg={colors.bg}
      >
        {/* HEADER */}
        <ModalHeader
          px={6}
          py={6}
          borderBottom="1px solid"
          borderColor={colors.borderColor}
          bg={colors.bgDeep}
        >
          <Flex align="center" justify="space-between" w="full">
            <Text
              fontSize="lg"
              fontWeight="600"
              color={colors.headingText}
              letterSpacing="0.2px"
            >
              Edit User
            </Text>

            <ModalCloseButton
              position="relative"
              top="0"
              right="0"
              color={colors.closeBtnColor}
              boxSize={6}
              _focus={{ outline: "none" }}
              _hover={{ bg: colors.closeBtnHoverBg }}
            />
          </Flex>
        </ModalHeader>

        <Box
          bg={colors.bg}
          color={colors.bodyText}
          p={6}
          borderTopRadius="2xl"
          maxH={{ base: "50vh", md: "81vh" }}
          overflowY="auto"
          scrollBehavior="smooth"
          display={"flex"}
          flexDirection={"column"}
          flex="1"
          gap={6}
        >
          {/* SECTION 1 — PERSONAL INFORMATION */}
          <Box p={4} bg={colors.bgInput} borderRadius="xl" boxShadow={colors.cardShadow} border="1px solid" borderColor={colors.borderColor}>
            <Text fontWeight="700" fontSize="lg" mb={6} color={colors.headingText}>
              Personal Information
            </Text>

            <Flex gap={8} direction={{ base: "column", md: "row" }}>
              {/* Avatar + Upload */}
              <Box textAlign="center" flexShrink={0}>
                <Box
                  w="120px"
                  h="120px"
                  mx="auto"
                  borderRadius="full"
                  overflow="hidden"
                  position="relative"
                  bg={colors.bgInput}
                  boxShadow={colors.cardShadow}
                  cursor="pointer"
                  _hover={{ transform: "scale(1.05)", transition: "0.2s" }}
                  border="1px solid"
                  borderColor={colors.borderColor}
                >
                  <Avatar
                    size="2xl"
                    src={profileImage}
                    bg={colors.bgInput}
                    icon={<UserIcon />}
                    name=""
                  />

                  <MotionBox
                    position="absolute"
                    inset={0}
                    bg="rgba(0,0,0,0.25)"
                    opacity={0}
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    gap={2}
                    borderRadius="full"
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Tooltip label="Upload new photo" placement="top">
                      <IconButton
                        icon={<Upload size={18} />}
                        aria-label="Upload"
                        size="sm"
                        variant="ghost"
                        onClick={() =>
                          document.getElementById("profileUpload").click()
                        }
                        color={colors.bodyText}
                        _hover={{ color: colors.accentGold, bg: colors.secondaryBtnHoverBg }}
                      />
                    </Tooltip>

                    {profileImage && (
                      <Tooltip label="Remove photo" placement="top">
                        <IconButton
                          icon={<Trash2 size={18} />}
                          aria-label="Remove"
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setProfileImage("");
                            setProfileFile(null);
                          }}
                          color={colors.bodyText}
                          _hover={{ color: colors.badgeErrorText, bg: colors.badgeErrorBg }}
                        />
                      </Tooltip>
                    )}
                  </MotionBox>
                </Box>

                <input
                  id="profileUpload"
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={handleImageUpload}
                />

                <Text fontSize="xs" color={colors.mutedText} mt={2}>
                  Click avatar to upload
                </Text>
              </Box>

              {/* Personal Info Form Grid */}
              <Grid
                templateColumns={{ base: "1fr", md: "repeat(2,1fr)" }}
                gap={4}
                flex="1"
              >
                {/* First Name */}
                <Box>
                  <Text fontSize="sm" fontWeight="600" color={colors.labelColor} mb={1}>
                    First Name
                  </Text>
                  <Input
                    placeholder="Enter first name"
                    bg={colors.bgInput}
                    borderRadius="14px"
                    borderColor={colors.borderColor}
                    color={colors.headingText}
                    _hover={{ borderColor: colors.accentGold }}
                    _focus={{
                      borderColor: colors.accentGold,
                      boxShadow: `0 0 0 1px ${colors.accentGold}`,
                    }}
                    _placeholder={{ color: colors.mutedText }}
                    value={form.first_name}
                    onChange={(e) => updateField("first_name", e.target.value)}
                  />

                  {errors.first_name && (
                    <Text fontSize="xs" color={colors.badgeErrorText} mt={1}>
                      {errors.first_name}
                    </Text>
                  )}
                </Box>

                {/* Last Name */}
                <Box>
                  <Text fontSize="sm" fontWeight="600" color={colors.labelColor} mb={1}>
                    Last Name
                  </Text>
                  <Input
                    placeholder="Enter last name"
                    bg={colors.bgInput}
                    borderRadius="14px"
                    borderColor={colors.borderColor}
                    color={colors.headingText}
                    _hover={{ borderColor: colors.accentGold }}
                    _focus={{
                      borderColor: colors.accentGold,
                      boxShadow: `0 0 0 1px ${colors.accentGold}`,
                    }}
                    _placeholder={{ color: colors.mutedText }}
                    value={form.last_name}
                    onChange={(e) => updateField("last_name", e.target.value)}
                  />

                  {errors.last_name && (
                    <Text fontSize="xs" color={colors.badgeErrorText} mt={1}>
                      {errors.last_name}
                    </Text>
                  )}
                </Box>

                {/* Email */}
                <Box>
                  <Text fontSize="sm" fontWeight="600" color={colors.labelColor} mb={1}>
                    Email
                  </Text>
                  <Input
                    type="email"
                    placeholder="Enter email"
                    bg={colors.bgInput}
                    borderRadius="14px"
                    borderColor={colors.borderColor}
                    color={colors.headingText}
                    _hover={{ borderColor: colors.accentGold }}
                    _focus={{
                      borderColor: colors.accentGold,
                      boxShadow: `0 0 0 1px ${colors.accentGold}`,
                    }}
                    _placeholder={{ color: colors.mutedText }}
                    value={form.email}
                    onChange={(e) => updateField("email", e.target.value)}
                  />

                  {errors.email && (
                    <Text fontSize="xs" color={colors.badgeErrorText} mt={1}>
                      {errors.email}
                    </Text>
                  )}
                </Box>

                {/* Phone */}
                <Box>
                  <Text fontSize="sm" fontWeight="600" color={colors.labelColor} mb={1}>
                    Phone Number
                  </Text>
                  <Input
                    placeholder="+971 XX XXX XXXX"
                    bg={colors.bgInput}
                    borderRadius="14px"
                    borderColor={colors.borderColor}
                    color={colors.headingText}
                    _hover={{ borderColor: colors.accentGold }}
                    _focus={{
                      borderColor: colors.accentGold,
                      boxShadow: `0 0 0 1px ${colors.accentGold}`,
                    }}
                    _placeholder={{ color: colors.mutedText }}
                    value={form.phone}
                    onChange={(e) => updateField("phone", e.target.value)}
                  />

                  {errors.phone && (
                    <Text fontSize="xs" color={colors.badgeErrorText} mt={1}>
                      {errors.phone}
                    </Text>
                  )}
                </Box>

                {/* Nationality */}
                <Box>
                  <Text fontSize="sm" fontWeight="600" color={colors.labelColor} mb={1}>
                    Nationality
                  </Text>
                  <Select
                    placeholder="Select country"
                    size="md"
                    borderRadius="14px"
                    borderColor={colors.borderColor}
                    bg={colors.bgInput}
                    fontSize="sm"
                    color={colors.headingText}
                    _hover={{ borderColor: colors.accentGold }}
                    _focus={{
                      borderColor: colors.accentGold,
                      boxShadow: `0 0 0 1px ${colors.accentGold}`,
                    }}
                    value={form.nationality}
                    onChange={(e) => updateField("nationality", e.target.value)}
                  >
                    <option style={{ background: colors.bg, color: colors.headingText }}>UAE</option>
                    <option style={{ background: colors.bg, color: colors.headingText }}>Saudi Arabia</option>
                    <option style={{ background: colors.bg, color: colors.headingText }}>Pakistan</option>
                    <option style={{ background: colors.bg, color: colors.headingText }}>India</option>
                    <option style={{ background: colors.bg, color: colors.headingText }}>Egypt</option>
                  </Select>

                  {errors.nationality && (
                    <Text fontSize="xs" color={colors.badgeErrorText} mt={1}>
                      {errors.nationality}
                    </Text>
                  )}
                </Box>

                {/* Date of Birth */}
                <Box>
                  <Text fontSize="sm" fontWeight="600" color={colors.labelColor} mb={1}>
                    Date of Birth
                  </Text>
                  <Input
                    type="date"
                    bg={colors.bgInput}
                    borderRadius="14px"
                    borderColor={colors.borderColor}
                    color={colors.headingText}
                    _hover={{ borderColor: colors.accentGold }}
                    _focus={{
                      borderColor: colors.accentGold,
                      boxShadow: `0 0 0 1px ${colors.accentGold}`,
                    }}
                    value={form.dob}
                    onChange={(e) => updateField("dob", e.target.value)}
                  />

                  {errors.dob && (
                    <Text fontSize="xs" color={colors.badgeErrorText} mt={1}>
                      {errors.dob}
                    </Text>
                  )}
                </Box>
              </Grid>
            </Flex>
          </Box>

          {/* SECTION 2 — CRM ACCESS */}
          <Box p={4} bg={colors.bgInput} borderRadius="xl" boxShadow={colors.cardShadow} border="1px solid" borderColor={colors.borderColor}>
            <Text fontWeight="700" fontSize="lg" mb={6} color={colors.headingText}>
              CRM ACCESS
            </Text>

            <Flex gap={8} direction={{ base: "column", md: "row" }}>
              <Grid
                templateColumns={{ base: "1fr", md: "repeat(2,1fr)" }}
                gap={4}
                flex="1"
              >
                {/* Select Role */}
                <Box>
                  <Text fontSize="sm" fontWeight="600" color={colors.labelColor} mb={1}>
                    Select Role
                  </Text>
                  <Select
                    placeholder="Select role"
                    size="md"
                    borderRadius="14px"
                    borderColor={colors.borderColor}
                    bg={colors.bgInput}
                    fontSize="sm"
                    color={colors.headingText}
                    _hover={{ borderColor: colors.accentGold }}
                    _focus={{
                      borderColor: colors.accentGold,
                      boxShadow: `0 0 0 1px ${colors.accentGold}`,
                    }}
                    value={form.role}
                    onChange={(e) => updateField("role", e.target.value)}
                  >
                    <option style={{ background: colors.bg, color: colors.headingText }}>Admin</option>
                    <option style={{ background: colors.bg, color: colors.headingText }}>Manager</option>
                    <option style={{ background: colors.bg, color: colors.headingText }}>Agent</option>
                  </Select>

                  {errors.role && (
                    <Text fontSize="xs" color={colors.badgeErrorText} mt={1}>
                      {errors.role}
                    </Text>
                  )}
                </Box>

                {/* Select Agency */}
                <Box>
                  <Text fontSize="sm" fontWeight="600" color={colors.labelColor} mb={1}>
                    Select Agency
                  </Text>
                  <Select
                    placeholder="Select agency"
                    size="md"
                    borderRadius="14px"
                    borderColor={colors.borderColor}
                    bg={colors.bgInput}
                    fontSize="sm"
                    color={colors.headingText}
                    _hover={{ borderColor: colors.accentGold }}
                    _focus={{
                      borderColor: colors.accentGold,
                      boxShadow: `0 0 0 1px ${colors.accentGold}`,
                    }}
                    value={form.agency}
                    onChange={(e) => updateField("agency", e.target.value)}
                  >
                    <option style={{ background: colors.bg, color: colors.headingText }}>Dubai</option>
                    <option style={{ background: colors.bg, color: colors.headingText }}>UAE</option>
                    <option style={{ background: colors.bg, color: colors.headingText }}>Egypt</option>
                  </Select>

                  {errors.agency && (
                    <Text fontSize="xs" color={colors.badgeErrorText} mt={1}>
                      {errors.agency}
                    </Text>
                  )}
                </Box>

                {/* Password */}
                <Box position="relative">
                  <Text fontSize="sm" fontWeight="600" color={colors.labelColor} mb={1}>
                    Password
                  </Text>

                  <Box position="relative" h="40px">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter password"
                      bg={colors.bgInput}
                      borderRadius="14px"
                      borderColor={colors.borderColor}
                      color={colors.headingText}
                      pr="90px"
                      h="40px"
                      _hover={{ borderColor: colors.accentGold }}
                      _focus={{
                        borderColor: colors.accentGold,
                        boxShadow: `0 0 0 1px ${colors.accentGold}`,
                      }}
                      _placeholder={{ color: colors.mutedText }}
                      value={form.password}
                      onChange={(e) => updateField("password", e.target.value)}
                    />

                    <Flex
                      position="absolute"
                      top="50%"
                      right="3"
                      transform="translateY(-50%)"
                      gap={1}
                      align="center"
                    >
                      <Button
                        variant="ghost"
                        minW="auto"
                        h="24px"
                        w="24px"
                        p="0"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        onClick={() => setShowPassword(!showPassword)}
                        color={colors.bodyText}
                        _hover={{ color: colors.accentGold }}
                      >
                        {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                      </Button>

                      <Button
                        variant="ghost"
                        minW="auto"
                        h="24px"
                        w="24px"
                        p="0"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        onClick={handleGeneratePassword}
                        color={colors.bodyText}
                        _hover={{ color: colors.accentGold }}
                      >
                        <Wand2 size={14} />
                      </Button>
                    </Flex>
                  </Box>

                  {errors.password && (
                    <Text fontSize="xs" color={colors.badgeErrorText} mt={1}>
                      {errors.password}
                    </Text>
                  )}
                </Box>
              </Grid>
            </Flex>
          </Box>

          {/* SECTION 3 — Identification */}
          <Box p={4} bg={colors.bgInput} borderRadius="xl" boxShadow={colors.cardShadow} border="1px solid" borderColor={colors.borderColor}>
            <Text fontWeight="700" fontSize="lg" mb={6} color={colors.headingText}>
              Identification
            </Text>

            <Grid
              templateColumns={{ base: "1fr", md: "repeat(2,1fr)" }}
              gap={4}
              flex="1"
            >
              {/* Passport ID */}
              <Box>
                <Text fontSize="sm" fontWeight="600" color={colors.labelColor} mb={1}>
                  Passport ID
                </Text>
                <Input
                  placeholder="e.g., N1234567"
                  bg={colors.bgInput}
                  borderRadius="14px"
                  borderColor={colors.borderColor}
                  color={colors.headingText}
                  _hover={{ borderColor: colors.accentGold }}
                  _focus={{
                    borderColor: colors.accentGold,
                    boxShadow: `0 0 0 1px ${colors.accentGold}`,
                  }}
                  _placeholder={{ color: colors.mutedText }}
                  value={form.passport_id}
                  onChange={(e) => updateField("passport_id", e.target.value)}
                />

                {errors.passport_id && (
                  <Text fontSize="xs" color={colors.badgeErrorText} mt={1}>
                    {errors.passport_id}
                  </Text>
                )}
              </Box>

              {/* UAE ID */}
              <Box>
                <Text fontSize="sm" fontWeight="600" color={colors.labelColor} mb={1}>
                  UAE ID (Optional)
                </Text>
                <Input
                  placeholder="e.g., 784-XXXX-XXXXXXX-X"
                  bg={colors.bgInput}
                  borderRadius="14px"
                  borderColor={colors.borderColor}
                  color={colors.headingText}
                  _hover={{ borderColor: colors.accentGold }}
                  _focus={{
                    borderColor: colors.accentGold,
                    boxShadow: `0 0 0 1px ${colors.accentGold}`,
                  }}
                  _placeholder={{ color: colors.mutedText }}
                  value={form.uae_id}
                  onChange={(e) => updateField("uae_id", e.target.value)}
                />

                {errors.uae_id && (
                  <Text fontSize="xs" color={colors.badgeErrorText} mt={1}>
                    {errors.uae_id}
                  </Text>
                )}
              </Box>

              {/* Driving License */}
              <Box>
                <Text fontSize="sm" fontWeight="600" color={colors.labelColor} mb={1}>
                  Driving License (Optional)
                </Text>
                <Input
                  type="text"
                  placeholder="Enter driving license number"
                  bg={colors.bgInput}
                  borderRadius="14px"
                  borderColor={colors.borderColor}
                  color={colors.headingText}
                  _hover={{ borderColor: colors.accentGold }}
                  _focus={{
                    borderColor: colors.accentGold,
                    boxShadow: `0 0 0 1px ${colors.accentGold}`,
                  }}
                  _placeholder={{ color: colors.mutedText }}
                  value={form.driving_license}
                  onChange={(e) => updateField("driving_license", e.target.value)}
                />

                {errors.driving_license && (
                  <Text fontSize="xs" color={colors.badgeErrorText} mt={1}>
                    {errors.driving_license}
                  </Text>
                )}
              </Box>

              {/* Education Level / Degree */}
              <Box>
                <Text fontSize="sm" fontWeight="600" color={colors.labelColor} mb={1}>
                  Education Level / Degree
                </Text>
                <Select
                  placeholder="Select education level"
                  size="md"
                  borderRadius="14px"
                  borderColor={colors.borderColor}
                  bg={colors.bgInput}
                  fontSize="sm"
                  color={colors.headingText}
                  _hover={{ borderColor: colors.accentGold }}
                  _focus={{
                    borderColor: colors.accentGold,
                    boxShadow: `0 0 0 1px ${colors.accentGold}`,
                  }}
                  value={form.education}
                  onChange={(e) => updateField("education", e.target.value)}
                >
                  <option style={{ background: colors.bg, color: colors.headingText }}>High School</option>
                  <option style={{ background: colors.bg, color: colors.headingText }}>Bachelor's</option>
                  <option style={{ background: colors.bg, color: colors.headingText }}>Master's</option>
                  <option style={{ background: colors.bg, color: colors.headingText }}>PhD</option>
                  <option style={{ background: colors.bg, color: colors.headingText }}>Other</option>
                </Select>

                {errors.education && (
                  <Text fontSize="xs" color={colors.badgeErrorText} mt={1}>
                    {errors.education}
                  </Text>
                )}
              </Box>
            </Grid>
          </Box>

          {/* SECTION 4 — ADDRESS & CONTACT DETAILS */}
          <Box p={4} bg={colors.bgInput} borderRadius="xl" boxShadow={colors.cardShadow} border="1px solid" borderColor={colors.borderColor}>
            <Text fontWeight="700" fontSize="lg" mb={6} color={colors.headingText}>
              ADDRESS & CONTACT DETAILS
            </Text>

            <Grid
              templateColumns={{ base: "1fr", md: "repeat(2,1fr)" }}
              gap={4}
              flex="1"
            >
              {/* UAE / Dubai Address */}
              <Box>
                <Text fontSize="sm" fontWeight="600" color={colors.labelColor} mb={1}>
                  UAE / Dubai Address
                </Text>
                <Textarea
                  placeholder="Enter your UAE / Dubai address"
                  bg={colors.bgInput}
                  borderRadius="14px"
                  borderColor={colors.borderColor}
                  color={colors.headingText}
                  _hover={{ borderColor: colors.accentGold }}
                  _focus={{
                    borderColor: colors.accentGold,
                    boxShadow: `0 0 0 1px ${colors.accentGold}`,
                  }}
                  _placeholder={{ color: colors.mutedText }}
                  value={form.uae_address}
                  onChange={(e) => updateField("uae_address", e.target.value)}
                  rows={3}
                />
              </Box>

              {/* Home Country Address */}
              <Box>
                <Text fontSize="sm" fontWeight="600" color={colors.labelColor} mb={1}>
                  Home Country Address
                </Text>
                <Select
                  placeholder="Select country"
                  size="md"
                  borderRadius="14px"
                  borderColor={colors.borderColor}
                  bg={colors.bgInput}
                  fontSize="sm"
                  color={colors.headingText}
                  _hover={{ borderColor: colors.accentGold }}
                  _focus={{
                    borderColor: colors.accentGold,
                    boxShadow: `0 0 0 1px ${colors.accentGold}`,
                  }}
                  value={form.home_country}
                  onChange={(e) => updateField("home_country", e.target.value)}
                >
                  <option style={{ background: colors.bg, color: colors.headingText }}>UAE</option>
                  <option style={{ background: colors.bg, color: colors.headingText }}>Saudi Arabia</option>
                  <option style={{ background: colors.bg, color: colors.headingText }}>Pakistan</option>
                  <option style={{ background: colors.bg, color: colors.headingText }}>India</option>
                  <option style={{ background: colors.bg, color: colors.headingText }}>Egypt</option>
                </Select>

                <Input
                  mt={2}
                  placeholder="Enter full address"
                  bg={colors.bgInput}
                  borderRadius="14px"
                  borderColor={colors.borderColor}
                  color={colors.headingText}
                  _hover={{ borderColor: colors.accentGold }}
                  _focus={{
                    borderColor: colors.accentGold,
                    boxShadow: `0 0 0 1px ${colors.accentGold}`,
                  }}
                  _placeholder={{ color: colors.mutedText }}
                  value={form.home_country_address}
                  onChange={(e) => updateField("home_country_address", e.target.value)}
                />
              </Box>

              {/* International Phone Number */}
              <Box>
                <Text fontSize="sm" fontWeight="600" color={colors.labelColor} mb={1}>
                  International Phone Number
                </Text>
                <Input
                  placeholder="+971 XX XXX XXXX"
                  bg={colors.bgInput}
                  borderRadius="14px"
                  borderColor={colors.borderColor}
                  color={colors.headingText}
                  _hover={{ borderColor: colors.accentGold }}
                  _focus={{
                    borderColor: colors.accentGold,
                    boxShadow: `0 0 0 1px ${colors.accentGold}`,
                  }}
                  _placeholder={{ color: colors.mutedText }}
                  value={form.intl_phone}
                  onChange={(e) => updateField("intl_phone", e.target.value)}
                />

                {errors.intl_phone && (
                  <Text fontSize="xs" color={colors.badgeErrorText} mt={1}>
                    {errors.intl_phone}
                  </Text>
                )}
              </Box>
            </Grid>
          </Box>
        </Box>

        {/* FOOTER */}
        <Flex
          borderTop="1px solid"
          borderColor={colors.borderColor}
          px={6}
          py={4}
          bg={colors.footerBg}
          justify={{ base: "center", md: "flex-end" }}
          gap={3}
          flexWrap="wrap"
          position="sticky"
          bottom={0}
          zIndex={10}
        >
          <Button
            variant="ghost"
            size="md"
            borderRadius="12px"
            fontWeight="600"
            px={5}
            minW={{ base: "100%", md: "120px" }}
            onClick={onClose}
            color={colors.bodyText}
            _hover={{
              bg: colors.secondaryBtnHoverBg,
              color: colors.headingText,
            }}
          >
            Cancel
          </Button>

          <Button
            bg={colors.accentGold}
            color={colors.headerText}
            border="1px solid"
            borderColor={colors.accentGold}
            size="md"
            borderRadius="12px"
            fontWeight="600"
            px={5}
            minW={{ base: "100%", md: "120px" }}
            boxShadow="0px 1px 3px rgba(0,0,0,0.08)"
            _hover={{
              bg: colors.goldLight,
              borderColor: colors.goldLight,
              transform: "translateY(-1px)",
              boxShadow: colors.goldGlow,
            }}
            _active={{ bg: colors.goldDark }}
            transition="all 0.2s ease"
            onClick={handleSubmit}
          >
            Update
          </Button>
        </Flex>
      </ModalContent>
    </Modal>
  );
}