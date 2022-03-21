import { Box } from "@chakra-ui/react";
import { useState } from "react";
import FilterComponent from "./FilterComponent";
import Heatmap from "./Heatmap";

const IssuerCourseLv = () => {
	const [showActivityDiv, setShowActivityDiv] = useState(false)
	const [dateData, setDateData] = useState({})

	return (
		<>
			<FilterComponent filters={[{ name: "Year" }]}/>

			<Box style={{ width: "80vw", height: 300 }}>
				<Heatmap
					handleClick={(day, event) => {
						setShowActivityDiv(true);
						setDateData(day.data);
						console.log(day);
					}}
				/>
			</Box>

			<Box>
				Issuance Activities
				<Box>
					{showActivityDiv ? (
						<ul>
							<li>{dateData.day}</li>
							<li>{dateData.value}</li>
						</ul>
					) : (
						<h1>This means showActivityDiv is false</h1>
					)}
				</Box>
			</Box>
		</>
	);
};

export default IssuerCourseLv