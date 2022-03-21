
import { Box, Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import FilterComponent from "../components/FilterComponent";
import Heatmap from "../components/Heatmap"

const InstitutionAdmin = () => {

	return (
		<>
			<h1> Welcome Institution! </h1>

			<Tabs>
				<TabList>
					<Tab>Overview</Tab>
					<Tab>Course Level</Tab>
					<Tab>Issuer Level</Tab>
					<Tab>Specific Issuer and Course</Tab>
				</TabList>

				<TabPanels>
					<TabPanel>
						<Box style={{ width: "80vw", height: 300 }}>
							<Heatmap />
						</Box>
					</TabPanel>
					<TabPanel>
						<FilterComponent filters={[{ name: "Course" }]} />
						<Box style={{ width: "80vw", height: 300 }}>
							<Heatmap />
						</Box>
					</TabPanel>
					<TabPanel>
						<FilterComponent filters={[{ name: "Issuser" }]} />
						<Box style={{ width: "80vw", height: 300 }}>
							<Heatmap />
						</Box>
					</TabPanel>
					<TabPanel>
						<FilterComponent filters={[{ name: "Issuer" }, { name: "Course" }]} />
						<Box style={{ width: "80vw", height: 300 }}>
							<Heatmap />
						</Box>
					</TabPanel>
				</TabPanels>
			</Tabs>
		</>
	);
};

export default InstitutionAdmin;
