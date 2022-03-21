import {
	Box,
	Center,
	Heading,
	Progress,
	Stack,
	Text
} from "@chakra-ui/react";

export default function SocialProfileWithImageHorizontal() {
	return (
		<Center py={6}>
			<Stack
				borderRadius="lg"
				bg="white"
				boxShadow={"md"}
				padding={10}
				w={{ sm: "100%", md: "540px" }}
				height={{ sm: "476px", md: "15rem" }}
				direction={{ base: "column", md: "row" }}
			>
				<Stack
					spacing={4}
					flex={1}
					flexDirection="column"
					justifyContent="center"
				>
					<Heading fontSize={"2xl"} fontFamily={"body"}>
						Data Engineer
					</Heading>
					<Text fontWeight={600} color={"gray.500"} size="sm" mb={4}>
						IT Sector
					</Text>
					<Box>
						<Text>64%</Text>
						<Progress hasStripe value={64} size="md" colorScheme="cyan" />
					</Box>
				</Stack>
			</Stack>
		</Center>
	);
}