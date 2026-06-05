import React, { useEffect, Suspense } from "react";
import { useSelector } from "react-redux";
import { useFormik } from "formik";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Spinner,
  Flex,
  Divider,
  Text,  // ← Remove useColorModeValue from imports
} from "@chakra-ui/react";
import { validationLeadSearchSchema } from "schema/leadSchema";
import { leadStatus, mainLeadStatus } from "utils/options";
import { formattedDate, toPureUTCString, toUTCString } from "utils/helpers";

const LazyAdvancedSearchForm = React.lazy(() => import("./AdvancedSearchForm"));

const AdvancedSearchModal = ({
  advanceSearch,
  setAdvanceSearch,
  setQueryParams,
  setSearchClear,
  isFormReset,
  setIsFormReset,
  setRefetchLoading,
  setSearchQueryParams,
}) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const tree = useSelector((state) => state.user.tree);

  // ❌ DELETE THESE 4 LINES:
  // const bgColor = useColorModeValue("white", "gray.800");
  // const headerColor = useColorModeValue("brand.300", "brand.100");
  // const textColor = useColorModeValue("brand.700", "brand.900");
  // const closeBtnColor = useColorModeValue("brand.700", "brand.900");

  const updateAdvancedSearchQuery = (advancedSearchData) => {
    setSearchQueryParams({ data: advancedSearchData });
  };

  const initialValues = {
    intID: "",
    leadName: "",
    leadStatus: "",
    eLeadStatus: "",
    leadEmail: "",
    leadPhoneNumber: "",
    managerAssigned: "",
    teamLeadAssigned: "",
    agentAssigned: "",
    leadWhatsappNumber: "",
    nationality: "",
    ip: "",
    leadAddress: "",
    leadCampaign: "",
    leadSource: "",
    leadSourceDetails: "",
    leadSourceMedium: "",
    leadSourceChannel: "",
    adset: "",
    pageUrl: "",
    r_u_in_uae: "",
    timetocall: "",
    leadLang: "",
    lastNote: "",
    country: "",
    budget: "",
    isReleased: "",
    from: "",
    to: "",
    mainStatusSort: "",
    countryCode: "",
  };

  const formik = useFormik({
    initialValues,
    validationSchema: validationLeadSearchSchema,
    onSubmit: (values) => {
      const { cleanedData, tags } = Object.entries(values).reduce(
        (acc, [key, value]) => {
          if (value !== "" && value !== undefined) {
            acc.cleanedData[key] = value;
            let displayValue = value;

            if (key === "leadStatus") {
              displayValue =
                value === "active"
                  ? "Interested"
                  : value === "pending"
                    ? "Not Interested"
                    : leadStatus[value];
            } else if (key === "eLeadStatus") {
              displayValue =
                value === "-1" ? "No E.Status" : mainLeadStatus[value];
            } else if (key === "agentAssigned") {
              const agentsArray = Object.values(tree.agents).flatMap(
                (managerArray) => managerArray,
              );
              const assignedAgent = agentsArray.find(
                (agent) => agent?._id?.toString() === value,
              );
              displayValue = assignedAgent
                ? `${assignedAgent.firstName} ${assignedAgent.lastName}`
                : value === "-1"
                  ? "No Agent"
                  : value;
            } else if (key === "managerAssigned") {
              const assignedManager = tree.managers.find(
                (user) => user?._id?.toString() === value,
              );
              displayValue = assignedManager
                ? `${assignedManager.firstName} ${assignedManager.lastName}`
                : value === "-1"
                  ? "No Manager"
                  : value;
            } else if (key === "teamLeadAssigned") {
              const assignedTeamLead = tree.teamLeads?.find(
                (user) => user?._id?.toString() === value,
              );
              displayValue = assignedTeamLead
                ? `${assignedTeamLead.firstName} ${assignedTeamLead.lastName}`
                : value === "-1"
                  ? "No Team Lead"
                  : value;
            } else if (key === "startDate" || key === "endDate") {
              const utcDate = toPureUTCString(value);
              acc.cleanedData[key] = utcDate;
              displayValue = utcDate;
            }

            let label = key
              .replace(/([A-Z])/g, " $1")
              .replace(/^./, (str) => str.toUpperCase())
              .trim();

            switch (key) {
              case "leadStatus":
                label = "Lead Status";
                break;
              case "eLeadStatus":
                label = "E. Lead Status";
                break;
              case "agentAssigned":
                label = "Agent Assigned";
                break;
              case "managerAssigned":
                label = "Manager Assigned";
                break;
              case "teamLeadAssigned":
                label = "Team Lead Assigned";
                break;
              case "from":
                label = "Start Date";
                break;
              case "to":
                label = "End Date";
                break;
              case "mainStatusSort":
                label = "Sort By";
                break;
              case "isReleased":
                label = "Released Status";
                break;
            }

            acc.tags.push({
              key: label,
              value: displayValue,
              originalKey: key,
            });
          }
          return acc;
        },
        { cleanedData: {}, tags: [] },
      );

      updateAdvancedSearchQuery(cleanedData);
      setAdvanceSearch(false);
      setSearchClear(true);
      setRefetchLoading(true);
    },
  });

  const {
    errors,
    touched,
    values,
    handleBlur,
    handleChange,
    handleSubmit,
    resetForm: formikResetForm,
    dirty,
    setFieldValue,
  } = formik;

  const handleClear = () => {
    formikResetForm();
  };

  useEffect(() => {
    if (isFormReset) {
      formikResetForm();
      setIsFormReset(false);
    }
  }, [isFormReset, formikResetForm, setIsFormReset]);

  return (
    <Suspense fallback={<Spinner />}>
      <Modal
        size="6xl"
        onClose={() => {
          setAdvanceSearch(false);
        }}
        isOpen={advanceSearch}
        isCentered
        scrollBehavior="inside"
        motionPreset="slideInBottom"
      >
        <ModalOverlay />

        <ModalContent
          bg="bg.surface"  // ← CHANGE: was bg={bgColor}
          borderRadius="2xl"
          shadow="2xl"
          maxW={{ base: "full", sm: "full", md: "80vw" }}
          maxH="90vh"
          overflow="hidden"
          mx={{ base: 2, sm: 2, md: 0 }}
        >
          {/* Header */}
          <ModalHeader
            p={0}
            fontWeight="semibold"
            fontSize="lg"
            borderBottom="1px solid"
            borderColor="border.default"  // ← CHANGE: was "gray.200"
          >
            <Flex
              align="center"
              justify="space-between"
              bg="bg.elevated"  // ← CHANGE: was bg={headerColor}
              color="text.heading"  // ← CHANGE: was color={textColor}
              px={6}
              py={3}
              position="sticky"
              top="0"
              zIndex="10"
              boxShadow="md"
            >
              <Text
                fontSize={{ base: "md", md: "lg" }}
                fontWeight="semibold"
                letterSpacing="wide"
                noOfLines={1}
                textOverflow="ellipsis"
                overflow="hidden"
                whiteSpace="nowrap"
                  color="text.heading"
              >
                Advanced Lead Search
              </Text>
              <ModalCloseButton
                color="text.muted"  // ← CHANGE: was color={closeBtnColor}
                position="relative"
                top="0"
              />
            </Flex>
          </ModalHeader>

          {/* Body */}
          <ModalBody
            p={4}
            overflowY="auto"
            maxH="65vh"
            bg="bg.app"  // ← CHANGE: was bg={useColorModeValue("gray.50", "gray.900")}
          >
            <LazyAdvancedSearchForm
              values={values}
              errors={errors}
              touched={touched}
              handleChange={handleChange}
              handleBlur={handleBlur}
              user={user}
              tree={tree}
              setFieldValue={setFieldValue}
            />
          </ModalBody>

          <Divider borderColor="border.default" />  {/* ← ADD borderColor */}

          {/* Footer */}
          <ModalFooter
            position="sticky"
            bottom="0"
            bg="bg.surface"  // ← CHANGE: was bg={bgColor}
            borderTop="1px solid"
            borderColor="border.default"  // ← CHANGE: was "gray.200"
            py={3}
            px={5}
            zIndex="10"
            justifyContent="flex-end"
            gap={3}
          >
            <Button
              variant="outline"  // ← CHANGE: was colorScheme="gray"
              onClick={handleClear}
            >
              Clear
            </Button>

            <Button
              variant="brand"  // ← CHANGE: was colorScheme="brand"
              onClick={handleSubmit}
              isDisabled={!dirty}
            >
              Search
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Suspense>
  );
};

