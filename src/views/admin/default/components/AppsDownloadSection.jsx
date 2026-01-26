import { Box, Flex, Image, Text, Link } from "@chakra-ui/react";
import { useFetchItemsQuery } from "api/apiSlice";
import { constant } from "constant";
import React from "react";
import { toast } from "react-toastify";
// import AppDownloadNotificationBar from './AppDownloadNotificationBar';

const AppsDownloadSection = () => {
  const { data } = useFetchItemsQuery(
    { path: `/upload/apk` },
    { refetchOnMountOrArgChange: true },
  );

  const handleDownloadApk = async () => {
    try {
      const apkPath = data?.url;
      if (!apkPath) {
        toast.error("APK file not available");
        return;
      }
      const apkURL = `${constant["baseUrl"]}${apkPath}`;
      const response = await fetch(apkURL, { method: "HEAD" });
      if (!response.ok) {
        toast.error("APK file not found on server");
        return;
      }
      const link = document.createElement("a");
      link.href = apkURL;
      link.download = apkURL.split("/").pop();
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("Download started");
    } catch (error) {
      console.error("Error downloading APK:", error);
      toast.error("Failed to download APK");
    }
  };

  return (
    <>
      {/* <AppDownloadNotificationBar onDownloadApk={handleDownloadApk} /> */}
      <Flex
        // bg='linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        bg="linear-gradient(135deg, #F5ECCB 0%, #B79045 100%)"
        p="6"
        rounded="xl"
        alignItems="center"
        justifyContent="center"
        flexDirection="column"
        shadow="xl"
        // border='1px solid'
        // borderColor='whiteAlpha.300'
        position="relative"
        overflow="hidden"
      >
        {/* Background elements */}
        <Box
          position="absolute"
          top="-50px"
          right="-50px"
          w={{ base: "120px", md: "200px" }}
          h={{ base: "120px", md: "200px" }}
          bg="whiteAlpha.200"
          rounded="full"
        />
        <Box
          position="absolute"
          bottom="-30px"
          left="-30px"
          w={{ base: "80px", md: "150px" }}
          h={{ base: "80px", md: "150px" }}
          bg="whiteAlpha.200"
          rounded="full"
        />

        <Box
          display="flex"
          flexDirection={{ base: "column", md: "row" }}
          justifyContent="space-evenly"
          align="center"
          width="full"
        >
          <Box>
            {/* Main content */}
            <Text
              fontSize="xl"
              fontWeight="bold"
              color="gray.800"
              mb={3}
              textAlign="center"
              zIndex="1"
            >
              Get Weam Mobile App
            </Text>

            <Text
              fontSize="sm"
              color="gray.700"
              mb={7}
              textAlign="center"
              maxW="400px"
              lineHeight="1.6"
              zIndex="1"
            >
              Streamline your workflow with our powerful mobile CRM solution.
              Available on both platforms.
            </Text>
          </Box>

          {/* App badges */}
          <Flex
            gap={5}
            my={2}
            alignItems="center"
            // zIndex='1'
            flexWrap="wrap"
            justifyContent="center"
          >
            {data?.url && (
              <Link
                onClick={handleDownloadApk}
                _hover={{
                  transform: "translateY(-2px)",
                  transition: "all 0.3s",
                }}
                transition="all 0.3s ease-in-out"
                flexShrink={0}
              >
                <Image
                  src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                  alt="Get it on Google Play"
                  height="40px"
                  filter="drop-shadow(0 4px 12px rgba(0, 0, 0, 0.25))"
                  _hover={{
                    filter: "drop-shadow(0 6px 16px rgba(0, 0, 0, 0.35))",
                  }}
                />
              </Link>
            )}
            <Link
              href="https://apps.apple.com/pk/app/weeam-crm/id6744808346"
              isExternal
              _hover={{ transform: "translateY(-2px)", transition: "all 0.3s" }}
              transition="all 0.3s ease-in-out"
              flexShrink={0}
            >
              <Image
                src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg"
                alt="Download on the App Store"
                height="40px"
                filter="drop-shadow(0 4px 12px rgba(0, 0, 0, 0.25))"
                _hover={{
                  filter: "drop-shadow(0 6px 16px rgba(0, 0, 0, 0.35))",
                }}
              />
            </Link>
          </Flex>
        </Box>
      </Flex>
    </>
  );
};

export default AppsDownloadSection;
