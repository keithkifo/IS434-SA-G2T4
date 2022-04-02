import {
	Box,
	Divider,
	VStack,
	Heading,
	Alert,
	AlertIcon
} from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import FilterComponent from "../components/FilterComponent";
import Heatmap from "../components/Heatmap";

const Superadmin = () => {
	const [institutionList, setInstitutionList] = useState([]);
	const [yearList, setYearList] = useState([]);

	const [institutionFilter, setInstitutionFilter] = useState("");
	const [yearFilter, setYearFilter] = useState("");

	const [calendarData, setCalendarData] = useState([]);
	const [calendarReady, setCalendarReady] = useState(false);

	///// For Initial Page Load /////
	// Get list of institutions
	useEffect(() => {
		axios
			.get(
				`${process.env.REACT_APP_ACCREDIFY_ENDPOINT}/api/v1/institutions`
			)
			.then((res) => {
				let institutions = [];
				for (let institution of res.data.data) {
					institutions.push({
						id: institution["id"],
						name: institution["name"],
					});
				}
				setInstitutionList(institutions);
			});
	}, []);

	// Get years of courses under Institution
	const handleInstitutionChange = (e) => {
		setInstitutionFilter(e.target.value);
		// Institution's courses
		axios
			.get(
				`${process.env.REACT_APP_ACCREDIFY_ENDPOINT}/api/v1/issuance/years?institutionId=${e.target.value}&flatten=true`
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
		if (institutionFilter !== "" && yearFilter !== "") {
			axios
				.get(
					`${process.env.REACT_APP_ACCREDIFY_ENDPOINT}/api/v1/issuance?institutionId=${institutionFilter}&year=${yearFilter}&flatten=true`
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
	}, [institutionFilter, yearFilter]);

	return (
		<Box ml={10} mr={10}>
			<Heading mb={10}> Welcome Super Admin! </Heading>

			<VStack align="left">
				<FilterComponent
					filter={{ name: "Institution" }}
					selectOptions={institutionList}
					handleOnChange={(e) => handleInstitutionChange(e)}
				/>
				<FilterComponent
					filter={{ name: "Year" }}
					selectOptions={yearList}
					handleOnChange={(e) => setYearFilter(e.target.value)}
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
				<Alert status="info" style={{ width: "fit-content" }}>
					<AlertIcon />
					Select an Institution and a Year to view heatmap.
				</Alert>
			)}
		</Box>
	);
};

export default Superadmin;
