import { useSelector } from "react-redux";
import { validationLeadSearchSchema } from "schema/leadSchema";
import { useFormik } from "formik";
import React, { useEffect } from "react";

const LazyAdvancedSearchForm = React.lazy(() => import("./AdvancedSearchForm"));

const {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Spinner,
} = require("@chakra-ui/react");

const AdvancedSearchModal = ({
  advanceSearch,
  setAdvanceSearch,
  setQueryParams,
  setSearchClear,
  // setFormValues,
  isFormReset,
  setIsFormReset,
  setGetTagValues,
  setRefetchLoading,
}) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const tree = useSelector((state) => state.user.tree);

  const updateAdvancedSearchQuery = (advancedSearchData) => {
    setQueryParams((prev) => ({
      ...prev,
      page: 1, // Reset to first page on new search
      data: JSON.stringify(advancedSearchData),
    }));
  };

  const formClearHanlder = () => {
    // handleClear();
    formikResetForm();
  };

  const initialValues = {
    leadName: "",
    leadStatus: "",
    eLeadStatus: "",
    leadEmail: "",
    leadPhoneNumber: "",
    managerAssigned: "",
    agentAssigned: "",
    leadWhatsappNumber: "",
    nationality: "",
    ip: "",
    leadAddress: "",
    leadCampaign: "",
    leadSourceDetails: "",
    leadSourceMedium: "",
    pageUrl: "",
    r_u_in_uae: "",
    timetocall: "",
    leadLang: "",
    lastNote: "",
    budget: "",
  };

  const formik = useFormik({
    initialValues,
    validationSchema: validationLeadSearchSchema,
    onSubmit: (values, { formikResetForm }) => {
      // Initialize cleanedData and tags
      const { cleanedData, tags } = Object.entries(values).reduce(
        (acc, [key, value]) => {
          if (value !== "" && value !== undefined) {
            // Add raw value to cleanedData for API
            acc.cleanedData[key] = value;

            let displayValue = value;

            // Special formatting rules for score range
            if (key === "fromLeadScore" || key === "toLeadScore") {
              displayValue = `${values.fromLeadScore || 0}-${
                values.toLeadScore || "max"
              }`;
            }

            // Special formatting for leadStatus
            if (key === "leadStatus") {
              displayValue =
                value === "active"
                  ? "Interested"
                  : value === "pending"
                    ? "Not Interested"
                    : value;
            }

            // Special formatting for leadStatus
            if (key === "eLeadStatus") {
              displayValue = value === "-1" ? "No E.Status" : value;
            }

            // Handle agentAssigned
            if (key === "agentAssigned") {
              const agentsArray = Object.values(tree.agents).flatMap(
                (managerArray) => managerArray
              );
              const assignedAgent = agentsArray.find(
                (agent) => agent?._id?.toString() === value
              );

              displayValue = assignedAgent
                ? `${assignedAgent.firstName} ${assignedAgent.lastName}`
                : value === "-1"
                  ? "No Agent"
                  : value;
            }

            // Handle managerAssigned
            if (key === "managerAssigned") {
              const assignedManager = tree.managers.find(
                (user) => user?._id?.toString() === value
              );

              displayValue = assignedManager
                ? `${assignedManager.firstName} ${assignedManager.lastName}`
                : value === "-1"
                  ? "No Manager"
                  : value;
            }

            // Add formatted value to tags for UI
            acc.tags.push(`${key}: ${displayValue}`);
          }

          return acc;
        },
        { cleanedData: {}, tags: [] }
      );

      // Call API with cleaned data
      updateAdvancedSearchQuery(cleanedData);
      setAdvanceSearch(false);

      // Update UI with tags
      setGetTagValues(tags);
      setSearchClear(true);
      setRefetchLoading(true);
      // setFormValues(values);
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
  } = formik;

  // Send the reset function to the parent
  useEffect(() => {
    if (isFormReset) {
      formikResetForm();
      setIsFormReset(false);
    }
  }, [isFormReset, formikResetForm, setIsFormReset]);

  return (
    <React.Suspense fallback={<Spinner />}>
      <Modal
        size="6xl"
        onClose={() => {
          setAdvanceSearch(false);
          // formikResetForm();
        }}
        isOpen={advanceSearch}
        isCentered
        motionPreset="slideInBottom"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Advance Search</ModalHeader>
          <ModalCloseButton
            onClick={() => {
              setAdvanceSearch(false);
              formikResetForm();
            }}
          />
          <ModalBody width="100%">
            <LazyAdvancedSearchForm
              values={values}
              errors={errors}
              touched={touched}
              handleChange={handleChange}
              handleBlur={handleBlur}
              user={user}
              tree={tree}
            />
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="red"
              variant="outline"
              size="sm"
              mr={2}
              onClick={formClearHanlder}
            >
              Clear
            </Button>
            <Button colorScheme="brand" size="sm" onClick={handleSubmit}>
              Search
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </React.Suspense>
  );
};
export default AdvancedSearchModal;
