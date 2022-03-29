import {
	Box,
	Divider,
	Tab,
	TabList,
	TabPanel,
	TabPanels,
	Tabs,
	VStack,
	Text,
	Heading,
	Button,
	HStack
} from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import ActivityBox from "../components/ActivityBox";
import FilterComponent from "../components/FilterComponent";
import Heatmap from "../components/Heatmap";

const SuperAdmin = () => {
	const institutionId = 1; // hard coded
	const [tabIndex, setTabIndex] = useState(0);

	const [institutionList, setInstitutionList] = useState([]);
	const [courseList, setCourseList] = useState([]);
	const [yearList, setYearList] = useState([]);

	const [institutionFilter, setInstitutionFilter] = useState("");
	const [courseFilter, setCourseFilter] = useState("");
	const [yearFilter, setYearFilter] = useState("");

	const [calendarData, setCalendarData] = useState([]);
	const [activityBreakdown, setActivityBreakdown] = useState({});
	const [clickCalDate, setClickCalDate] = useState("");
	const [showActivity, setShowActivity] = useState(false);
	const [calendarReady, setCalendarReady] = useState(false);

	const baseEndpoint = `https://is434.accredify.io/api/v1/issuance?institutionId=${institutionId}`;
	const institutionEndpoints = [
		`&year=${yearFilter}&flatten=true`,
		`&year=${yearFilter}&institutionId=${institutionFilter}`,
		`&year=${yearFilter}&institutionId=${institutionFilter}&courseCode=${courseFilter}`,
	];

	const tableHeaders = [
		["Institution", "Course Code", "Count"],
		["Course Code", "Count"],
		["Course Code", "Count"],
	];

	///// For Initial Page Load /////
	// Get unique years
	useEffect(() => {
		axios
			.get(
				`https://is434.accredify.io/api/v1/issuance?institutionId=${institutionId}&flatten=true`
			)
			.then((res) => {
				let uniqueYears = [];
				for (let date in res.data.data) {
					let year = date.slice(0, 4);
					if (!uniqueYears.includes(year)) {
						uniqueYears.push(year);
					}
				}
				setYearList(uniqueYears);
			});
	}, []);

	// Get unique years and unique courses under Institution
	const handleInstitutionChange = (e) => {
		setInstitutionFilter(e.target.value);
	
		// Institution's courses
		axios
			.get(
				`https://is434.accredify.io/api/v1/issuance?institutionId=${institutionId}&institution=${institutionFilter}`
			)
			.then((res) => {
				let dataObj = res.data.data;
				let uniqueCourses = [];
				for (let course in dataObj[e.target.value]) {
					if (!uniqueCourses.includes(course)) {
						uniqueCourses.push(course);
					}
				}
				setCourseList(uniqueCourses);
			});

		// Institution's years
		axios
			.get(
				`https://is434.accredify.io/api/v1/issuance?institutionId=${institutionId}&flatten=true&institution =${institutionFilter}`
			)
			.then((res) => {
				let uniqueYears = [];
				for (let date in res.data.data) {
					let year = date.slice(0, 4);
					if (!uniqueYears.includes(year)) {
						uniqueYears.push(year);
					}
				}
				setYearList(uniqueYears);
			});
	};

	useEffect(() => {
		if ((tabIndex === 0 && yearFilter !== "") || (tabIndex === 1 && yearFilter !== "" && institutionFilter !== "") || (tabIndex === 2 && yearFilter !== "" && institutionFilter !== "" && courseFilter !== "")) {
			axios.get(baseEndpoint + institutionEndpoints[tabIndex] + "&flatten=true")
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
	}, [yearFilter, institutionFilter, courseFilter, tabIndex])

	const handleCalendarClick = (day, e) => {
		setShowActivity(true);
		let endpoint = "";
		if (tabIndex === 0) {
			endpoint = `https://is434.accredify.io/api/v1/issuance?institutionId=${institutionId}&date=${day.data.day}`;
		} else if (tabIndex === 1) {
			endpoint = `https://is434.accredify.io/api/v1/issuance?institutionId=${institutionId}&institution=${institutionFilter}&date=${day.data.day}`;
		} else {
			endpoint = `https://is434.accredify.io/api/v1/issuance?institutionId=${institutionId}&institution=${institutionFilter}&date=${day.data.day}&courseCode=${courseFilter}`;
		}

		axios.get(endpoint).then((res) => {
			setActivityBreakdown(res.data.data);
			setClickCalDate(day.data.day);
		});
	};

	return (
		<>
			<Heading mb={3}> Welcome Superadmin! </Heading>
			<VStack align="left">
				<FilterComponent
					filter={{ name: "Institution" }}
					selectOptions={institutionList} // change to institution...
					handleOnChange={(e) => handleInstitutionChange(e)}
				/>
				<FilterComponent
					filter={{ name: "Course" }}
					selectOptions={courseList}
					handleOnChange={(e) => {
					let renameCourse = "%23" + e.target.value.substring(1)
					setCourseFilter(renameCourse)
				}}
				/>
				<FilterComponent
					filter={{ name: "Year" }}
					selectOptions={yearList}
					handleOnChange={(e) => setYearFilter(e.target.value)}
				/>
				</VStack>
				<Box style={{ height: 200 }}>
				{calendarReady === true ? (
					<Heatmap
						calendarData={calendarData}
						yearFilter={yearFilter}
						handleClick={handleCalendarClick}
					/>
				) : (
				<Text mt={5}>
					Select an Institution, a Course and a Year to view heatmap.
				</Text>
				)}
				</Box>
				<Divider mb={2} />
				{showActivity ? (
					<ActivityBox
						activityBreakdown={activityBreakdown}
						tableHeaders={tableHeaders[tabIndex]}
						clickCalDate={clickCalDate}
					/>
				) : null}
		
		</>
	);
};

export default SuperAdmin;
