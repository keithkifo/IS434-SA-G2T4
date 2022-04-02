import { Badge, Button, Center, Heading, HStack, Stack, Text } from "@chakra-ui/react";

const SkillCard = ({ skillName, skillLevels, skillDesc }) => {
	return (
		<Center py={6}>
			<Stack
				borderWidth="1px"
				borderRadius="lg"
				w={{ sm: "100%", md: "540px" }}
				direction={{ base: "column", md: "row" }}
				bg={"white"}
				boxShadow={"2xl"}
				padding={4}
			>
				<Stack p={1} pt={2}>
					<HStack>
						<Heading fontSize={"2xl"} fontFamily={"body"}>
							{skillName}
						</Heading>
                        {typeof skillLevels === "string"
                            ?
                            <Badge px={2} py={1} fontWeight={"400"} bg={"green.100"}>
                                Level {skillLevels.slice(-1)}
                            </Badge>
                            :
                            <>
                                <Badge px={2} py={1} fontWeight={"400"} bg={"orange.100"}>
                                    Your level: {skillLevels["user_level"]}
                                </Badge>
                                <Badge px={2} py={1} fontWeight={"400"} bg={"red.100"}>
                                    Job level: {skillLevels["job_level"]}
                                </Badge>
                            </>
                        }
					</HStack>
					<Text fontWeight={600} color={"gray.500"} size="sm" mb={4}>
						Description
					</Text>
					<Text textAlign={"center"} color={"gray.700"} px={3}>
						{skillDesc}
					</Text>

					<Stack
						width={"100%"}
						mt={"2rem"}
						direction={"row"}
						padding={2}
						justifyContent={"space-between"}
						alignItems={"center"}
					>
						<Button
                            w={"40%"}
							flex={1}
							fontSize={"sm"}
							rounded={"full"}
							bg={"blue.400"}
							color={"white"}
							boxShadow={
								"0px 1px 25px -5px rgb(66 153 225 / 48%), 0 10px 10px -5px rgb(66 153 225 / 43%)"
							}
							_hover={{
								bg: "blue.500",
							}}
							_focus={{
								bg: "blue.500",
							}}
						>
							View Skill
						</Button>
					</Stack>
				</Stack>
			</Stack>
		</Center>
	);
};

export default SkillCard;
