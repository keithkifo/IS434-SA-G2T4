import {
	Container,
	Heading,
	Stack,
	Badge,
	Box,
	Progress,
	Text,
	Tag,
	Table,
	TableContainer,
	Thead,
	Tr,
	Th,
	Td,
	CircularProgress,
	HStack,
	CircularProgressLabel,
	Tbody,
	Button,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	useDisclosure,
	UnorderedList,
	ListItem,
} from "@chakra-ui/react";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

const JobRolePage = () => {
	const location = useLocation();
	const jobInfo = location.state;
	const overall_percentage_match =
		Math.round(jobInfo.percent_match_overall * 100 * 10) / 10;
	const generic_skills_match =
		Math.round(jobInfo.percent_match_generic * 100 * 10) / 10;
	const technical_skills_match =
		Math.round(jobInfo.percent_match_technical * 100 * 10) / 10;
	const chartColour = (value) => {
		return value <= 50 ? "red" : value <= 70 ? "orange" : "green";
	};
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [skillInfo, setSkillInfo] = useState({});
	const handleClick = (skillId) => {
		onOpen();
		axios
			.get(
				`${process.env.REACT_APP_ACCREDIFY_ENDPOINT}/api/v1/skills?id=${skillId}`
			)
			.then((res) => setSkillInfo(res.data.data[0]));
	};

	return (
		<Box>
			<Container maxW="container.md">
				<Heading>{jobInfo.job_role}</Heading>
				<Stack align={"left"} direction={"row"} mt={6} mb={6}>
					<Badge px={2} py={1} fontWeight={"400"} bg={"gray.100"}>
						{jobInfo.sector}
					</Badge>
					<Badge px={2} py={1} fontWeight={"400"} bg={"gray.100"}>
						{jobInfo.track}
					</Badge>
				</Stack>
				<Text mb={10}>Description: </Text>

				<HStack mb={10} align="flex-end">
					<Box w="80%">
						<Heading size="md" mb={3}>
							Overall match: {overall_percentage_match}%
						</Heading>
						<Progress
							value={overall_percentage_match}
							size="md"
							colorScheme={chartColour(overall_percentage_match)}
						/>
					</Box>
					<Box align="center">
						<Heading size="md" mb={3}>
							Generic Skills
						</Heading>
						<CircularProgress
							value={generic_skills_match}
							size="60px"
						>
							<CircularProgressLabel>
								{generic_skills_match}%
							</CircularProgressLabel>
						</CircularProgress>
					</Box>
					<Box align="center">
						<Heading size="md" mb={3}>
							Technical Skills
						</Heading>
						<CircularProgress
							value={technical_skills_match}
							size="60px"
						>
							<CircularProgressLabel>
								{technical_skills_match}%
							</CircularProgressLabel>
						</CircularProgress>
					</Box>
				</HStack>
			</Container>

			<TableContainer>
				<Table variant="simple">
					<Thead>
						<Tr>
							<Th>Skill</Th>
							<Th>Type</Th>
							<Th>Your Level</Th>
							<Th>Required Level</Th>
							<Th>Status</Th>
							<Th></Th>
						</Tr>
					</Thead>
					<Tbody>
						{jobInfo["skills"].map((skill) => {
							let skillId = Object.keys(skill);
							let skillNameObj = skill[skillId];
							let skillName = Object.keys(skillNameObj);
							let skillInfo = skillNameObj[skillName];
							let tagColour =
								skillInfo["status"] === "Qualified"
									? "green"
									: skillInfo["status"] === "Under Qualified"
									? "orange"
									: "red";
							let userLevelName =
								skillInfo["user_level"].charAt(0) === "L"
									? `Level ${skillInfo["user_level"].slice(
											1
									  )}`
									: skillInfo["user_level"];

							return (
								<Tr key={skillId}>
									<Td>
										{skillName} {skillId}
									</Td>
									<Td>{skillInfo["skill_type"]}</Td>
									<Td>{userLevelName}</Td>
									<Td>{skillInfo["job_level"]}</Td>
									<Td>
										<Tag
											size={"lg"}
											colorScheme={tagColour}
										>
											{skillInfo["status"]}
										</Tag>
									</Td>
									<Td>
										<Button
											onClick={() => handleClick(skillId)}
										>
											View Skill
										</Button>
									</Td>
								</Tr>
							);
						})}
					</Tbody>
				</Table>
			</TableContainer>

			{Object.keys(skillInfo).length === 0 ? null : (
				<Modal onClose={onClose} isOpen={isOpen}>
					<ModalOverlay />
					<ModalContent>
						<ModalHeader>{skillInfo["name"]}</ModalHeader>
						<ModalCloseButton />
						<ModalBody>
							<Box mb={5}>
								<Heading size="lg" mb={2}>
									Description
								</Heading>
								<Text>{skillInfo["description"]}</Text>
							</Box>

							<Box>
								<Heading size="lg" mb={2}>
									Proficiencies
								</Heading>
								{skillInfo["proficiencies"].map((p) => (
									<Box key={p.id} mb={5}>
										<Box mb={3}>
											<Heading size="md" color="teal">
												{p["level"]}
											</Heading>
											<Text>{p["description"]}</Text>
										</Box>
										{p["knowledge"] === null ? null : (
											<>
												<Box mb={2}>
													<Heading size="sm">
														Knowledge
													</Heading>
													<UnorderedList>
														{p["knowledge"].map(
															(k) => (
																<ListItem>
																	{k}
																</ListItem>
															)
														)}
													</UnorderedList>
												</Box>
												<Box>
													<Heading size="sm">
														Abilities
													</Heading>
													<UnorderedList>
														{p["abilities"].map(
															(a) => (
																<ListItem>
																	{a}
																</ListItem>
															)
														)}
													</UnorderedList>
												</Box>
											</>
										)}
									</Box>
								))}
							</Box>
						</ModalBody>
						<ModalFooter>
							<Button onClick={onClose}>Close</Button>
						</ModalFooter>
					</ModalContent>
				</Modal>
			)}
		</Box>
	);
};

export default JobRolePage;
