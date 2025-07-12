import React from "react";
import { Box, Flex, Image, Link } from "@chakra-ui/react";
import Footer from "components/footer/FooterAuth";
import { useFetchItemsQuery } from "api/apiSlice";
// import { Link } from 'react-router-dom';

// import AppleStoreLogo from 'assets/icons/App_Store.png';
// import GoogleStoreLogo from 'assets/icons/Google_Play-Logo.wine.png';
import { toast } from "react-toastify";
import { constant } from "constant";

// function AuthIllustration(props) {
// 	const { children, illustrationBackground } = props;
// 	// Chakra color mode
// 	return (
// 		<Flex h='max-content'>
// 			<Flex
// 				h={{
// 					sm: 'initial',
// 					md: 'unset',
// 					lg: '100vh',
// 					xl: '97vh',
// 				}}
// 				className='auth-form'
// 				pt={{ sm: '50px', md: '0px' }}
// 				px={{ lg: '30px', xl: '0px' }}
// 				ps={{ xl: '70px' }}
// 				alignItems={'center'}
// 				justifyContent='center'
// 				direction='column'
// 			>
// 				{children}
// 				<Footer />
// 			</Flex>

// 			<Box
// 				className='auth-image'
// 				backgroundSize={'cover'}
// 				backgroundPosition={'center'}
// 				height={'100vh'}
// 				backgroundImage={
// 					'url(https://images.unsplash.com/photo-1491975474562-1f4e30bc9468?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)'
// 				}
// 				width={'50%'}
// 			></Box>
// 		</Flex>
// 	);
// }

function AuthIllustration({ children }) {
  const { data } = useFetchItemsQuery(
    { path: `/upload/apk` },
    { refetchOnMountOrArgChange: true }
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
    <Flex
      w="100vw"
      h="100vh"
      bg="#f5f5f5"
      align="center"
      justify="center"
      px={4}
    >
      <Flex
        w="100%"
        maxW="7xl"
        h={{ base: "auto", md: "85vh" }}
        bg="white"
        borderRadius="xl"
        overflow="hidden"
        boxShadow="md"
        direction={{ base: "column", md: "row" }}
      >
        <Box
          display={{ base: "none", md: "block" }}
          w={{ md: "40%", lg: "50%" }}
          h="100%"
          bgImage="url('/image/Login_Page.jpg')"
          bgSize="fill"
          bgRepeat="no-repeat"
          bgPos="center"
          sx={{
            "@media (max-width: 915px)": {
              display: "none",
            },
          }}
        />
        <Flex
          h={{ sm: "initial", md: "unset", lg: "100vh", xl: "97vh" }}
          className="auth-form"
          pt={{ sm: "40px", md: "0px" }}
          px={{ lg: "30px", xl: "0px" }}
          ps={{ xl: "70px" }}
          alignItems="center"
          justifyContent="center"
          direction="column"
          w={{ base: "100%", lg: "50%" }}
        >
          {children}

          <Flex gap={4} my={1}>
            {data?.url && (
              <Link onClick={handleDownloadApk}>
                <Image
                  src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                  alt="Google Play"
                  height="40px"
                />
              </Link>
            )}
            <Link
              href="https://apps.apple.com/pk/app/weeam-crm/id6744808346"
              isExternal
            >
              <Image
                src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg"
                alt="App Store"
                height="40px"
              />
            </Link>
          </Flex>
          <Footer />
        </Flex>
      </Flex>
    </Flex>
  );
}

export default AuthIllustration;
