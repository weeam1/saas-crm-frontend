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

const MotionBox = motion(Box);

export default function AddUserModal({ isOpen, onClose }) {
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

    // PERSONAL INFO
    if (!form.first_name.trim()) temp.first_name = "First name is required";
    if (!form.last_name.trim()) temp.last_name = "Last name is required";

    if (!form.email.trim()) temp.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      temp.email = "Enter a valid email";

    if (!form.phone.trim()) temp.phone = "Phone number is required";

    if (!form.nationality) temp.nationality = "Nationality is required";
    if (!form.dob) temp.dob = "Date of birth is required";

    // CRM ACCESS
    if (!form.role) temp.role = "Role is required";
    if (!form.agency) temp.agency = "Agency is required";

    if (!form.password.trim()) temp.password = "Password is required";
    else if (form.password.length < 8)
      temp.password = "Must be at least 8 characters";

    // IDENTIFICATION
    if (form.passport_id && form.passport_id.length < 6)
      temp.passport_id = "Enter a valid passport number";

    if (form.uae_id && !/^\d{3}-\d{4}-\d{7}-\d$/.test(form.uae_id))
      temp.uae_id = "UAE ID format must be 784-XXXX-XXXXXXX-X";

    // CONTACT
    if (!form.intl_phone.trim())
      temp.intl_phone = "International phone number is required";

    setErrors(temp);

    return Object.keys(temp).length === 0; // valid = true
  };

  // -----------------------------
  // 🔥 SUBMIT API CALL HERE
  // -----------------------------
  const handleSubmit = async () => {
    if (!validateForm()) {
      console.log("❌ Validation failed");
      return;
    }

    try {
      const fd = new FormData();

      // append all values
      Object.keys(form).forEach((key) => {
        fd.append(key, form[key]);
      });

      if (profileFile) fd.append("profile_image", profileFile);

      // 🔥 your API POST request
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
      <ModalOverlay bg="rgba(0,0,0,0.6)" backdropFilter="blur(4px)" />
      <ModalContent
        m="3"
        borderRadius="2xl"
        shadow="2xl"
        overflow="hidden"
        w={{ base: "95vw", md: "1024px" }}
        maxH={{ base: "80vh", md: "90vh" }} // limit modal height
        display="flex"
        flexDirection="column"
      >
        {/* HEADER */}
        <ModalHeader
          px={6}
          py={6}
          borderBottom="1px solid"
          borderColor="gray.200"
          bg="white"
        >
          <Flex align="center" justify="space-between" w="full">
            {/* Title */}
            <Text
              fontSize="lg"
              fontWeight="600"
              color="gray.800"
              letterSpacing="0.2px"
            >
              Add New User
            </Text>

            {/* Close Button */}
            <ModalCloseButton
              position="relative"
              top="0"
              right="0"
              color="black"
              boxSize={6}
              _focus={{ outline: "none" }}
              _hover={{ bg: "gray.100" }}
            />
          </Flex>
        </ModalHeader>

        <Box
          bg="white"
          color="gray.800"
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
          <Box p={4} bg="gray.50" borderRadius="xl" boxShadow="sm">
            <Text fontWeight="700" fontSize="lg" mb={6}>
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
                  bg="gray.100"
                  boxShadow="md"
                  cursor="pointer"
                  _hover={{ transform: "scale(1.05)", transition: "0.2s" }}
                >
                  <Avatar
                    size="2xl"
                    src={profileImage}
                    bg="gray.100"
                    icon={<UserIcon />}
                    name=""
                    // name={!profileImage ? "User Name" : ""}
                  />

                  {/* Hover Overlay */}
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
                        colorScheme="teal"
                        variant="ghost"
                        onClick={() =>
                          document.getElementById("profileUpload").click()
                        }
                      />
                    </Tooltip>

                    {profileImage && (
                      <Tooltip label="Remove photo" placement="top">
                        <IconButton
                          icon={<Trash2 size={18} />}
                          aria-label="Remove"
                          size="sm"
                          colorScheme="red"
                          variant="ghost"
                          onClick={() => {
                            setProfileImage("");
                            setProfileFile(null);
                          }}
                        />
                      </Tooltip>
                    )}
                  </MotionBox>
                </Box>

                {/* Hidden file input */}
                <input
                  id="profileUpload"
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={handleImageUpload}
                />

                {/* Optional hint text */}
                <Text fontSize="xs" color="gray.500" mt={2}>
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
                  <Text fontSize="sm" fontWeight="600" color="gray.600" mb={1}>
                    First Name
                  </Text>
                  <Input
                    placeholder="Enter first name"
                    bg="white"
                    borderRadius="14px"
                    borderColor="gray.300"
                    _hover={{ borderColor: "gray.400" }}
                    _focus={{
                      borderColor: "gray.500",
                      boxShadow: "0 0 0 1px rgba(0,0,0,0.08)",
                    }}
                    value={form.first_name}
                    onChange={(e) => updateField("first_name", e.target.value)}
                  />

                  {errors.first_name && (
                    <Text fontSize="xs" color="red.500" mt={1}>
                      {errors.first_name}
                    </Text>
                  )}
                </Box>

                {/* Last Name */}
                <Box>
                  <Text fontSize="sm" fontWeight="600" color="gray.600" mb={1}>
                    Last Name
                  </Text>
                  <Input
                    placeholder="Enter last name"
                    bg="white"
                    borderRadius="14px"
                    borderColor="gray.300"
                    _hover={{ borderColor: "gray.400" }}
                    _focus={{
                      borderColor: "gray.500",
                      boxShadow: "0 0 0 1px rgba(0,0,0,0.08)",
                    }}
                    value={form.last_name}
                    onChange={(e) => updateField("last_name", e.target.value)}
                  />

                  {errors.last_name && (
                    <Text fontSize="xs" color="red.500" mt={1}>
                      {errors.last_name}
                    </Text>
                  )}
                </Box>

                {/* Email */}
                <Box>
                  <Text fontSize="sm" fontWeight="600" color="gray.600" mb={1}>
                    Email
                  </Text>
                  <Input
                    type="email"
                    placeholder="Enter email"
                    bg="white"
                    borderRadius="14px"
                    borderColor="gray.300"
                    _hover={{ borderColor: "gray.400" }}
                    _focus={{
                      borderColor: "gray.500",
                      boxShadow: "0 0 0 1px rgba(0,0,0,0.08)",
                    }}
                    value={form.email}
                    onChange={(e) => updateField("email", e.target.value)}
                  />

                  {errors.email && (
                    <Text fontSize="xs" color="red.500" mt={1}>
                      {errors.email}
                    </Text>
                  )}
                </Box>

                {/* Phone */}
                <Box>
                  <Text fontSize="sm" fontWeight="600" color="gray.600" mb={1}>
                    Phone Number
                  </Text>
                  <Input
                    placeholder="+971 XX XXX XXXX"
                    bg="white"
                    borderRadius="14px"
                    borderColor="gray.300"
                    _hover={{ borderColor: "gray.400" }}
                    _focus={{
                      borderColor: "gray.500",
                      boxShadow: "0 0 0 1px rgba(0,0,0,0.08)",
                    }}
                    value={form.phone}
                    onChange={(e) => updateField("phone", e.target.value)}
                  />

                  {errors.phone && (
                    <Text fontSize="xs" color="red.500" mt={1}>
                      {errors.phone}
                    </Text>
                  )}
                </Box>

                {/* Nationality */}
                <Box>
                  <Text fontSize="sm" fontWeight="600" color="gray.600" mb={1}>
                    Nationality
                  </Text>
                  <Select
                    placeholder="Select country"
                    size="md"
                    borderRadius="14px"
                    borderColor="gray.300"
                    bg="white"
                    fontSize="sm"
                    _hover={{ borderColor: "gray.400" }}
                    _focus={{
                      borderColor: "gray.500",
                      boxShadow: "0 0 0 1px rgba(0,0,0,0.08)",
                    }}
                    value={form.nationality}
                    onChange={(e) => updateField("nationality", e.target.value)}
                  >
                    <option>UAE</option>
                    <option>Saudi Arabia</option>
                    <option>Pakistan</option>
                    <option>India</option>
                    <option>Egypt</option>
                  </Select>

                  {errors.nationality && (
                    <Text fontSize="xs" color="red.500" mt={1}>
                      {errors.nationality}
                    </Text>
                  )}
                </Box>

                {/* Date of Birth */}
                <Box>
                  <Text fontSize="sm" fontWeight="600" color="gray.600" mb={1}>
                    Date of Birth
                  </Text>
                  <Input
                    type="date"
                    bg="white"
                    borderRadius="14px"
                    borderColor="gray.300"
                    _hover={{ borderColor: "gray.400" }}
                    _focus={{
                      borderColor: "gray.500",
                      boxShadow: "0 0 0 1px rgba(0,0,0,0.08)",
                    }}
                    value={form.dob}
                    onChange={(e) => updateField("dob", e.target.value)}
                  />

                  {errors.dob && (
                    <Text fontSize="xs" color="red.500" mt={1}>
                      {errors.dob}
                    </Text>
                  )}
                </Box>
              </Grid>
            </Flex>
          </Box>

          {/* SECTION 2 — CRM ACCESS */}
          <Box p={4} bg="gray.50" borderRadius="xl" boxShadow="sm">
            <Text fontWeight="700" fontSize="lg" mb={6}>
              CRM ACCESS
            </Text>

            <Flex gap={8} direction={{ base: "column", md: "row" }}>
              {/* Avatar + Upload */}

              {/* Personal Info Form Grid */}
              <Grid
                templateColumns={{ base: "1fr", md: "repeat(2,1fr)" }}
                gap={4}
                flex="1"
              >
                {/*Select Role */}
                <Box>
                  <Text fontSize="sm" fontWeight="600" color="gray.600" mb={1}>
                    Select Role
                  </Text>
                  <Select
                    placeholder="Select role"
                    size="md"
                    borderRadius="14px"
                    borderColor="gray.300"
                    bg="white"
                    fontSize="sm"
                    _hover={{ borderColor: "gray.400" }}
                    _focus={{
                      borderColor: "gray.500",
                      boxShadow: "0 0 0 1px rgba(0,0,0,0.08)",
                    }}
                    value={form.role}
                    onChange={(e) => updateField("role", e.target.value)}
                  >
                    <option>Admin</option>
                    <option>Manager</option>
                    <option>Agent</option>
                  </Select>

                  {errors.role && (
                    <Text fontSize="xs" color="red.500" mt={1}>
                      {errors.role}
                    </Text>
                  )}
                </Box>

                {/*Select Agency */}
                <Box>
                  <Text fontSize="sm" fontWeight="600" color="gray.600" mb={1}>
                    Select Agency
                  </Text>
                  <Select
                    placeholder="Select role"
                    size="md"
                    borderRadius="14px"
                    borderColor="gray.300"
                    bg="white"
                    fontSize="sm"
                    _hover={{ borderColor: "gray.400" }}
                    _focus={{
                      borderColor: "gray.500",
                      boxShadow: "0 0 0 1px rgba(0,0,0,0.08)",
                    }}
                    value={form.agency}
                    onChange={(e) => updateField("agency", e.target.value)}
                  >
                    <option>Duabi</option>
                    <option>UAE</option>
                    <option>Egypt</option>
                  </Select>

                  {errors.agency && (
                    <Text fontSize="xs" color="red.500" mt={1}>
                      {errors.agency}
                    </Text>
                  )}
                </Box>

                {/* Password */}
                <Box position="relative">
                  <Text fontSize="sm" fontWeight="600" color="gray.600" mb={1}>
                    Password
                  </Text>

                  {/* FIX: Wrap input + icons in fixed-height box */}
                  <Box position="relative" h="40px">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter password"
                      bg="white"
                      borderRadius="14px"
                      borderColor="gray.300"
                      pr="90px"
                      h="40px" // <-- Fixed height to match wrapper
                      _hover={{ borderColor: "gray.400" }}
                      _focus={{
                        borderColor: "gray.500",
                        boxShadow: "0 0 0 1px rgba(0,0,0,0.08)",
                      }}
                      value={form.password}
                      onChange={(e) => updateField("password", e.target.value)}
                    />

                    {/* Icon Buttons */}
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
                      >
                        {showPassword ? (
                          <EyeOff size={14} />
                        ) : (
                          <Eye size={14} />
                        )}
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
                      >
                        <Wand2 size={14} />
                      </Button>
                    </Flex>
                  </Box>

                  {errors.password && (
                    <Text fontSize="xs" color="red.500" mt={1}>
                      {errors.password}
                    </Text>
                  )}
                </Box>
              </Grid>
            </Flex>
          </Box>

          {/* SECTION 3 — Identification */}
          <Box p={4} bg="gray.50" borderRadius="xl" boxShadow="sm">
            <Text fontWeight="700" fontSize="lg" mb={6}>
              Identification
            </Text>

            {/* Personal Info Form Grid */}
            <Grid
              templateColumns={{ base: "1fr", md: "repeat(2,1fr)" }}
              gap={4}
              flex="1"
            >
              {/* Passport ID */}
              <Box>
                <Text fontSize="sm" fontWeight="600" color="gray.600" mb={1}>
                  Passport ID
                </Text>
                <Input
                  placeholder="e.g., N1234567"
                  bg="white"
                  borderRadius="14px"
                  borderColor="gray.300"
                  _hover={{ borderColor: "gray.400" }}
                  _focus={{
                    borderColor: "gray.500",
                    boxShadow: "0 0 0 1px rgba(0,0,0,0.08)",
                  }}
                  value={form.passport_id}
                  onChange={(e) => updateField("passport_id", e.target.value)}
                />

                {errors.passport_id && (
                  <Text fontSize="xs" color="red.500" mt={1}>
                    {errors.passport_id}
                  </Text>
                )}
              </Box>

              {/* UAE ID */}
              <Box>
                <Text fontSize="sm" fontWeight="600" color="gray.600" mb={1}>
                  UAE ID (Optional)
                </Text>
                <Input
                  placeholder="e.g., 784-XXXX-XXXXXXX-X"
                  bg="white"
                  borderRadius="14px"
                  borderColor="gray.300"
                  _hover={{ borderColor: "gray.400" }}
                  _focus={{
                    borderColor: "gray.500",
                    boxShadow: "0 0 0 1px rgba(0,0,0,0.08)",
                  }}
                  value={form.uae_id}
                  onChange={(e) => updateField("uae_id", e.target.value)}
                />

                {errors.uae_id && (
                  <Text fontSize="xs" color="red.500" mt={1}>
                    {errors.uae_id}
                  </Text>
                )}
              </Box>

              {/* Driving License */}
              <Box>
                <Text fontSize="sm" fontWeight="600" color="gray.600" mb={1}>
                  Driving License (Optional)
                </Text>
                <Input
                  type="text"
                  placeholder="Enter driving license number"
                  bg="white"
                  borderRadius="14px"
                  borderColor="gray.300"
                  _hover={{ borderColor: "gray.400" }}
                  _focus={{
                    borderColor: "gray.500",
                    boxShadow: "0 0 0 1px rgba(0,0,0,0.08)",
                  }}
                  value={form.driving_license}
                  onChange={(e) =>
                    updateField("driving_license", e.target.value)
                  }
                />

                {errors.driving_license && (
                  <Text fontSize="xs" color="red.500" mt={1}>
                    {errors.driving_license}
                  </Text>
                )}
              </Box>

              {/* Education Level / Degree */}
              <Box>
                <Text fontSize="sm" fontWeight="600" color="gray.600" mb={1}>
                  Education Level / Degree
                </Text>
                <Select
                  placeholder="Select education level"
                  size="md"
                  borderRadius="14px"
                  borderColor="gray.300"
                  bg="white"
                  fontSize="sm"
                  _hover={{ borderColor: "gray.400" }}
                  _focus={{
                    borderColor: "gray.500",
                    boxShadow: "0 0 0 1px rgba(0,0,0,0.08)",
                  }}
                  value={form.education}
                  onChange={(e) => updateField("education", e.target.value)}
                >
                  <option>High School</option>
                  <option>Bachelor's</option>
                  <option>Master's</option>
                  <option>PhD</option>
                  <option>Other</option>
                </Select>

                {errors.education && (
                  <Text fontSize="xs" color="red.500" mt={1}>
                    {errors.education}
                  </Text>
                )}
              </Box>
            </Grid>
          </Box>

          {/* SECTION 4 — ADDRESS & CONTACT DETAILS */}
          <Box p={4} bg="gray.50" borderRadius="xl" boxShadow="sm">
            <Text fontWeight="700" fontSize="lg" mb={6}>
              ADDRESS & CONTACT DETAILS
            </Text>

            <Grid
              templateColumns={{ base: "1fr", md: "repeat(2,1fr)" }}
              gap={4}
              flex="1"
            >
              {/* UAE / Dubai Address */}
              <Box>
                <Text fontSize="sm" fontWeight="600" color="gray.600" mb={1}>
                  UAE / Dubai Address
                </Text>
                <Textarea
                  placeholder="Enter your UAE / Dubai address"
                  bg="white"
                  borderRadius="14px"
                  borderColor="gray.300"
                  _hover={{ borderColor: "gray.400" }}
                  _focus={{
                    borderColor: "gray.500",
                    boxShadow: "0 0 0 1px rgba(0,0,0,0.08)",
                  }}
                  value={form.uae_address}
                  onChange={(e) => updateField("uae_address", e.target.value)}
                  rows={3}
                />

                {errors.education && (
                  <Text fontSize="xs" color="red.500" mt={1}>
                    {errors.education}
                  </Text>
                )}
                {/* <Text fontSize="xs" color="gray.500" mt={1}>
                  Optional: use Google autocomplete if available
                </Text> */}
              </Box>

              {/* Home Country Address */}
              <Box>
                <Text fontSize="sm" fontWeight="600" color="gray.600" mb={1}>
                  Home Country Address
                </Text>
                <Select
                  placeholder="Select country"
                  size="md"
                  borderRadius="14px"
                  borderColor="gray.300"
                  bg="white"
                  fontSize="sm"
                  _hover={{ borderColor: "gray.400" }}
                  _focus={{
                    borderColor: "gray.500",
                    boxShadow: "0 0 0 1px rgba(0,0,0,0.08)",
                  }}
                  value={form.home_country}
                  onChange={(e) => updateField("home_country", e.target.value)}
                >
                  <option>UAE</option>
                  <option>Saudi Arabia</option>
                  <option>Pakistan</option>
                  <option>India</option>
                  <option>Egypt</option>
                </Select>

                {errors.home_country && (
                  <Text fontSize="xs" color="red.500" mt={1}>
                    {errors.home_country}
                  </Text>
                )}

                <Input
                  mt={2}
                  placeholder="Enter full address"
                  bg="white"
                  borderRadius="14px"
                  borderColor="gray.300"
                  _hover={{ borderColor: "gray.400" }}
                  _focus={{
                    borderColor: "gray.500",
                    boxShadow: "0 0 0 1px rgba(0,0,0,0.08)",
                  }}
                  value={form.home_country_address}
                  onChange={(e) =>
                    updateField("home_country_address", e.target.value)
                  }
                />

                {errors.home_country_address && (
                  <Text fontSize="xs" color="red.500" mt={1}>
                    {errors.home_country_address}
                  </Text>
                )}
              </Box>

              {/* International Phone Number */}
              <Box>
                <Text fontSize="sm" fontWeight="600" color="gray.600" mb={1}>
                  International Phone Number
                </Text>
                <Input
                  placeholder="+971 XX XXX XXXX"
                  bg="white"
                  borderRadius="14px"
                  borderColor="gray.300"
                  _hover={{ borderColor: "gray.400" }}
                  _focus={{
                    borderColor: "gray.500",
                    boxShadow: "0 0 0 1px rgba(0,0,0,0.08)",
                  }}
                  value={form.intl_phone}
                  onChange={(e) => updateField("intl_phone", e.target.value)}
                />

                {errors.intl_phone && (
                  <Text fontSize="xs" color="red.500" mt={1}>
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
          borderColor="gray.200"
          px={6}
          py={4}
          bg="white"
          justify={{ base: "center", md: "flex-end" }}
          gap={3}
          flexWrap="wrap"
          position="sticky"
          bottom={0}
          zIndex={10}
        >
          {/* Cancel Button */}
          <Button
            bg="gray.50"
            color="gray.800"
            border="1px solid #D0D5DD"
            size="md"
            borderRadius="12px"
            fontWeight="600"
            px={5}
            _hover={{ bg: "gray.100" }}
            boxShadow="0px 1px 3px rgba(0,0,0,0.08)"
            minW={{ base: "100%", md: "120px" }}
            onClick={onClose}
          >
            Cancel
          </Button>

          {/* Save Button */}
          <Button
            bg="teal.500"
            color="white"
            border="1px solid #D0D5DD"
            size="md"
            borderRadius="12px"
            fontWeight="600"
            px={5}
            _hover={{ bg: "teal.600" }}
            boxShadow="0px 1px 3px rgba(0,0,0,0.08)"
            minW={{ base: "100%", md: "120px" }}
            onClick={handleSubmit}
          >
            Save
          </Button>
        </Flex>
      </ModalContent>
    </Modal>
  );
}
