import Heatmap from "../components/Heatmap"
import FilterComponent from "../components/FilterComponent"

const Superadmin = () => {
    const filters = [
        {name: "Institution"}, 
        {name: "Course"}, 
        {name: "Year"}
    ]

    return (
		<>
			<h1> Welcome Superadmin! </h1>

			<FilterComponent filters={filters}/>

			<div style={{ width: "80vw", height: 300 }}>
				<Heatmap />
			</div>
		</>
	);
}

export default Superadmin