export default AdvancedSearchModal;
// import { useSelector } from 'react-redux';
// import { validationLeadSearchSchema } from 'schema/leadSchema';
// import { useFormik } from 'formik';
// import React, { useEffect } from 'react';
// import { leadStatus } from 'utils/options';
// import { mainLeadStatus } from 'utils/options';

// const LazyAdvancedSearchForm = React.lazy(() => import('./AdvancedSearchForm'));

// const {
// 	Modal,
// 	ModalOverlay,
// 	ModalContent,
// 	ModalHeader,
// 	ModalCloseButton,
// 	ModalBody,
// 	ModalFooter,
// 	Button,
// 	Spinner,
// } = require('@chakra-ui/react');

// const AdvancedSearchModal = ({
// 	advanceSearch,
// 	setAdvanceSearch,
// 	setQueryParams,
// 	setSearchClear,
// 	// setFormValues,
// 	isFormReset,
// 	setIsFormReset,
// 	//setGetTagValues,
// 	setRefetchLoading,
// 	setSearchQueryParams,
// }) => {
// 	const user = JSON.parse(localStorage.getItem('user'));
// 	const tree = useSelector((state) => state.user.tree);

// 	const updateAdvancedSearchQuery = (advancedSearchData) => {
// 		// setQueryParams((prev) => ({
// 		// 	...prev,
// 		// 	page: 1,
// 		// 	data: JSON.stringify(advancedSearchData),
// 		// }));

