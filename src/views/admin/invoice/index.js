import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import BankAccounts from "../bankAccountsV2/index";
import InvoiceDevelopers from "./developers/index";
import Projects from "./../developers/projects";
import TabNavigationDisplay from "../../../components/TabNavigationDisplay/TabNavigationDisplay";
import {
  Button,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Box,
  Text,
  Flex,
  SimpleGrid,
} from "@chakra-ui/react";
import {
  useFetchItemsQuery,
  useCreateItemMutation,
  useUpdateItemMutation,
} from "api/apiSlice";
import { toast } from "react-toastify";

const DEFAULT_TAB = "bank accounts";

const InvoiceModule = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const role =
    user?.role === "superAdmin" ? "superAdmin" : user?.roles[0]?.roleName;
  const [searchParams, setSearchParams] = useSearchParams();
  const [tabKey, setTabKey] = useState(0);
  const {
    isOpen: isSettingsOpen,
    onOpen: onSettingsOpen,
    onClose: onSettingsClose,
  } = useDisclosure();
  const {
    isOpen: isViewOpen,
    onOpen: onViewOpen,
    onClose: onViewClose,
  } = useDisclosure();

  const [settingsForm, setSettingsForm] = useState({
    location: "",
    TRN: "",
    contactNumberPrimary: "",
    contactNumberAlternate: "",
    currency: "AED",
  });
  const [editId, setEditId] = useState(null);
  const [hasSettings, setHasSettings] = useState(false);

  const { data: settingsResponse, refetch: refetchSettings } =
    useFetchItemsQuery(
      { path: "/invoices/settings" },
      { skip: role !== "superAdmin" }
    );

  const [createSetting] = useCreateItemMutation();
  const [updateSetting] = useUpdateItemMutation();

  const tabsData = [
    {
      label: "Bank Accounts",
      param: "bank accounts",
      title: "Developer Bank Details",
      description:
        "Access bank account information for developers including account names, numbers, IBANs, Swift codes, and associated bank details.",
      component: <BankAccounts key={tabKey} />,
    },
    {
      label: "Developers",
      param: "developers",
      title: "Developer Information",
      description:
        "View essential details about developers including their names, contact emails, and city locations.",
      component: <InvoiceDevelopers key={tabKey} />,
    },
    {
      label: "Projects",
      param: "projects",
      title: "Projects Information",
      description:
        "View essential details about projects including their names, and developer.",
      component: <Projects key={tabKey} />,
    },
  ];

  const tabFromParams = searchParams.get("tab") || DEFAULT_TAB;
  const activeTabIndex = Math.max(
    0,
    tabsData.findIndex((tab) => tab.param === tabFromParams.toLowerCase())
  );

  useEffect(() => {
    if (
      !searchParams.get("tab") ||
      !tabsData.some((tab) => tab.param === searchParams.get("tab"))
    ) {
      setSearchParams({ tab: DEFAULT_TAB });
    }
  }, [searchParams, setSearchParams]);

  useEffect(() => {
    if (settingsResponse) {
      const isEmpty =
        !settingsResponse.doc || Object.keys(settingsResponse.doc).length === 0;
      setHasSettings(!isEmpty);
      if (!isEmpty) {
        setSettingsForm(settingsResponse.doc);
        setEditId(settingsResponse.doc._id);
      } else {
        resetForm();
      }
    }
  }, [settingsResponse]);

  const resetForm = () => {
    setSettingsForm({
      location: "",
      TRN: "",
      contactNumberPrimary: "",
      contactNumberAlternate: "",
      currency: "AED",
    });
    setEditId(null);
  };

  const handleTabChange = (index) => {
    const tabParam = tabsData[index].param;
    setSearchParams({ tab: tabParam });

    if (index === activeTabIndex) {
      setTabKey((prev) => prev + 1);
    }
  };

  const handleSettingsOpen = () => {
    refetchSettings();
    onSettingsOpen();
  };

  const handleViewOpen = () => {
    refetchSettings();
    onViewOpen();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSettingsForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      if (editId) {
        await updateSetting({
          path: `/invoices/settings/${editId}`,
          body: settingsForm,
        }).unwrap();
        toast({
          title: "Settings updated",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } else {
        await createSetting({
          path: "/invoices/settings",
          body: settingsForm,
        }).unwrap();
        toast({
          title: "Settings created",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      }
      refetchSettings();
      onSettingsClose();
      handleViewOpen();
    } catch (err) {
      toast({
        title: "Error",
        description: err.data?.message || "Something went wrong",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  console.log("hasSettings", hasSettings);
  return (
    <>
      <Flex justifyContent={"flex-end"} marginRight={5}>
        {role === "superAdmin" ? (
          hasSettings ? (
            <Button
              onClick={handleViewOpen}
              bg="gray.200"
              color="black"
              _hover={{ bg: "gray.300" }}
              borderRadius={"md"}
            >
              Settings
            </Button>
          ) : (
            <Button
              onClick={handleSettingsOpen}
              bg="gray.200"
              color="black"
              _hover={{ bg: "gray.300" }}
              borderRadius={"md"}
            >
              Settings
            </Button>
          )
        ) : null}
      </Flex>
      <TabNavigationDisplay
        tabsData={tabsData.map((tab) => ({
          ...tab,
          component:
            tab.param === tabFromParams.toLowerCase() ? tab.component : null,
        }))}
        activeTab={activeTabIndex}
        onTabChange={handleTabChange}
      />

      {/* Settings Modal */}
      <Modal isOpen={isSettingsOpen} onClose={onSettingsClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {hasSettings ? "Edit Invoice Settings" : "Add Invoice Settings"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl mb={4}>
              <FormLabel>Location</FormLabel>
              <Input
                name="location"
                value={settingsForm.location}
                onChange={handleInputChange}
                placeholder="e.g. Dubai, UAE"
                focusBorderColor="brand.300"
              />
            </FormControl>

            <FormControl mb={4}>
              <FormLabel>TRN</FormLabel>
              <Input
                name="TRN"
                value={settingsForm.TRN}
                onChange={handleInputChange}
                placeholder="123456789123456"
                focusBorderColor="brand.300"
              />
            </FormControl>

            <FormControl mb={4}>
              <FormLabel>Primary Contact Number</FormLabel>
              <Input
                name="contactNumberPrimary"
                value={settingsForm.contactNumberPrimary}
                onChange={handleInputChange}
                placeholder="+971501234567"
                focusBorderColor="brand.300"
              />
            </FormControl>

            <FormControl mb={4}>
              <FormLabel>Alternate Contact Number</FormLabel>
              <Input
                name="contactNumberAlternate"
                value={settingsForm.contactNumberAlternate}
                onChange={handleInputChange}
                placeholder="+971442345678"
                focusBorderColor="brand.300"
              />
            </FormControl>

            <FormControl mb={4}>
              <FormLabel>Currency</FormLabel>
              <Input
                name="currency"
                value={settingsForm.currency}
                onChange={handleInputChange}
                placeholder="AED"
                focusBorderColor="brand.300"
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="brand" mr={3} onClick={handleSubmit}>
              {hasSettings ? "Update" : "Save"}
            </Button>
            <Button onClick={onSettingsClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* View Settings Modal */}
      <Modal isOpen={isViewOpen} onClose={onViewClose} size="md">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Invoice Settings</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            {hasSettings ? (
              <Box>
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                  <FormControl>
                    <FormLabel>Location</FormLabel>
                    <Input
                      value={settingsForm.location || "Not specified"}
                      isDisabled
                      bg="gray.50"
                      borderColor="gray.200"
                      _disabled={{ color: "gray.800" }}
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel>TRN</FormLabel>
                    <Input
                      value={settingsForm.TRN || "Not specified"}
                      isDisabled
                      bg="gray.50"
                      borderColor="gray.200"
                      _disabled={{ color: "gray.800" }}
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel>Primary Contact</FormLabel>
                    <Input
                      value={
                        settingsForm.contactNumberPrimary || "Not specified"
                      }
                      isDisabled
                      bg="gray.50"
                      borderColor="gray.200"
                      _disabled={{ color: "gray.800" }}
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel>Alternate Contact</FormLabel>
                    <Input
                      value={
                        settingsForm.contactNumberAlternate || "Not specified"
                      }
                      isDisabled
                      bg="gray.50"
                      borderColor="gray.200"
                      _disabled={{ color: "gray.800" }}
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel>Currency</FormLabel>
                    <Input
                      value={settingsForm.currency || "Not specified"}
                      isDisabled
                      bg="gray.50"
                      borderColor="gray.200"
                      _disabled={{ color: "gray.800" }}
                    />
                  </FormControl>
                </SimpleGrid>
              </Box>
            ) : (
              <Text>No settings found</Text>
            )}
          </ModalBody>

          <ModalFooter>
             <Button onClick={onViewClose} mr={3}>Close</Button>
            <Button
              colorScheme="brand"
              onClick={() => {
                onViewClose();
                handleSettingsOpen();
              }}
            >
              Edit Settings
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default InvoiceModule;
