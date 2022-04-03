import { Alert, AlertIcon, Box, Divider, Heading, SimpleGrid, VStack } from "@chakra-ui/react";
import JobCard from "../components/JobCard"
import FilterComponent from "../components/FilterComponent"
import { useEffect, useState } from "react";
// import axios from "axios";
import jsonData from "../static_json/sample_response.json"

const UserJobSearch = () => {
	// const {REACT_APP_API_GATEWAY_ENDPOINT} = process.env

	const [sectors, setSectors] = useState([]);
	const [tracks, setTracks] = useState([]);
	const [chosenSector, setChosenSector] = useState("")
	const [chosenTrack, setChosenTrack] = useState("")
	const [jobRoles, setJobRoles] = useState([])

	// Retrieve all sectors
	useEffect(() => {
		// axios.get()
		// .then(res => {
		// 	setSectors()
		// })
		setSectors([
			{
				id: "Infocomm Technology",
				name: "Infocomm Technology",
			},
		]);
	}, [])

	const handleSectorChange = (e) => {
		setChosenSector(e.target.value);

		// Retrieve tracks when a sector is chosen
		// axios.get()
		// .then(res => {
		// 	setTracks()
		// });
		setTracks([
			{
				id: "Strategy and Governance",
				name: "Strategy and Governance",
			},
			{
				id: "Infrastructure",
				name: "Infrastructure",
			},
			{
				id: "Software and Applications",
				name: "Software and Applications",
			},
			{
				id: "Data and Artificial Intelligence",
				name: "Data and Artificial Intelligence",
			},
			{
				id: "Operations and Support",
				name: "Operations and Support",
			},
			{
				id: "Cyber Security",
				name: "Cyber Security",
			},
			{
				id: "Sales and Marketing",
				name: "Sales and Marketing",
			},
		]);
	}

	
	useEffect(() => {
		if (chosenSector !== "" && chosenTrack !== "") {
			// const lambdaEndpoint = `${REACT_APP_API_GATEWAY_ENDPOINT}/recommend/jobs?sector=${chosenSector}&track=${chosenTrack}`;
			// axios.get(lambdaEndpoint).then((res) => {
			// 	setJobRoles(res.data.data);
			// });
			for (let elem of jsonData.data) {
				if (elem["sector"] === chosenSector && elem["track"] === chosenTrack) {
					setJobRoles(old => [...old, elem])
				}
			}
		}
	}, [chosenSector, chosenTrack])


	return (
		<Box ml={10} mr={10}>
			<Heading fontSize="4xl" mb={5}>
				Job Role Search
			</Heading>
			<VStack align="left">
				<FilterComponent
					filter={{ name: "Sector" }}
					selectOptions={sectors}
					handleOnChange={(e) => handleSectorChange(e)}
				/>
				<FilterComponent
					filter={{ name: "Track" }}
					selectOptions={tracks}
					handleOnChange={(e) => setChosenTrack(e.target.value)}
				/>
			</VStack>
			<Divider m={5} />

			{chosenSector !== "" && chosenTrack !== "" && jobRoles !== []? (
				<SimpleGrid columns={3} spacing={2}>
					{jobRoles.map(job => {
						return (
							<JobCard key={`${job.job_role}`} jobInfo={job} />
						)
					})}
				</SimpleGrid>
			) : (
				<Alert status="info" style={{"width": "fit-content"}}>
					<AlertIcon />
					Select a Sector and Track to view your skill match.
				</Alert>
			)}
		</Box>
	);
};

export default UserJobSearch;