// 		setSearchQueryParams({ data: advancedSearchData });
// 	};

// 	const formClearHanlder = () => {
// 		// handleClear();
// 		formikResetForm();
// 	};

// 	const initialValues = {
// 		intID: '',
// 		leadName: '',
// 		leadStatus: '',
// 		eLeadStatus: '',
// 		leadEmail: '',
// 		leadPhoneNumber: '',
// 		managerAssigned: '',
// 		agentAssigned: '',
// 		leadWhatsappNumber: '',
// 		nationality: '',
// 		ip: '',
// 		leadAddress: '',
// 		leadCampaign: '',
// 		leadSourceDetails: '',
// 		leadSourceMedium: '',
// 		pageUrl: '',
// 		r_u_in_uae: '',
// 		timetocall: '',
// 		leadLang: '',
// 		lastNote: '',
// 		budget: '',
// 		isReleased: '',
// 	};

// 	const formik = useFormik({
// 		initialValues,
// 		validationSchema: validationLeadSearchSchema,
// 		onSubmit: (values, { formikResetForm }) => {
// 			// Initialize cleanedData and tags
// 			const { cleanedData, tags } = Object.entries(values).reduce(
// 				(acc, [key, value]) => {
// 					if (value !== '' && value !== undefined) {
// 						// Add raw value to cleanedData for API
// 						acc.cleanedData[key] = value;

// 						let displayValue = value;

// 						// Special formatting rules for score range
// 						if (key === 'fromLeadScore' || key === 'toLeadScore') {
// 							displayValue = `${values.fromLeadScore || 0}-${
// 								values.toLeadScore || 'max'
// 							}`;
// 						}

