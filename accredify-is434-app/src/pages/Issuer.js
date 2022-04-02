import {
	Box,
	Divider,
	Tab,
	TabList,
	TabPanel,
	TabPanels,
	Tabs,
	VStack,
	Heading,
	Alert,
	AlertIcon,
} from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import ActivityBox from "../components/ActivityBox";
import FilterComponent from "../components/FilterComponent";
import Heatmap from "../components/Heatmap";

const Issuer = () => {
	const issuerId = 6; // hard coded, SMUA's Issuer: Business Management@SMU Academy
	const [tabIndex, setTabIndex] = useState(0);

	const [yearList, setYearList] = useState([]);
	const [courseList, setCourseList] = useState([]);

	const [yearFilter, setYearFilter] = useState("");
	const [courseFilter, setCourseFilter] = useState("");

	const [calendarData, setCalendarData] = useState([]);
	const [activityBreakdown, setActivityBreakdown] = useState({});
	const [clickCalDate, setClickCalDate] = useState("");
	const [showActivity, setShowActivity] = useState(false);
	const [calendarReady, setCalendarReady] = useState(false);

	const baseEndpoint = `${process.env.REACT_APP_ACCREDIFY_ENDPOINT}/api/v1/issuance?issuerId=${issuerId}`;
	const issuerEndpoints = [
		`&year=${yearFilter}&flatten=true`,
		`&year=${yearFilter}&courseCode=${courseFilter}&flatten=true`,
	];

	const tableHeaders = [
		["Course Code", "Count"],
	];

	///// For Initial Page Load /////
	// Get unique years
	useEffect(() => {
		axios
			.get(
				`${process.env.REACT_APP_ACCREDIFY_ENDPOINT}/api/v1/issuance/years?issuerId=${issuerId}`
			)
			.then((res) => {
				for (let year of res.data.data) {
					let obj = {
						id: year,
						name: year,
					};
					setYearList((old) => [...old, obj]);
				}
			});
	}, []);

	///// When a tab is changed /////
	const handleTabChange = (index) => {
		// Clear out all variables
		setTabIndex(index);

		setYearList([]);
		setCourseList([]);

		setYearFilter("");
		setCourseFilter("");

		setCalendarData([]);
		setActivityBreakdown({});
		setClickCalDate("");
		setShowActivity(false);
		setCalendarReady(false);

		// Load list of courses by Issuer
		axios.get(`${process.env.REACT_APP_ACCREDIFY_ENDPOINT}/api/v1/courses?issuerId=${issuerId}`)
		.then((res) => {
			let courses = [];
			for (let course of res.data.data) {
				courses.push({
					id: course["courseCode"],
					name: course["courseTitle"],
				});
			}
			setCourseList(courses);
		});
	};

	// Get unique years of chosen course
	const handleCourseChange = (e) => {
		setCourseFilter(e.target.value)
		
		axios
			.get(
				`${process.env.REACT_APP_ACCREDIFY_ENDPOINT}/api/v1/issuance/years?issuerId=${issuerId}&courseCode=${e.target.value}`
			)
			.then((res) => {
				for (let year of res.data.data) {
					let obj = {
						id: year,
						name: year,
					};
					setYearList((old) => [...old, obj]);
				}
			});
	};

	// Triggers when all filters are selected with an option
	useEffect(() => {
		if (
			(tabIndex === 0 && yearFilter !== "") ||
			(tabIndex === 1 &&
				yearFilter !== "" &&
				courseFilter !== "")
		) {
			axios
				.get(baseEndpoint + issuerEndpoints[tabIndex])
				.then((res) => {
					let cleanData = [];
					for (let date in res.data.data) {
						cleanData.push({
							value: res.data.data[date],
							day: date,
						});
					}
					setCalendarData(cleanData);
					setCalendarReady(true);
				});
		}
	}, [yearFilter, courseFilter, tabIndex]);

	const handleCalendarClick = (day, e) => {
		let endpoint = "";
		if (tabIndex === 0) {
			endpoint = `${process.env.REACT_APP_ACCREDIFY_ENDPOINT}/api/v1/issuance?issuerId=${issuerId}&date=${day.data.day}`;
		} else {
			endpoint = `${process.env.REACT_APP_ACCREDIFY_ENDPOINT}/api/v1/issuance?issuerId=${issuerId}&date=${day.data.day}&courseCode=${courseFilter}`;
		}
		axios.get(endpoint).then((res) => {
			setActivityBreakdown(res.data.data);
			setClickCalDate(day.data.day);
			setShowActivity(true);
		});
	};

	return (
		<Box ml={10} mr={10}>
			<Heading mb={10}> Welcome Business Management@SMU Academy! </Heading>

			<Tabs
				index={tabIndex}
				onChange={handleTabChange}
				variant="soft-rounded"
				colorScheme="gray"
			>
				<TabList>
					<Tab>All Courses</Tab>
					<Tab>Specific Course</Tab>
				</TabList>
				<TabPanels>
					{/* All Courses */}
					<TabPanel>
						<VStack align="left">
							<FilterComponent
								filter={{ name: "Year" }}
								selectOptions={yearList}
								handleOnChange={(e) => {
									setYearFilter(e.target.value);
								}}
							/>
						</VStack>
						<Divider mt={5} mb={5} />

						{calendarReady === true ? (
							<Box style={{ height: 200 }}>
								<Heatmap
									calendarData={calendarData}
									yearFilter={yearFilter}
									handleClick={handleCalendarClick}
								/>
								<Divider mt={5} mb={5} />
							</Box>
						) : (
							<Alert
								status="info"
								style={{ width: "fit-content" }}
							>
								<AlertIcon />
								Select a Year to view heatmap.
							</Alert>
						)}

						{showActivity ? (
							<ActivityBox
								activityBreakdown={activityBreakdown}
								tableHeaders={tableHeaders[tabIndex]}
								clickCalDate={clickCalDate}
							/>
						) : null}
					</TabPanel>
					{/* Specific Course */}
					<TabPanel>
						<VStack align="left">
							<FilterComponent
								filter={{ name: "Course" }}
								selectOptions={courseList}
								handleOnChange={(e) => handleCourseChange(e)}
							/>
							<FilterComponent
								filter={{ name: "Year" }}
								selectOptions={yearList}
								handleOnChange={(e) =>
									setYearFilter(e.target.value)
								}
							/>
						</VStack>
						<Divider mt={5} mb={5} />

						{calendarReady === true ? (
							<Box style={{ height: 200 }}>
								<Heatmap
									calendarData={calendarData}
									yearFilter={yearFilter}
								/>
								<Divider mt={5} mb={5} />
							</Box>
						) : (
							<Alert
								status="info"
								style={{ width: "fit-content" }}
							>
								<AlertIcon />
								Select an Issuer and a Year to view heatmap.
							</Alert>
						)}
					</TabPanel>
				</TabPanels>
			</Tabs>
		</Box>
	);
};

export default Issuer;
