import { ChevronDownIcon } from "@chakra-ui/icons";
import { Button, Menu, MenuButton, MenuItem, MenuList, Table, Tbody, Td, Tr } from "@chakra-ui/react";
import { ResponsiveCalendar } from "@nivo/calendar";
import data from "./calendarData.json";

const Issuer = () => {
	const MyResponsiveCalendar = ({ data }) => (
		<ResponsiveCalendar
			data={data}
			from="2015-03-01"
			to="2016-07-12"
			emptyColor="#eeeeee"
			colors={["#61cdbb", "#97e3d5", "#e8c1a0", "#f47560"]}
			margin={{ top: 40, right: 40, bottom: 40, left: 40 }}
			yearSpacing={40}
			monthBorderColor="#ffffff"
			dayBorderWidth={2}
			dayBorderColor="#ffffff"
			legends={[
				{
					anchor: "bottom-right",
					direction: "row",
					translateY: 36,
					itemCount: 4,
					itemWidth: 42,
					itemHeight: 36,
					itemsSpacing: 14,
					itemDirection: "right-to-left",
				},
			]}
		/>
	);

	return (
		<>
			<h1>Welcome Issuer!</h1>
			<Table>
				<Tbody>
					<Tr>
						<Td>Course:</Td>
						<Td>
							<Menu>
								<MenuButton
									as={Button}
									rightIcon={<ChevronDownIcon />}
									colorScheme="pink"
								>
									List of courses
								</MenuButton>
								<MenuList>
									<MenuItem>Course 1</MenuItem>
								</MenuList>
							</Menu>
						</Td>
					</Tr>

					<Tr>
						<Td>Year:</Td>
						<Td>
							<Menu>
								<MenuButton
									as={Button}
									rightIcon={<ChevronDownIcon />}
									colorScheme="blue"
								>
									List of years
								</MenuButton>
								<MenuList>
									<MenuItem>2021</MenuItem>
								</MenuList>
							</Menu>
						</Td>
					</Tr>
				</Tbody>
			</Table>
		
			<div style={{ width: "80vw", height: 300 }}>
				<MyResponsiveCalendar data={data.data} />
			</div>
		</>
	);
};

export default Issuer;
