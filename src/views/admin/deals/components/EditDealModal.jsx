import React, { useEffect, useMemo, useRef } from "react";
import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalFooter,
	ModalBody,
	ModalCloseButton,
	Button,
	VStack,
	Text,
	Box,
	Checkbox,
	Input,
	Icon,
	FormControl,
	FormLabel,
	HStack,
	SimpleGrid,
	Grid,
	Flex,
	IconButton,
	useColorModeValue,
	Divider,
} from "@chakra-ui/react";
import { useForm, useWatch } from "react-hook-form";
import { FormInput, FormSelect } from "components/fields/FormFields";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import {
	ALLOWED_FILE_TYPES,
	commissionStatuses,
	editDealSchema,
	roundTo2,
} from "../dealUtils";
import { FiUploadCloud } from "react-icons/fi";
import { CloseIcon } from "@chakra-ui/icons";
import { useUpdateItemMutation } from "api/apiSlice";
import useUserSession from "hooks/useUserSession";
import { useUserActivityLog } from "hooks/useUserActivityLog";
import { currencies } from "constants/currencies";

const EditDealModal = React.memo(({ isOpen, onClose, initialData, onSuccess }) => {
	const [updateDeal, { isLoading: isUpdating }] = useUpdateItemMutation();

	const bgColor = useColorModeValue("white", "gray.800");
	const headerBg = useColorModeValue("brand.300", "brand.100");
	const headerText = useColorModeValue("brand.700", "brand.900");
	const footerBg = useColorModeValue("gray.50", "gray.700");
	const borderColor = useColorModeValue("gray.200", "gray.600");

	const defaultValues = useMemo(
		() => ({
			developer: "",
			salesPerson: "",
			projectName: "",
			unitNumber: "",
			unitType: "",
			unitPrice: "",
			downpaymentPaid: "",
			downpaymentPercent: "",
			bookingAmountPaid: "",
			bookingPercent: "",
			spaDone: false,
			invoiceSent: false,
			file: null,
			commissionStatus: "",
			currency: "AED",
		}),
		[]
	);

	const {
		register,
		handleSubmit,
		formState: { errors, isValid, isDirty },
		reset,
		watch,
		setValue,
		control,
	} = useForm({
		resolver: yupResolver(editDealSchema),
		defaultValues,
		mode: "onChange",
	});

	useEffect(() => {
		if (initialData) {
			const { invoiceUrl, ...rest } = initialData;
			reset({ ...rest, file: invoiceUrl ?? null });
		}
	}, [initialData, reset]);

	const { user } = useUserSession();
	const { createUserLog } = useUserActivityLog();
	const dealId = initialData._id;
	const fileInputRef = useRef(null);

	const invoiceSent = useWatch({ control, name: "invoiceSent" });
	const file = useWatch({ control, name: "file" });
	const unitPrice = watch("unitPrice");
	const downpaymentPaid = useWatch({ control, name: "downpaymentPaid" });
	const bookingAmountPaid = useWatch({ control, name: "bookingAmountPaid" });

	const downpaymentPercent = unitPrice
		? roundTo2(((parseFloat(downpaymentPaid) || 0) / unitPrice) * 100)
		: 0;

	const bookingPercent = unitPrice
		? roundTo2(((parseFloat(bookingAmountPaid) || 0) / unitPrice) * 100)
		: 0;

	const fileName = useMemo(() => {
		if (typeof file === "string") {
			try {
				return decodeURIComponent(file.split("/").pop());
			} catch {
				return file;
			}
		}
		if (file instanceof File) return file.name;
		return null;
	}, [file]);

	const handleClose = () => {
		reset();
		onClose();
	};

	const handleFileSelect = (event) => {
		const file = event.target.files[0];
		if (!file) return;

		const isValidType = ALLOWED_FILE_TYPES.includes(file.type);
		const isValidSize = file.size <= 5 * 1024 * 1024;
		if (!isValidType) return toast.error("Only PDF, DOC, DOCX files are allowed.");
		if (!isValidSize) return toast.error("Maximum size is 5MB.");

		setValue("file", file, { shouldValidate: true, shouldDirty: true });
		event.target.value = null;
	};

	const handleEditDeal = async (formData) => {
		try {
			const res = await updateDeal({ path: `/deals/${dealId}`, body: formData }).unwrap();
			toast.success("Deal updated successfully");
			handleClose();
			if (res?.doc) {
				onSuccess(res.doc);
				createUserLog({
					userId: user?._id,
					action: "UPDATE",
					entity: "Deals",
					enityType: "CloseDeal",
					entityId: dealId,
					status: "success",
					message: `${res?.doc?.lead?.leadName || ""} Deal updated by ${user?.fullName}`,
				});
			}
		} catch (error) {
			const msg = error?.data?.message || "Error: Deal not updated!";
			toast.error(msg);
		}
	};

	const handleFormSubmit = (data) => {
		const formData = new FormData();
		const excluded = ["lead", "agent", "manager", "closedBy"];
		Object.keys(data).forEach((key) => {
			if (!excluded.includes(key) && key !== "file" && data[key] !== initialData[key]) {
				formData.append(key, data[key]);
			}
		});
		formData.append("downpaymentPercent", downpaymentPercent);
		formData.append("bookingPercent", bookingPercent);
		if (data.file instanceof File && data.invoiceSent) formData.append("file", data.file);
		else if (!data.file && data.invoiceSent) return toast.error("Upload invoice document!");
		handleEditDeal(formData);
	};

	return (
		<Modal
			isOpen={isOpen}
			onClose={handleClose}
			size="6xl"
			isCentered
			scrollBehavior="inside"
			motionPreset="slideInBottom"
		>
			<ModalOverlay />
			<ModalContent
				bg={bgColor}
				borderRadius="2xl"
				shadow="2xl"
				maxW={{ base: "95vw", xl: "1200px" }}
				overflow="hidden"
				mx={{ base: 3, md: 0 }}
			>
				{/* Header */}
				<ModalHeader p={0} borderBottom="1px solid" borderColor={borderColor}>
					<Flex
						bg={headerBg}
						color={headerText}
						px={6}
						py={3}
						position="sticky"
						top="0"
						zIndex="10"
						boxShadow="md"
						align="center"
					>
						<Text fontSize={{ base: "md", md: "lg" }} fontWeight="bold">
							Edit Closed Deal
						</Text>
						<ModalCloseButton
							position="absolute"
							right="12px"
							top="10px"
							color={headerText}
							_hover={{ bg: "whiteAlpha.200" }}
						/>
					</Flex>
				</ModalHeader>

				{/* Body */}
				<ModalBody p={6} borderBottom="1px solid" borderColor={borderColor}>
					<Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap={6}>
						{/* Property Info */}
						<Box>
							<Text fontSize="md" fontWeight="bold" color="gray.700" mb={3}>
								Property Information
							</Text>
							<SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
								<FormInput label="Developer" name="developer" register={register} errors={errors} isRequired />
								<FormInput label="Sales Person" name="salesPerson" register={register} errors={errors} isRequired />
								<FormInput label="Project Name" name="projectName" register={register} errors={errors} isRequired />
								<FormInput label="Unit Number" name="unitNumber" register={register} errors={errors} isRequired />
								<FormInput label="Unit Type" name="unitType" register={register} errors={errors} isRequired />
							</SimpleGrid>
						</Box>

						{/* Payment Info */}
						<Box>
							<Text fontSize="md" fontWeight="bold" color="gray.700" mb={3}>
								Payment Details
							</Text>
							<SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} mb={4}>
								<FormInput
									label="Downpayment Paid"
									name="downpaymentPaid"
									register={register}
									errors={errors}
									type="number"
									step="0.01"
									isRequired
								/>
								<VStack align="start" spacing={1} minW="180px">
									<Text fontWeight="semibold" fontSize="sm" color="gray.600">
										Downpayment %
									</Text>
									<Text fontSize="sm" p={2} w="full" bg="gray.100">
										{downpaymentPercent.toFixed(2)}%
									</Text>
								</VStack>
							</SimpleGrid>

							<SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
								<FormSelect
									label="Currency"
									name="currency"
									register={register}
									errors={errors}
									isDisabled
									isRequired
									options={currencies}
								/>
								<FormSelect
									label="Commission Status"
									name="commissionStatus"
									register={register}
									errors={errors}
									isRequired
									options={commissionStatuses}
									placeholder="Select status"
								/>
							</SimpleGrid>

							<Divider my={4} />

							{/* Extra Info */}
							<HStack spacing={6} align="start" mb={4}>
								<Checkbox {...register("invoiceSent")} colorScheme="brand" size="md">
									Invoice Sent
								</Checkbox>
								<Checkbox {...register("spaDone")} colorScheme="brand" size="md">
									SPA Document Signed
								</Checkbox>
							</HStack>

							{/* File Upload */}
							{invoiceSent && (
								<FormControl mt={4}>
									<FormLabel fontSize="sm" fontWeight="medium" color="gray.600">
										Upload Invoice
									</FormLabel>
									<Box
										as="button"
										onClick={() => file === null && fileInputRef.current?.click()}
										border="2px dashed"
										borderColor="gray.300"
										p={5}
										rounded="md"
										textAlign="center"
										bg="gray.50"
										w="100%"
										_hover={{ borderColor: "brand.500", bg: "gray.100" }}
									>
										<VStack spacing={1}>
											<Icon as={FiUploadCloud} boxSize={6} color="brand.500" />
											<Text fontSize="sm" color="gray.600">
												Click to upload
											</Text>
											{!file && (
												<Text fontSize="xs" color="gray.400">
													Only PDF, DOC, DOCX — Max 5MB
												</Text>
											)}
											{fileName && (
												<Flex align="center" mt={2} gap={2}>
													<Text fontSize="sm" color="gray.700" noOfLines={2} isTruncated>
														📄 {fileName}
													</Text>
													<IconButton
														size="xs"
														icon={<CloseIcon boxSize={2.5} />}
														onClick={() => {
															setValue("file", null);
															if (fileInputRef.current) fileInputRef.current.value = "";
														}}
														aria-label="Remove file"
													/>
												</Flex>
											)}
										</VStack>
									</Box>
									<Input
										type="file"
										hidden
										accept=".pdf,.doc,.docx"
										ref={fileInputRef}
										onChange={handleFileSelect}
									/>
								</FormControl>
							)}
						</Box>
					</Grid>
				</ModalBody>

				{/* Footer */}
				<ModalFooter
					position="sticky"
					bottom="0"
					bg={footerBg}
					borderTop="1px solid"
					borderColor={borderColor}
					py={3}
					px={6}
					zIndex="10"
					justifyContent="flex-end"
					gap={3}
				>
					<Button variant="outline" colorScheme="gray" size="sm" borderRadius="md" onClick={handleClose}>
						Cancel
					</Button>
					<Button
						colorScheme="brand"
						size="sm"
						borderRadius="md"
						onClick={handleSubmit(handleFormSubmit)}
						isDisabled={!isValid || !isDirty}
						isLoading={isUpdating}
					>
						Save Changes
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
});

EditDealModal.displayName = "EditDealModal";
export default EditDealModal;
