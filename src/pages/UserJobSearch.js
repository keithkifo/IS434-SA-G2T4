import { SimpleGrid } from "@chakra-ui/react";
import JobCard from "../components/SocialProfileWithImageHorizontal"
import FilterComponent from "../components/FilterComponent"

const UserJobSearch = () => {
	return (
		<>
			<FilterComponent filters={[{ name: "Sector" }]} />
			<SimpleGrid columns={3} spacing={2}>
				<JobCard />
				<JobCard />
				<JobCard />
			</SimpleGrid>
		</>
	);
};

export default UserJobSearch;
