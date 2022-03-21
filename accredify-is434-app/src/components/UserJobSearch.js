import { ChevronDownIcon } from "@chakra-ui/icons";
import { Menu, MenuButton, MenuList, MenuItem, Button, SimpleGrid } from "@chakra-ui/react";
import JobCard from "./SocialProfileWithImageHorizontal"

const UserJobSearch = () => {
	return (
		<>
			Job Sector: &nbsp;
			<Menu>
				<MenuButton
					as={Button}
					rightIcon={<ChevronDownIcon />}
					colorScheme="pink"
				>
					Actions
				</MenuButton>
				<MenuList>
					<MenuItem>Download</MenuItem>
					<MenuItem>Create a Copy</MenuItem>
					<MenuItem>Mark as Draft</MenuItem>
					<MenuItem>Delete</MenuItem>
					<MenuItem>Attend a Workshop</MenuItem>
				</MenuList>
			</Menu>
			<Button colorScheme="blue">Search</Button>
			
			<SimpleGrid columns={3} spacing={2}>
				<JobCard />
				<JobCard />
				<JobCard />
			</SimpleGrid>
		</>
	);
};

export default UserJobSearch;
