import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Input,
  Select,
  VStack,
  HStack,
  Text,
  Box,
  IconButton,
  Stat,
  StatLabel,
  StatNumber,
  Divider,
  useToast,
  Spinner,
} from "@chakra-ui/react";
import { LuArrowUpDown } from "react-icons/lu";
import { RepeatIcon, CopyIcon, CheckIcon } from "@chakra-ui/icons"; // Add CheckIcon
import { useFetchItemsQuery, useCreateItemMutation } from "api/apiSlice";

const CurrencyConverterModal = ({ isOpen, onClose }) => {
  const [amount, setAmount] = useState("1");
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("AED");
  const [convertedAmount, setConvertedAmount] = useState(null);
  const [exchangeRate, setExchangeRate] = useState(null);
  const [isCopied, setIsCopied] = useState(false); // Add state for copy feedback
  const toast = useToast();

  // Fetch currencies list from your API
  const { data: currenciesResponse, isLoading: isLoadingCurrencies } =
    useFetchItemsQuery(
      {
        path: "/currencies",
      },
      { skip: !isOpen },
    );

  // Use the existing createItem mutation for currency conversion
  const [convertCurrency, { isLoading: isConverting }] =
    useCreateItemMutation();

  // Extract currencies from the response structure
  const currencies =
    currenciesResponse?.doc?.map((curr) => ({
      code: curr.value,
      name: curr.name,
      symbol: curr.symbol,
      nativeSymbol: curr.raw?.symbol_native || curr.symbol,
    })) || [];

  // Fallback currencies if API fails
  const fallbackCurrencies = [
    { code: "USD", name: "US Dollar", symbol: "$", nativeSymbol: "$" },
    { code: "EUR", name: "Euro", symbol: "€", nativeSymbol: "€" },
    { code: "GBP", name: "British Pound", symbol: "£", nativeSymbol: "£" },
    { code: "AED", name: "UAE Dirham", symbol: "AED", nativeSymbol: "د.إ" },
    { code: "SAR", name: "Saudi Riyal", symbol: "SR", nativeSymbol: "ر.س" },
    { code: "INR", name: "Indian Rupee", symbol: "₹", nativeSymbol: "₹" },
    { code: "PKR", name: "Pakistani Rupee", symbol: "Rs", nativeSymbol: "₨" },
    { code: "BDT", name: "Bangladeshi Taka", symbol: "Tk", nativeSymbol: "৳" },
    { code: "KWD", name: "Kuwaiti Dinar", symbol: "KD", nativeSymbol: "د.ك" },
    { code: "BHD", name: "Bahraini Dinar", symbol: "BD", nativeSymbol: "د.ب" },
    { code: "OMR", name: "Omani Rial", symbol: "OMR", nativeSymbol: "ر.ع" },
    { code: "QAR", name: "Qatari Riyal", symbol: "QR", nativeSymbol: "ر.ق" },
    { code: "JPY", name: "Japanese Yen", symbol: "¥", nativeSymbol: "￥" },
    { code: "CNY", name: "Chinese Yuan", symbol: "¥", nativeSymbol: "CN¥" },
  ];

  const displayCurrencies =
    currencies.length > 0 ? currencies : fallbackCurrencies;

  const handleConvert = async () => {
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid positive number",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      const result = await convertCurrency({
        path: "/currencies/convert",
        body: {
          fromCurrency,
          toCurrency,
          amount: parseFloat(amount),
        },
      }).unwrap();

      setConvertedAmount(
        result.data.convertedAmount?.toFixed(2) ||
          result.data.amount?.toFixed(2) ||
          (parseFloat(amount) * (result.data.rate || 1)).toFixed(2),
      );
      setExchangeRate(result.data.rate || result.data.exchangeRate || 1);
    } catch (error) {
      toast({
        title: "Conversion failed",
        description: error?.data?.message || "Could not fetch exchange rate",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleSwap = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    setConvertedAmount(null);
    setExchangeRate(null);
  };

  const getCurrencySymbol = (code) => {
    const currency = displayCurrencies.find((c) => c.code === code);
    return currency ? currency.symbol : code;
  };

  const handleCopyAmount = () => {
    if (!convertedAmount) return;

    const textToCopy = `${getCurrencySymbol(toCurrency)} ${convertedAmount}`;

    navigator.clipboard
      .writeText(textToCopy)
      .then(() => {
        // Show visual feedback
        setIsCopied(true);

        // Reset after 2 seconds
        setTimeout(() => {
          setIsCopied(false);
        }, 2000);
      })
      .catch(() => {
        // Optionally show error but no toast
        console.error("Copy failed");
      });
  };

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setAmount("1");
      setFromCurrency("USD");
      setToCurrency("AED");
      setConvertedAmount(null);
      setExchangeRate(null);
      setIsCopied(false);
    }
  }, [isOpen]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md" isCentered>
      <ModalOverlay backdropFilter="blur(2px)" />
      <ModalContent borderRadius="xl">
        <ModalHeader borderBottom="1px solid" borderColor="gray.100">
          <HStack justify="space-between">
            <Text>Currency Converter</Text>
          </HStack>
        </ModalHeader>
        <ModalCloseButton />

        <ModalBody py={6}>
          <VStack spacing={6}>
            {/* Amount Input */}
            <Box w="100%">
              <Text mb={2} fontWeight="medium" color="gray.700">
                Amount
              </Text>
              <Input
                value={amount}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === "" || /^\d*\.?\d*$/.test(val)) {
                    setAmount(val);
                    setConvertedAmount(null);
                    setExchangeRate(null);
                  }
                }}
                placeholder="Enter amount"
                size="lg"
                fontSize="lg"
              />
            </Box>

            {/* Currency Selection */}
            <VStack w="100%" spacing={6} align="stretch" position="relative">
              {/* From Currency */}
              <Box>
                <Text mb={2} fontSize="sm" fontWeight="medium" color="gray.600">
                  From
                </Text>
                <Select
                  value={fromCurrency}
                  onChange={(e) => {
                    setFromCurrency(e.target.value);
                    setConvertedAmount(null);
                    setExchangeRate(null);
                  }}
                  size="lg"
                  isDisabled={isLoadingCurrencies}
                >
                  {isLoadingCurrencies ? (
                    <option>Loading currencies...</option>
                  ) : (
                    displayCurrencies.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.code} - {c.name}
                      </option>
                    ))
                  )}
                </Select>
              </Box>

              {/* Swap Button */}
              <IconButton
                icon={<LuArrowUpDown />}
                onClick={handleSwap}
                variant="outline"
                aria-label="Swap currencies"
                size="md"
                isRound
                position="absolute"
                left="50%"
                top="45%"
                transform="translate(-50%, -50%)"
                bg="white"
                boxShadow="sm"
                zIndex={2}
              />

              {/* To Currency */}
              <Box>
                <Text mb={2} fontSize="sm" fontWeight="medium" color="gray.600">
                  To
                </Text>
                <Select
                  value={toCurrency}
                  onChange={(e) => {
                    setToCurrency(e.target.value);
                    setConvertedAmount(null);
                    setExchangeRate(null);
                  }}
                  size="lg"
                  isDisabled={isLoadingCurrencies}
                >
                  {isLoadingCurrencies ? (
                    <option>Loading currencies...</option>
                  ) : (
                    displayCurrencies.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.code} - {c.name}
                      </option>
                    ))
                  )}
                </Select>
              </Box>
            </VStack>

            <Divider />

            {/* Result with Copy Button */}
            {isConverting ? (
              <Box textAlign="center" py={8}>
                <Spinner size="xl" thickness="4px" color="blue.500" />
                <Text mt={4} color="gray.600">
                  Converting...
                </Text>
              </Box>
            ) : convertedAmount ? (
              <Box
                w="100%"
                bg="blue.50"
                p={6}
                borderRadius="lg"
                position="relative"
              >
                <Button
                  size="xs"
                  position="absolute"
                  top={2}
                  right={2}
                  onClick={handleCopyAmount}
                  colorScheme={isCopied ? "green" : "teal"}
                  leftIcon={isCopied ? <CheckIcon /> : <CopyIcon />}
                  isLoading={false}
                  minW="70px"
                >
                  {isCopied ? "Copied!" : "Copy"}
                </Button>
                <Stat textAlign="center">
                  <StatLabel fontSize="md" color="blue.600">
                    Converted Amount
                  </StatLabel>
                  <StatNumber fontSize="4xl" fontWeight="bold" color="blue.700">
                    {getCurrencySymbol(toCurrency)} {convertedAmount}
                  </StatNumber>
                </Stat>
              </Box>
            ) : (
              <Box
                w="100%"
                bg="gray.50"
                p={6}
                borderRadius="lg"
                textAlign="center"
              >
                <Text color="gray.500">Enter an amount and click Convert</Text>
              </Box>
            )}
          </VStack>
        </ModalBody>

        <ModalFooter borderTop="1px solid" borderColor="gray.100">
          <Button
            colorScheme="brand"
            mr={3}
            onClick={handleConvert}
            isLoading={isConverting}
            loadingText="Converting"
            size="md"
            flex="1"
          >
            Convert
          </Button>
          <Button onClick={onClose} size="md" variant="outline">
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CurrencyConverterModal;
