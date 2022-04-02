import {
	Box,
	Button,
	Center,
	Heading,
	Progress,
	Stack,
	Text
} from "@chakra-ui/react";

import { useNavigate } from "react-router-dom"

const JobCard = ({ jobInfo }) => {
	const overall_percentage_match = Math.round(jobInfo.percent_match_overall * 100 * 10) / 10
	const progressBarColour =
		overall_percentage_match <= 50
			? "red"
			: overall_percentage_match <= 70
			? "orange"
			: "green";

	let navigate = useNavigate()

	return (
		<Center py={6}>
			<Box
				maxW={"320px"}
				w={"full"}
				bg={"white"}
				boxShadow={"2xl"}
				rounded={"lg"}
				p={10}
				textAlign={"center"}
			>
				<Heading fontSize={"xl"} fontFamily={"body"}>
					{jobInfo.job_role}
				</Heading>
				<Box mt={5}>
					<Text size="sm" align="center">
						Overall match: {overall_percentage_match}%
					</Text>
					<Progress
						value={overall_percentage_match}
						size="md"
						colorScheme={progressBarColour}
					/>
				</Box>

				<Stack mt={8} direction={"row"} spacing={4}>
					<Button
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
						onClick={() =>
							navigate(`${jobInfo.job_role.replace("/", "-")}`, {
								state: jobInfo,
							})
						}
					>
						Click to see details
					</Button>
				</Stack>
			</Box>
		</Center>
	);
};

export default JobCard