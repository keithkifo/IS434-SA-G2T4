import Heatmap from "../components/Heatmap";
import FilterComponent from "../components/FilterComponent"

const IssuerCourseLv = () => {
	const filters = [
		{ name: "Course" },
		{ name: "Year" },
	];

	return (
		<>
			<FilterComponent filters={filters} />

			<div style={{ width: "80vw", height: 300 }}>
				<Heatmap />
			</div>
		</>
	);
};

export default IssuerCourseLv