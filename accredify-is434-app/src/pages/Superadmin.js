import { Box, Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import Heatmap from "../components/Heatmap"
import FilterComponent from "../components/FilterComponent"

const Superadmin = () => {
    
    return (
		<>
			<h1> Welcome Superadmin! </h1>

			<Tabs>
				<TabList>
					<Tab>Institution</Tab>
					<Tab>Course</Tab>
					<Tab>Year</Tab>
				</TabList>
				<TabPanels>
					<TabPanel>
						<FilterComponent filters={[{ name: "Institution" }]} />
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
						<FilterComponent filters={[{ name: "Year" }]} />
						<Box style={{ width: "80vw", height: 300 }}>
							<Heatmap />
						</Box>
					</TabPanel>
				</TabPanels>
			</Tabs>
		</>
	);
};


export default Superadmin