// 						// Special formatting for leadStatus
// 						if (key === 'leadStatus') {
// 							displayValue =
// 								value === 'active'
// 									? 'Interested'
// 									: value === 'pending'
// 										? 'Not Interested'
// 										: leadStatus[value];
// 						}

// 						// Special formatting for leadStatus
// 						if (key === 'eLeadStatus') {
// 							displayValue =
// 								value === '-1' ? 'No E.Status' : mainLeadStatus[value];
// 						}

// 						// Handle agentAssigned
// 						if (key === 'agentAssigned') {
// 							const agentsArray = Object.values(tree.agents).flatMap(
// 								(managerArray) => managerArray
// 							);
// 							const assignedAgent = agentsArray.find(
// 								(agent) => agent?._id?.toString() === value
// 							);

// 							displayValue = assignedAgent
// 								? `${assignedAgent.firstName} ${assignedAgent.lastName}`
// 								: value === '-1'
// 									? 'No Agent'
// 									: value;
// 						}

// 						// Handle managerAssigned
// 						if (key === 'managerAssigned') {
// 							const assignedManager = tree.managers.find(
// 								(user) => user?._id?.toString() === value
// 							);

// 							displayValue = assignedManager
// 								? `${assignedManager.firstName} ${assignedManager.lastName}`
// 								: value === '-1'
// 									? 'No Manager'
// 									: value;
// 						}

// 						// Add formatted value to tags for UI
// 						acc.tags.push(`${key}: ${displayValue}`);
// 					}

// 					return acc;
// 				},
// 				{ cleanedData: {}, tags: [] }
// 			);

// 			// Call API with cleaned data
// 			updateAdvancedSearchQuery(cleanedData);
// 			setAdvanceSearch(false);

// 			// Update UI with tags
// 			// //setGetTagValues(tags);
// 			setSearchClear(true);
// 			setRefetchLoading(true);
// 			// setFormValues(values);
// 		},
// 	});

// 	const {
// 		errors,
// 		touched,
// 		values,
// 		handleBlur,
// 		handleChange,
// 		handleSubmit,
// 		resetForm: formikResetForm,
// 		dirty,
// 		setFieldValue,
// 	} = formik;

// 	// Send the reset function to the parent
// 	useEffect(() => {
// 		if (isFormReset) {
// 			formikResetForm();
// 			setIsFormReset(false);
// 		}
// 	}, [isFormReset, formikResetForm, setIsFormReset]);

// 	return (
// 		<React.Suspense fallback={<Spinner />}>
// 			<Modal
// 				size='6xl'
// 				onClose={() => {
// 					setAdvanceSearch(false);
// 					// formikResetForm();
// 				}}
// 				isOpen={advanceSearch}
// 				isCentered
// 				motionPreset='slideInBottom'
// 			>
// 				<ModalOverlay />
// 				<ModalContent>
// 					<ModalHeader>Advance Search</ModalHeader>
// 					<ModalCloseButton
// 						onClick={() => {
// 							setAdvanceSearch(false);
// 							formikResetForm();
// 						}}
// 					/>
// 					<ModalBody width='100%'>
// 						<LazyAdvancedSearchForm
// 							values={values}
// 							errors={errors}
// 							touched={touched}
// 							handleChange={handleChange}
// 							handleBlur={handleBlur}
// 							user={user}
// 							tree={tree}
// 							setFieldValue={setFieldValue}
// 						/>
// 					</ModalBody>
// 					<ModalFooter>
// 						<Button
// 							colorScheme='red'
// 							variant='outline'
// 							size='sm'
// 							mr={2}
// 							onClick={formClearHanlder}
// 						>
// 							Clear
// 						</Button>
// 						<Button
// 							colorScheme='brand'
// 							size='sm'
// 							onClick={handleSubmit}
// 							disabled={!dirty}
// 						>
// 							Search
// 						</Button>
// 					</ModalFooter>
// 				</ModalContent>
// 			</Modal>
// 		</React.Suspense>
// 	);
// };
// export default AdvancedSearchModal;
