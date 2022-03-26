import Heatmap from "../components/Heatmap";
import FilterComponent from "../components/FilterComponent"
import axios from 'axios'
import React from "react"

// class IssuerCourseLv extends React.Component {
//     componentDidMount() {
//       const apiUrl = 'https://jsonplaceholder.typicode.com/users';
//       fetch(apiUrl)
//         .then((response) => response.json())
//         .then((data) => console.log('This is your data', data));
//     }
//     render() {
//       return <h1>my Component has Mounted, Check the browser 'console' </h1>;
//     }
//   }


  // 2) Use Axios to call API asynchronously
  axios.get("https://jsonplaceholder.typicode.com/users")
  .then(response => {

      // a) Inspect the response.data
      console.log(response)
      console.log(response.data[0].email)
  })
  .catch(error => {
      console.log(error.message)
  })

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


// var bodyFormData = new FormData();

// bodyFormData.append('userName', 'Fred');
// bodyFormData.append('image', 'TEST'); 
// axios({
//     method: 'post',
//     url: 'myurl',
//     data: bodyFormData,
//     headers: {'Content-Type': 'multipart/form-data' }
//     })
//     .then(function (response) {
//         //handle success
//         console.log("Success");
//     })
//     .catch(function (response) {
//         //handle error
//         console.log("Failed");
//     });

export default IssuerCourseLv