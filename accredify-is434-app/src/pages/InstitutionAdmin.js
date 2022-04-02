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

const InstitutionAdmin = () => {
	const institutionId = 2; // hard coded - SMUA
	const [tabIndex, setTabIndex] = useState(0);

	const [yearList, setYearList] = useState([]);
	const [courseList, setCourseList] = useState([]);
	const [issuerList, setIssuerList] = useState([]);

	const [yearFilter, setYearFilter] = useState("");
	const [courseFilter, setCourseFilter] = useState("");
	const [issuerFilter, setIssuerFilter] = useState("");

	const [calendarData, setCalendarData] = useState([]);
	const [activityBreakdown, setActivityBreakdown] = useState({});
	const [clickCalDate, setClickCalDate] = useState("");
	const [showActivity, setShowActivity] = useState(false);
	const [calendarReady, setCalendarReady] = useState(false);

	const baseEndpoint = `https://is434.accredify.io/api/v1/issuance?institutionId=${institutionId}`;
	const institutionEndpoints = [
		`&year=${yearFilter}&flatten=true`,
		`&year=${yearFilter}&issuerId=${issuerFilter}`,
		`&year=${yearFilter}&issuerId=${issuerFilter}&courseCode=${courseFilter}`,
	];

	const tableHeaders = [
		["Issuer", "Course Code", "Count"],
		["Course Code", "Count"],
		["Course Code", "Count"],
	];

	///// For Initial Page Load /////
	// Get unique years
	useEffect(() => {
		axios
			.get(
				`https://is434.accredify.io/api/v1/issuance/years?institutionId=${institutionId}`
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
		setIssuerList([]);

		setYearFilter("");
		setCourseFilter("");
		setIssuerFilter("");

		setCalendarData([]);
		setActivityBreakdown({});
		setClickCalDate("");
		setShowActivity(false);
		setCalendarReady(false);

		// Get issuers of Institution
		axios
			.get(
				`${process.env.REACT_APP_ACCREDIFY_ENDPOINT}/api/v1/issuers?institutionId=${institutionId}`
			)
			.then((res) => {
				let issuers = [];
				for (let issuer of res.data.data) {
					issuers.push({
						id: issuer["id"],
						name: issuer["name"],
					});
				}
				setIssuerList(issuers);
			});
	};

	// Get unique years of chosen Issuer
	const handleIssuerChange = (e) => {
		setIssuerFilter(e.target.value);

		if (tabIndex === 1) {
			axios
				.get(
					`https://is434.accredify.io/api/v1/issuance/years?institutionId=${institutionId}&issuerId=${e.target.value}`
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
		} else {
			// Issuer's courses
			axios
				.get(
					`${process.env.REACT_APP_ACCREDIFY_ENDPOINT}/api/v1/courses?institutionId=${institutionId}&issuerId=${e.target.value}`
				)
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
		}
	};

	// Get years of chosen Course and chosen Issuer
	const handleCourseChange = (e) => {
		setCourseFilter(e.target.value);

		// Issuer's years
		axios
			.get(
				`${process.env.REACT_APP_ACCREDIFY_ENDPOINT}/api/v1/issuance/years?institutionId=${institutionId}&issuerId=${issuerFilter}&courseCode=${e.target.value}`
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
			(tabIndex === 1 && yearFilter !== "" && issuerFilter !== "") ||
			(tabIndex === 2 &&
				yearFilter !== "" &&
				issuerFilter !== "" &&
				courseFilter !== "")
		) {
			axios
				.get(
					baseEndpoint +
						institutionEndpoints[tabIndex] +
						"&flatten=true"
				)
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
	}, [yearFilter, issuerFilter, courseFilter, tabIndex]);

	const handleCalendarClick = (day, e) => {
		let endpoint = "";
		if (tabIndex === 0) {
			endpoint = `https://is434.accredify.io/api/v1/issuance?institutionId=${institutionId}&date=${day.data.day}`;
		} else if (tabIndex === 1) {
			endpoint = `https://is434.accredify.io/api/v1/issuance?institutionId=${institutionId}&issuerId=${issuerFilter}&date=${day.data.day}`;
		} else {
			endpoint = `https://is434.accredify.io/api/v1/issuance?institutionId=${institutionId}&issuerId=${issuerFilter}&date=${day.data.day}&courseCode=${courseFilter}`;
		}

		axios.get(endpoint).then((res) => {
			setActivityBreakdown(res.data.data);
			setClickCalDate(day.data.day);
			setShowActivity(true);
		});
	};

	return (
		<Box ml={10} mr={10}>
			<Heading fontSize="4xl" mb={10}>
				{" "}
				Welcome SMU Academy Admin!{" "}
			</Heading>

			<Tabs
				index={tabIndex}
				onChange={handleTabChange}
				variant="soft-rounded"
				colorScheme="gray"
			>
				<TabList>
					<Tab>Overview</Tab>
					<Tab>Issuer Level</Tab>
					<Tab>Specific Issuer and Course</Tab>
				</TabList>

				<TabPanels>
					{/* Overview */}
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

					{/* Issuer Level */}
					<TabPanel>
						<VStack align="left">
							<FilterComponent
								filter={{ name: "Issuer" }}
								selectOptions={issuerList}
								handleOnChange={(e) => handleIssuerChange(e)}
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
								Select an Issuer and a Year to view heatmap.
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

					{/* Specific issuer and course */}
					<TabPanel>
						<VStack align="left">
							<FilterComponent
								filter={{ name: "Issuer" }}
								selectOptions={issuerList}
								handleOnChange={(e) => handleIssuerChange(e)}
							/>
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
									handleClick={handleCalendarClick}
								/>
							</Box>
						) : (
							<Alert
								status="info"
								style={{ width: "fit-content" }}
							>
								<AlertIcon />
								Select an Issuer, a Course and a Year to view
								heatmap.
							</Alert>
						)}
					</TabPanel>
				</TabPanels>
			</Tabs>
		</Box>
	);
};

export default InstitutionAdmin;