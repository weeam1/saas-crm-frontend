import {
  Box,
  useColorModeValue,
  Text,
  Flex,
  Heading,
  VStack,
  HStack,
  Button,
  Icon,
  Badge,
  Input,
  Alert,
  AlertIcon,
  AlertDescription,
  Spinner,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { constant } from "constant";
import {
  FaQrcode,
  FaFilePdf,
  FaUpload,
  FaEdit,
  FaDownload,
  FaCheck,
  FaEye,
  FaInfoCircle,
  FaSync,
} from "react-icons/fa";
import { toast } from "react-toastify";
import {
  useFetchItemsQuery,
  useCreateItemMutation,
  useLazyFetchItemsV2Query,
} from "api/apiSlice";

const QRSettings = () => {
  // State for PDF files - English and Arabic
  const [englishPdf, setEnglishPdf] = useState(null);
  const [arabicPdf, setArabicPdf] = useState(null);
  const [isUploadingEnglish, setIsUploadingEnglish] = useState(false);
  const [isUploadingArabic, setIsUploadingArabic] = useState(false);
  const [isLoadingFiles, setIsLoadingFiles] = useState(false);
  const [isDownloadingEnglish, setIsDownloadingEnglish] = useState(false);
  const [isDownloadingArabic, setIsDownloadingArabic] = useState(false);

  // API hooks
  const [createItem] = useCreateItemMutation();
  const [triggerDownload] = useLazyFetchItemsV2Query(); // For downloading files

  // GET API - fetch templates on component mount
  const {
    data: templateData,
    isLoading: isLoadingTemplates,
    refetch: refetchTemplates,
    error: templatesError,
  } = useFetchItemsQuery({ path: "/lead/invite/templates", params: {} });

  // Color mode values - ALL HOOKS AT THE TOP LEVEL
  const bgCard = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const textColor = useColorModeValue("gray.700", "gray.200");
  const headingColor = useColorModeValue("gray.800", "white");
  const subtleText = useColorModeValue("gray.500", "gray.400");
  const iconBg = useColorModeValue("blue.50", "blue.900");
  const iconColor = useColorModeValue("blue.500", "blue.200");
  const shadowColor = useColorModeValue(
    "0 10px 30px -5px rgba(0, 0, 0, 0.1)",
    "0 10px 30px -5px rgba(0, 0, 0, 0.3)",
  );
  const uploadBg = useColorModeValue("gray.50", "gray.700");
  const yellowBg = useColorModeValue("yellow.50", "yellow.900");
  const yellowText = useColorModeValue("yellow.700", "yellow.200");
  const infoBg = useColorModeValue("blue.50", "blue.900");
  const infoText = useColorModeValue("blue.700", "blue.200");
  const headerBg = useColorModeValue("gray.50", "gray.900");

  // Process template data when fetched
  useEffect(() => {
    if (templateData?.success && templateData?.data) {
      const { english, arabic } = templateData.data;

      // Process English PDF
      if (english?.file) {
        const englishFilename = english.file.split("/").pop();
        setEnglishPdf({
          name: englishFilename,
          serverFilename: englishFilename,
          serverPath: english.file,
          uploadedAt: new Date().toISOString(),
        });
      } else {
        setEnglishPdf(null);
      }

      // Process Arabic PDF
      if (arabic?.file) {
        const arabicFilename = arabic.file.split("/").pop();
        setArabicPdf({
          name: arabicFilename,
          serverFilename: arabicFilename,
          serverPath: arabic.file,
          uploadedAt: new Date().toISOString(),
        });
      } else {
        setArabicPdf(null);
      }
    }
  }, [templateData]);

  // Handle API errors
  useEffect(() => {
    if (templatesError) {
      console.error("Error fetching templates:", templatesError);
      toast.error("Failed to load existing templates", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  }, [templatesError]);

  // Function to manually refresh templates
  const refreshTemplates = async () => {
    setIsLoadingFiles(true);
    try {
      const result = await refetchTemplates();
      if (result.data?.success) {
        toast.success("Templates refreshed successfully", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } catch (error) {
      console.error("Error refreshing templates:", error);
      toast.error("Failed to refresh templates", {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setIsLoadingFiles(false);
    }
  };

  // Upload file to API
  const uploadFileToAPI = async (file, language) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("language", language);
    formData.append("type", "invitation");

    try {
      const response = await createItem({
        path: `/lead/invite/templates/upload/${language === "arabic" ? "ar" : "en"}`,
        body: formData,
      }).unwrap();

      console.log(`${language} upload response:`, response);

      toast.success(`${language} PDF uploaded successfully to server`, {
        position: "top-right",
        autoClose: 3000,
      });

      // Refresh templates after successful upload
      await refreshTemplates();

      return response;
    } catch (error) {
      console.error(`Error uploading ${language} PDF:`, error);
      toast.error(`Failed to upload ${language} PDF to server`, {
        position: "top-right",
        autoClose: 3000,
      });
      throw error;
    }
  };

  // Handle file upload for English
  const handleEnglishUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      toast.error("Please upload a PDF file for English invitation", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("Maximum file size is 10MB", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    setIsUploadingEnglish(true);

    try {
      await uploadFileToAPI(file, "english");
    } catch (error) {
      // Error is already handled in uploadFileToAPI
    } finally {
      setIsUploadingEnglish(false);
    }
  };

  // Handle file upload for Arabic
  const handleArabicUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      toast.error("Please upload a PDF file for Arabic invitation", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("Maximum file size is 10MB", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    setIsUploadingArabic(true);

    try {
      await uploadFileToAPI(file, "arabic");
    } catch (error) {
      // Error is already handled in uploadFileToAPI
    } finally {
      setIsUploadingArabic(false);
    }
  };

  // Replace the downloadFile function with this:
  const downloadFile = async (filename, language) => {
    if (!filename) {
      toast.error(`No ${language} file available`, {
        position: "top-right",
        autoClose: 2000,
      });
      return;
    }

    if (language === "english") {
      setIsDownloadingEnglish(true);
    } else {
      setIsDownloadingArabic(true);
    }

    try {
      const token =
        localStorage.getItem("accessToken") ||
        sessionStorage.getItem("accessToken");
      const baseUrl = `${constant["baseUrl"]}api`;

      const response = await fetch(
        `${baseUrl}/lead/invite/download/${filename}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const blob = await response.blob();

      // Create a download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;

      // Use a flag to track if download was initiated
      let downloadInitiated = false;

      // Handle the download
      link.onclick = () => {
        downloadInitiated = true;
      };

      document.body.appendChild(link);
      link.click();

      // Small delay to ensure download starts before cleanup
      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        // Only show success message if we're sure download started
        if (!downloadInitiated) {
          // If download wasn't initiated, it might have failed silently
          console.warn("Download may not have started properly");
        } else {
          toast.success(`Downloading ${filename}`, {
            position: "top-right",
            autoClose: 2000,
          });
        }
      }, 100);

      // Don't wait for the download to complete - it continues in background
      // Just clean up the loading state after a short delay
      setTimeout(() => {
        if (language === "english") {
          setIsDownloadingEnglish(false);
        } else {
          setIsDownloadingArabic(false);
        }
      }, 500);
    } catch (error) {
      console.error(`Error downloading ${language} file:`, error);

      // Check if it's a network error or abort error
      if (
        error.name === "AbortError" ||
        error.message === "The user aborted a request."
      ) {
        // This is often just the browser navigation during download
        console.log("Download aborted - this is normal during file download");
      } else {
        toast.error(error.message || `Failed to download ${language} file`, {
          position: "top-right",
          autoClose: 3000,
        });
      }

      // Reset loading state on error
      if (language === "english") {
        setIsDownloadingEnglish(false);
      } else {
        setIsDownloadingArabic(false);
      }
    }
  };

  // Handle download file
  const handleDownloadEnglish = () => {
    downloadFile(englishPdf?.serverFilename, "english");
  };

  const handleDownloadArabic = () => {
    downloadFile(arabicPdf?.serverFilename, "arabic");
  };

  // Check if both files are uploaded
  const bothFilesUploaded = englishPdf && arabicPdf;

  // Loading state
  if (isLoadingTemplates && !englishPdf && !arabicPdf) {
    return (
      <Box w="100%" p={6} textAlign="center">
        <Spinner size="xl" color="blue.500" />
        <Text mt={4} color={subtleText}>
          Loading templates...
        </Text>
      </Box>
    );
  }

  return (
    <Box w="100%" p={6}>
      {/* Guidance/Info Message - Always visible */}
      <Alert
        status="info"
        bg={infoBg}
        color={infoText}
        borderRadius="lg"
        mb={4}
        border="1px solid"
        borderColor={borderColor}
      >
        <AlertIcon as={FaInfoCircle} />
        <AlertDescription>
          <Text fontWeight="500">
            When lead status changes to "Will Attend", these uploaded PDFs will
            be automatically used for lead invitations based on language
            preference.
          </Text>
        </AlertDescription>
      </Alert>

      {/* Refresh Button */}
      <Flex justify="flex-end" mb={4}>
        <Button
          size="sm"
          colorScheme="blue"
          variant="outline"
          onClick={refreshTemplates}
          isLoading={isLoadingFiles}
          loadingText="Refreshing..."
          leftIcon={<FaSync />}
        >
          Refresh Templates
        </Button>
      </Flex>

      {/* Main Card */}
      <Box
        bg={bgCard}
        borderRadius="3xl"
        boxShadow={shadowColor}
        border="1px solid"
        borderColor={borderColor}
        overflow="hidden"
        maxW="800px"
        mx="auto"
      >
        {/* Header */}
        <Flex
          align="center"
          justify="space-between"
          p={6}
          borderBottom="1px solid"
          borderColor={borderColor}
          bg={headerBg}
        >
          <HStack spacing={3}>
            <Flex
              w="48px"
              h="48px"
              borderRadius="full"
              bg={iconBg}
              align="center"
              justify="center"
            >
              <Icon as={FaQrcode} boxSize="24px" color={iconColor} />
            </Flex>
            <VStack align="start" spacing={0}>
              <Heading size="lg" color={headingColor} fontWeight="700">
                Invitation PDFs
              </Heading>
              <Text color={subtleText} fontSize="sm">
                Upload English and Arabic PDF files for lead invitations
              </Text>
            </VStack>
          </HStack>
          {bothFilesUploaded && (
            <Badge
              colorScheme="green"
              fontSize="sm"
              px={3}
              py={1}
              borderRadius="full"
            >
              <HStack spacing={1}>
                <FaCheck />
                <Text>Both Files Ready</Text>
              </HStack>
            </Badge>
          )}
        </Flex>

        {/* Content */}
        <Box p={6}>
          <VStack spacing={6} w="100%">
            {/* English PDF Section - Top */}
            <Box
              w="100%"
              bg={uploadBg}
              borderRadius="2xl"
              p={6}
              border="2px dashed"
              borderColor={englishPdf ? "blue.400" : borderColor}
              transition="all 0.3s"
            >
              <VStack spacing={4} w="100%">
                <HStack w="100%" justify="space-between">
                  <Badge colorScheme="blue" fontSize="md" px={3} py={1}>
                    ENGLISH
                  </Badge>
                  {englishPdf && (
                    <Badge colorScheme="green" fontSize="xs">
                      Server File
                    </Badge>
                  )}
                </HStack>

                {!englishPdf ? (
                  // English Upload State
                  <VStack spacing={4} w="100%">
                    <Flex
                      w="80px"
                      h="80px"
                      borderRadius="full"
                      bg="blue.50"
                      align="center"
                      justify="center"
                    >
                      <Icon as={FaFilePdf} boxSize="40px" color="blue.500" />
                    </Flex>
                    <VStack spacing={2}>
                      <Text color={headingColor} fontSize="lg" fontWeight="600">
                        Upload English PDF
                      </Text>
                      <Text color={subtleText} fontSize="sm" textAlign="center">
                        Click to upload your English PDF file
                        <br />
                        (Max size: 10MB)
                      </Text>
                    </VStack>

                    <Button
                      as="label"
                      htmlFor="pdf-upload-english"
                      leftIcon={<Icon as={FaUpload} />}
                      colorScheme="blue"
                      size="lg"
                      borderRadius="full"
                      px={8}
                      cursor="pointer"
                      isLoading={isUploadingEnglish}
                      loadingText="Uploading"
                    >
                      Choose English PDF
                      <Input
                        id="pdf-upload-english"
                        type="file"
                        accept=".pdf"
                        onChange={handleEnglishUpload}
                        display="none"
                      />
                    </Button>
                  </VStack>
                ) : (
                  // English File Display
                  <VStack spacing={4} w="100%">
                    <Flex
                      w="100%"
                      p={4}
                      bg={bgCard}
                      borderRadius="xl"
                      align="center"
                      justify="space-between"
                      flexDirection={{ base: "column", sm: "row" }}
                      gap={4}
                    >
                      <HStack spacing={4}>
                        <Flex
                          w="60px"
                          h="60px"
                          bg="blue.50"
                          borderRadius="lg"
                          align="center"
                          justify="center"
                        >
                          <Icon
                            as={FaFilePdf}
                            boxSize="30px"
                            color="blue.500"
                          />
                        </Flex>
                        <VStack align="start" spacing={1}>
                          <Text
                            color={headingColor}
                            fontWeight="600"
                            maxW="200px"
                            noOfLines={1}
                          >
                            {englishPdf.name}
                          </Text>
                          <Text color={subtleText} fontSize="sm">
                            Server file ready for download
                          </Text>
                        </VStack>
                      </HStack>

                      <HStack spacing={2}>
                        <Button
                          as="label"
                          htmlFor="pdf-upload-english-edit"
                          leftIcon={<Icon as={FaEdit} />}
                          colorScheme="blue"
                          variant="ghost"
                          size="sm"
                          cursor="pointer"
                        >
                          Replace
                          <Input
                            id="pdf-upload-english-edit"
                            type="file"
                            accept=".pdf"
                            onChange={handleEnglishUpload}
                            display="none"
                          />
                        </Button>

                        <Button
                          leftIcon={<Icon as={FaDownload} />}
                          colorScheme="blue"
                          variant="ghost"
                          size="sm"
                          onClick={handleDownloadEnglish}
                          isDisabled={
                            !englishPdf?.serverFilename || isDownloadingEnglish
                          }
                          isLoading={isDownloadingEnglish}
                          loadingText="Downloading..."
                        >
                          Download
                        </Button>
                      </HStack>
                    </Flex>
                  </VStack>
                )}
              </VStack>
            </Box>

            {/* Arabic PDF Section - Bottom */}
            <Box
              w="100%"
              bg={uploadBg}
              borderRadius="2xl"
              p={6}
              border="2px dashed"
              borderColor={arabicPdf ? "green.400" : borderColor}
              transition="all 0.3s"
            >
              <VStack spacing={4} w="100%">
                <HStack w="100%" justify="space-between">
                  <Badge colorScheme="green" fontSize="md" px={3} py={1}>
                    ARABIC
                  </Badge>
                  {arabicPdf && (
                    <Badge colorScheme="green" fontSize="xs">
                      Server File
                    </Badge>
                  )}
                </HStack>

                {!arabicPdf ? (
                  // Arabic Upload State
                  <VStack spacing={4} w="100%">
                    <Flex
                      w="80px"
                      h="80px"
                      borderRadius="full"
                      bg="green.50"
                      align="center"
                      justify="center"
                    >
                      <Icon as={FaFilePdf} boxSize="40px" color="green.500" />
                    </Flex>
                    <VStack spacing={2}>
                      <Text color={headingColor} fontSize="lg" fontWeight="600">
                        Upload Arabic PDF
                      </Text>
                      <Text color={subtleText} fontSize="sm" textAlign="center">
                        Click to upload your Arabic PDF file
                        <br />
                        (Max size: 10MB)
                      </Text>
                    </VStack>

                    <Button
                      as="label"
                      htmlFor="pdf-upload-arabic"
                      leftIcon={<Icon as={FaUpload} />}
                      colorScheme="green"
                      size="lg"
                      borderRadius="full"
                      px={8}
                      cursor="pointer"
                      isLoading={isUploadingArabic}
                      loadingText="Uploading"
                    >
                      Choose Arabic PDF
                      <Input
                        id="pdf-upload-arabic"
                        type="file"
                        accept=".pdf"
                        onChange={handleArabicUpload}
                        display="none"
                      />
                    </Button>
                  </VStack>
                ) : (
                  // Arabic File Display
                  <VStack spacing={4} w="100%">
                    <Flex
                      w="100%"
                      p={4}
                      bg={bgCard}
                      borderRadius="xl"
                      align="center"
                      justify="space-between"
                      flexDirection={{ base: "column", sm: "row" }}
                      gap={4}
                    >
                      <HStack spacing={4}>
                        <Flex
                          w="60px"
                          h="60px"
                          bg="green.50"
                          borderRadius="lg"
                          align="center"
                          justify="center"
                        >
                          <Icon
                            as={FaFilePdf}
                            boxSize="30px"
                            color="green.500"
                          />
                        </Flex>
                        <VStack align="start" spacing={1}>
                          <Text
                            color={headingColor}
                            fontWeight="600"
                            maxW="200px"
                            noOfLines={1}
                          >
                            {arabicPdf.name}
                          </Text>
                          <Text color={subtleText} fontSize="sm">
                            Server file ready for download
                          </Text>
                        </VStack>
                      </HStack>

                      <HStack spacing={2}>
                        <Button
                          as="label"
                          htmlFor="pdf-upload-arabic-edit"
                          leftIcon={<Icon as={FaEdit} />}
                          colorScheme="green"
                          variant="ghost"
                          size="sm"
                          cursor="pointer"
                        >
                          Replace
                          <Input
                            id="pdf-upload-arabic-edit"
                            type="file"
                            accept=".pdf"
                            onChange={handleArabicUpload}
                            display="none"
                          />
                        </Button>

                        <Button
                          leftIcon={<Icon as={FaDownload} />}
                          colorScheme="blue"
                          variant="ghost"
                          size="sm"
                          onClick={handleDownloadArabic}
                          isDisabled={
                            !arabicPdf?.serverFilename || isDownloadingArabic
                          }
                          isLoading={isDownloadingArabic}
                          loadingText="Downloading..."
                        >
                          Download
                        </Button>
                      </HStack>
                    </Flex>
                  </VStack>
                )}
              </VStack>
            </Box>
          </VStack>

          {/* Guidance Messages */}
          {!bothFilesUploaded && (
            <Alert
              status="warning"
              bg={yellowBg}
              color={yellowText}
              borderRadius="lg"
              mt={6}
            >
              <AlertIcon />
              <AlertDescription>
                Please upload both English and Arabic PDF files for complete
                bilingual support.
              </AlertDescription>
            </Alert>
          )}

          {bothFilesUploaded && (
            <Flex
              mt={6}
              p={4}
              bg={infoBg}
              borderRadius="lg"
              align="center"
              justify="center"
              flexDirection="column"
            >
              <Text color={infoText} fontSize="sm" fontWeight="500">
                ✓ Both PDF files are ready. They will be used for lead
                invitations based on lead's language preference when status is
                "Will Attend".
              </Text>
            </Flex>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default QRSettings;
