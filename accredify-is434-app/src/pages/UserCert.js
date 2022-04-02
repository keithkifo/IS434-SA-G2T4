import { Box, Center, Image, SimpleGrid } from "@chakra-ui/react";
import JobCard from "../components/JobCard"

const UserCert = () => {
	return (
		<>
			<h1> Here is your certificate: </h1>
			<Center>
				<Image src="/images/aws-cert.png" />
			</Center>
			<Box>
				Recommended courses based on your certificate:
				<SimpleGrid columns={3} spacing={2}>
					<JobCard />
					<JobCard />
					<JobCard />
				</SimpleGrid>
			</Box>
		</>
	);
};

export default UserCert;
