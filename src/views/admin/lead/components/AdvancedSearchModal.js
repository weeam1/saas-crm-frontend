import { useSelector } from "react-redux";

const {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalCloseButton,
	ModalBody,
	Grid,
	GridItem,
	FormLabel,
	Input,
	Text,
	Select,
	Box,
	ModalFooter,
	Button,
	Spinner,
	Skeleton,
	CircularProgress,
} = require("@chakra-ui/react");

const AdvancedSearchModal = ({
	setAdvaceSearch,
	resetForm,
	advaceSearch,
	handleChange,
	handleBlur,
	errors,
	touched,
	values,
	isLoding,
	dirty,
	handleSubmit,
	handleClear,
}) => {
	const user = JSON.parse(localStorage.getItem("user"));
	const tree = useSelector((state) => state.user.tree);

	return (
		<Modal
			size="6xl"
			onClose={() => {
				setAdvaceSearch(false);
				// resetForm();
			}}
			isOpen={advaceSearch}
			isCentered
			motionPreset="slideInBottom"
		>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader>Advance Search</ModalHeader>
				<ModalCloseButton
					onClick={() => {
						setAdvaceSearch(false);
						resetForm();
					}}
				/>
				<ModalBody>
					<Grid templateColumns="repeat(24, 1fr)" mb={3} gap={3}>
						<GridItem colSpan={{ base: 12, md: 6 }}>
							<FormLabel
								display="flex"
								ms="4px"
								fontSize="sm"
								fontWeight="600"
								color={"#000"}
								mb="0"
								mt={2}
							>
								Name
							</FormLabel>
							<Input
								fontSize="sm"
								onChange={handleChange}
								onBlur={handleBlur}
								value={values?.leadName}
								name="leadName"
								placeholder="Enter Lead Name"
								fontWeight="500"
							/>
							<Text mb="10px" color={"red"}>
								{" "}
								{errors.leadName && touched.leadName && errors.leadName}
							</Text>
						</GridItem>
						<GridItem colSpan={{ base: 12, md: 6 }}>
							<FormLabel
								display="flex"
								ms="4px"
								fontSize="sm"
								fontWeight="600"
								color={"#000"}
								mb="0"
								mt={2}
							>
								Status
							</FormLabel>
							<Select
								value={values?.leadStatus}
								fontSize="sm"
								name="leadStatus"
								onChange={handleChange}
								fontWeight="500"
								placeholder={"Select Lead Status"}
							>
								<option value="active">Interested</option>
								<option value="pending">Not-interested</option>
								<option value="reassigned">Reassigned</option>
								<option value="sold">Sold</option>
								<option value="new">New</option>
								<option value="no_answer">No answer</option>
								<option value="unreachable">Unreachable</option>

								<option value="waiting">Waiting</option>
								<option value="follow_up">Follow Up</option>
								<option value="meeting">Meeting</option>
								<option value="follow_up_after_meeting">
									Follow Up After Meeting
								</option>
								<option value="deal">Deal</option>
								<option value="junk">Junk</option>
								<option value="whatsapp_send">Whatsapp Send</option>
								<option value="whatsapp_rec">Whatsapp Rec</option>
								<option value="deal_out">Deal Out</option>
								<option value="shift_project">Shift Project</option>
								<option value="wrong_number">Wrong Number</option>
								<option value="broker">Broker</option>
								<option value="voice_mail">Voice Mail</option>
								<option value="request">Request</option>
							</Select>
							<Text mb="10px" color={"red"}>
								{" "}
								{errors.leadStatus && touched.leadStatus && errors.leadStatus}
							</Text>
						</GridItem>
						<GridItem colSpan={{ base: 12, md: 6 }}>
							<FormLabel
								display="flex"
								ms="4px"
								fontSize="sm"
								fontWeight="600"
								color={"#000"}
								mb="0"
								mt={2}
							>
								Exta Status
							</FormLabel>
							<Select
								value={values?.eLeadStatus}
								fontSize="sm"
								name="eLeadStatus"
								onChange={handleChange}
								fontWeight="500"
								placeholder={"Select Extra Lead Status"}
							>
								<option value="interested">Interested</option>
								<option value="junk">Junk</option>
								<option value="not-interested">Not interested</option>
								<option value="qualified">Qualified</option>
							</Select>
							<Text mb="10px" color={"red"}>
								{" "}
								{errors.leadStatus && touched.leadStatus && errors.leadStatus}
							</Text>
						</GridItem>

						<GridItem colSpan={{ base: 12, md: 6 }}>
							<FormLabel
								display="flex"
								ms="4px"
								fontSize="sm"
								fontWeight="600"
								color={"#000"}
								mb="0"
								mt={2}
							>
								Email
							</FormLabel>
							<Input
								fontSize="sm"
								onChange={handleChange}
								onBlur={handleBlur}
								value={values?.leadEmail}
								name="leadEmail"
								placeholder="Enter Lead Email"
								fontWeight="500"
							/>
							<Text mb="10px" color={"red"}>
								{" "}
								{errors.leadEmail && touched.leadEmail && errors.leadEmail}
							</Text>
						</GridItem>
						<GridItem colSpan={{ base: 12, md: 6 }}>
							<FormLabel
								display="flex"
								ms="4px"
								fontSize="sm"
								fontWeight="600"
								color={"#000"}
								mb="0"
								mt={2}
							>
								Phone Number
							</FormLabel>
							<Input
								fontSize="sm"
								onChange={handleChange}
								onBlur={handleBlur}
								value={values?.leadPhoneNumber}
								name="leadPhoneNumber"
								placeholder="Enter Lead PhoneNumber"
								fontWeight="500"
							/>
							<Text mb="10px" color={"red"}>
								{" "}
								{errors.leadPhoneNumber &&
									touched.leadPhoneNumber &&
									errors.leadPhoneNumber}
							</Text>
						</GridItem>
						<GridItem colSpan={{ base: 12, md: 6 }}>
							<FormLabel
								display="flex"
								ms="4px"
								fontSize="sm"
								fontWeight="600"
								color={"#000"}
								mb="0"
								mt={2}
							>
								Whatsapp Number
							</FormLabel>
							<Input
								fontSize="sm"
								onChange={handleChange}
								onBlur={handleBlur}
								value={values?.leadWhatsappNumber}
								name="leadWhatsappNumber"
								placeholder="Search by Whatsapp Number"
								fontWeight="500"
							/>
							<Text mb="10px" color={"red"}>
								{" "}
								{errors.leadWhatsappNumber &&
									touched.leadWhatsappNumber &&
									errors.leadWhatsappNumber}
							</Text>
						</GridItem>
						<GridItem colSpan={{ base: 12, md: 6 }}>
							<FormLabel
								display="flex"
								ms="4px"
								fontSize="sm"
								fontWeight="600"
								color={"#000"}
								mb="0"
								mt={2}
							>
								Lead Address
							</FormLabel>
							<Input
								fontSize="sm"
								onChange={handleChange}
								onBlur={handleBlur}
								value={values?.leadAddress}
								name="leadAddress"
								placeholder="Search by Address"
								fontWeight="500"
							/>
							<Text mb="10px" color={"red"}>
								{" "}
								{errors.leadAddress &&
									touched.leadAddress &&
									errors.leadAddress}
							</Text>
						</GridItem>
						<GridItem colSpan={{ base: 12, md: 6 }}>
							<FormLabel
								display="flex"
								ms="4px"
								fontSize="sm"
								fontWeight="600"
								color={"#000"}
								mb="0"
								mt={2}
							>
								Nationality
							</FormLabel>
							<Input
								fontSize="sm"
								onChange={handleChange}
								onBlur={handleBlur}
								value={values?.nationality}
								name="nationality"
								placeholder="Search by Nationaity"
								fontWeight="500"
							/>
							<Text mb="10px" color={"red"}>
								{" "}
								{errors.nationality &&
									touched.nationality &&
									errors.nationality}
							</Text>
						</GridItem>
						<GridItem colSpan={{ base: 12, md: 6 }}>
							<FormLabel
								display="flex"
								ms="4px"
								fontSize="sm"
								fontWeight="600"
								color={"#000"}
								mb="0"
								mt={2}
							>
								Country Source
							</FormLabel>
							<Input
								fontSize="sm"
								onChange={handleChange}
								onBlur={handleBlur}
								value={values?.ip}
								name="ip"
								placeholder="Search by Country Source"
								fontWeight="500"
							/>
							<Text mb="10px" color={"red"}>
								{" "}
								{errors.ip && touched.ip && errors.ip}
							</Text>
						</GridItem>
						<GridItem colSpan={{ base: 12, md: 6 }}>
							<FormLabel
								display="flex"
								ms="4px"
								fontSize="sm"
								fontWeight="600"
								color={"#000"}
								mb="0"
								mt={2}
							>
								Lead Campaign
							</FormLabel>
							<Input
								fontSize="sm"
								onChange={handleChange}
								onBlur={handleBlur}
								value={values?.leadCampaign}
								name="leadCampaign"
								placeholder="Search by Lead Campaign"
								fontWeight="500"
							/>
							<Text mb="10px" color={"red"}>
								{" "}
								{errors.leadCampaign &&
									touched.leadCampaign &&
									errors.leadCampaign}
							</Text>
						</GridItem>
						<GridItem colSpan={{ base: 12, md: 6 }}>
							<FormLabel
								display="flex"
								ms="4px"
								fontSize="sm"
								fontWeight="600"
								color={"#000"}
								mb="0"
								mt={2}
							>
								Lead Source Medium
							</FormLabel>
							<Input
								fontSize="sm"
								onChange={handleChange}
								onBlur={handleBlur}
								value={values?.leadSourceMedium}
								name="leadSourceMedium"
								placeholder="Search by Lead Source Medium"
								fontWeight="500"
							/>
							<Text mb="10px" color={"red"}>
								{" "}
								{errors.leadSourceMedium &&
									touched.leadSourceMedium &&
									errors.leadSourceMedium}
							</Text>
						</GridItem>
						<GridItem colSpan={{ base: 12, md: 6 }}>
							<FormLabel
								display="flex"
								ms="4px"
								fontSize="sm"
								fontWeight="600"
								color={"#000"}
								mb="0"
								mt={2}
							>
								Lead Source
							</FormLabel>
							<Input
								fontSize="sm"
								onChange={handleChange}
								onBlur={handleBlur}
								value={values?.leadSource}
								name="leadSource"
								placeholder="Search by Lead Source"
								fontWeight="500"
							/>
							<Text mb="10px" color={"red"}>
								{" "}
								{errors.leadSource && touched.leadSource && errors.leadSource}
							</Text>
						</GridItem>
						<GridItem colSpan={{ base: 12, md: 6 }}>
							<FormLabel
								display="flex"
								ms="4px"
								fontSize="sm"
								fontWeight="600"
								color={"#000"}
								mb="0"
								mt={2}
							>
								Lead Source Details
							</FormLabel>
							<Input
								fontSize="sm"
								onChange={handleChange}
								onBlur={handleBlur}
								value={values?.leadSourceDetails}
								name="leadSourceDetails"
								placeholder="Search by Lead Source Details"
								fontWeight="500"
							/>
							<Text mb="10px" color={"red"}>
								{" "}
								{errors.leadSourceDetails &&
									touched.leadSourceDetails &&
									errors.leadSourceDetails}
							</Text>
						</GridItem>
						<GridItem colSpan={{ base: 12, md: 6 }}>
							<FormLabel
								display="flex"
								ms="4px"
								fontSize="sm"
								fontWeight="600"
								color={"#000"}
								mb="0"
								mt={2}
							>
								Campaign Page URL
							</FormLabel>
							<Input
								fontSize="sm"
								onChange={handleChange}
								onBlur={handleBlur}
								value={values?.pageUrl}
								name="pageUrl"
								placeholder="Search by Campaign Page Url"
								fontWeight="500"
							/>
							<Text mb="10px" color={"red"}>
								{" "}
								{errors.pageUrl && touched.pageUrl && errors.pageUrl}
							</Text>
						</GridItem>
						<GridItem colSpan={{ base: 12, md: 6 }}>
							<FormLabel
								display="flex"
								ms="4px"
								fontSize="sm"
								fontWeight="600"
								color={"#000"}
								mb="0"
								mt={2}
							>
								Are you in UAE
							</FormLabel>
							<Input
								fontSize="sm"
								onChange={handleChange}
								onBlur={handleBlur}
								value={values?.r_u_in_uae}
								name="r_u_in_uae"
								placeholder="Search by Are you in UAE"
								fontWeight="500"
							/>
							<Text mb="10px" color={"red"}>
								{" "}
								{errors.r_u_in_uae && touched.r_u_in_uae && errors.r_u_in_uae}
							</Text>
						</GridItem>
						<GridItem colSpan={{ base: 12, md: 6 }}>
							<FormLabel
								display="flex"
								ms="4px"
								fontSize="sm"
								fontWeight="600"
								color={"#000"}
								mb="0"
								mt={2}
							>
								Language
							</FormLabel>
							<Input
								fontSize="sm"
								onChange={handleChange}
								onBlur={handleBlur}
								value={values?.leadLang}
								name="leadLang"
								placeholder="Search by Language"
								fontWeight="500"
							/>
							<Text mb="10px" color={"red"}>
								{errors.leadLang && touched.leadLang && errors.leadLang}
							</Text>
						</GridItem>
						{user?.role === "superAdmin" && (
							<GridItem colSpan={{ base: 12, md: 6 }}>
								<FormLabel
									display="flex"
									ms="4px"
									fontSize="sm"
									fontWeight="600"
									color={"#000"}
									mb="0"
									mt={2}
								>
									Manager
								</FormLabel>
								<Box>
									<Select
										name="managerAssigned"
										onChange={handleChange}
										value={values["managerAssigned"]}
									>
										<option selected value={""}>
											Select manager
										</option>
										{tree &&
											tree["managers"] &&
											tree["managers"]?.map((user) => {
												return (
													<option
														key={user?._id?.toString()}
														value={user?._id?.toString()}
													>
														{user?.firstName + " " + user?.lastName}
													</option>
												);
											})}
										<option key={-1} value={-1}>
											No Manager
										</option>
									</Select>
								</Box>

								<Text mb="10px" color={"red"}>
									{" "}
									{errors.fromLeadScore &&
										touched.fromLeadScore &&
										errors.fromLeadScore}
								</Text>
							</GridItem>
						)}

						{user?.role === "superAdmin" && (
							<GridItem colSpan={{ base: 12, md: 6 }}>
								<FormLabel
									display="flex"
									ms="4px"
									fontSize="sm"
									fontWeight="600"
									color={"#000"}
									mb="0"
									mt={2}
								>
									Agent
								</FormLabel>
								<Box>
									<Select
										name="agentAssigned"
										onChange={handleChange}
										value={values["agentAssigned"]}
									>
										<option selected value={""}>
											Select agent
										</option>
										{tree &&
											tree["managers"] &&
											Object.values(tree["agents"])
												?.flat()
												?.map((user) => {
													return (
														<option
															key={user?._id?.toString()}
															value={user?._id?.toString()}
														>
															{user?.firstName + " " + user?.lastName}
														</option>
													);
												})}
										<option key={-1} value={-1}>
											No Agent
										</option>
									</Select>
								</Box>

								<Text mb="10px" color={"red"}>
									{" "}
									{errors.fromLeadScore &&
										touched.fromLeadScore &&
										errors.fromLeadScore}
								</Text>
							</GridItem>
						)}

						{user?.roles[0]?.roleName === "Manager" && (
							<GridItem colSpan={{ base: 12, md: 6 }}>
								<FormLabel
									display="flex"
									ms="4px"
									fontSize="sm"
									fontWeight="600"
									color={"#000"}
									mb="0"
									mt={2}
								>
									Agent
								</FormLabel>
								<Box>
									<Select
										name="agentAssigned"
										onChange={handleChange}
										value={values["agentAssigned"]}
									>
										<option selected value={""}>
											Select agent
										</option>
										{tree &&
											tree["managers"] &&
											tree["agents"]["manager-" + user?._id?.toString()]?.map(
												(user) => {
													return (
														<option
															key={user?._id?.toString()}
															value={user?._id?.toString()}
														>
															{user?.firstName + " " + user?.lastName}
														</option>
													);
												}
											)}
									</Select>
								</Box>

								<Text mb="10px" color={"red"}>
									{" "}
									{errors.fromLeadScore &&
										touched.fromLeadScore &&
										errors.fromLeadScore}
								</Text>
							</GridItem>
						)}
					</Grid>
				</ModalBody>
				<ModalFooter>
					<Button
						colorScheme="brand"
						size="sm"
						mr={2}
						onClick={handleSubmit}
						disabled={isLoding || !dirty ? true : false}
					>
						{isLoding ? <Spinner /> : "Search"}
					</Button>
					<Button
						colorScheme="red"
						variant="outline"
						size="sm"
						onClick={handleClear}
					>
						Clear
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};
export default AdvancedSearchModal;
