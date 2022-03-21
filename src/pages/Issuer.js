import { Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import IssuerCourseLv from "../components/IssuerCourseLv";
import IssuerAllCourses from "../components/IssuerAllCourses";

const Issuer = () => {
	return (
		<>
			<h1>Welcome Issuer!</h1>

			<Tabs>
				<TabList>
					<Tab>Course Level</Tab>
					<Tab>All Courses</Tab>
				</TabList>

				<TabPanels>
					<TabPanel>
						<IssuerCourseLv />
					</TabPanel>
					<TabPanel>
						<IssuerAllCourses />
					</TabPanel>
				</TabPanels>
			</Tabs>
		</>
	);
};

export default Issuer;