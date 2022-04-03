import { Box, Center, Heading, Image, SimpleGrid } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import RecommendCertCard from "../components/RecommendCertCard";
import axios from "axios"

const UserCert = () => { 
	const [recommendedCourses, setRecommendedCourses] = useState([])
	let certName = "AWS CLOUD PRACTITIONER ESSENTIALS-P200609GMR"; // hardcoded, to be read from page's data

	useEffect(() => {
		const recommendCoursesEndpoint = `http://localhost:5069/recommend_courses?course_name=${certName}`;
		axios.get(recommendCoursesEndpoint)
		.then((res) => {
			setRecommendedCourses(res.data.data) 
		})
	}, [certName])

	return (
		<Box ml={10} mr={10}>
			<Center mb={10}>
				<Box>
					<Heading mb={5}>{certName}</Heading>
					<Image src="/images/aws-cloud-prac-cert.png" />
				</Box>
			</Center>
			<Box>
				<Heading>
					Recommended courses based on your certificate:
				</Heading>
				<SimpleGrid columns={3} spacing={2}>
					{recommendedCourses === []
						? null
						: recommendedCourses.map((certName) => (
								<RecommendCertCard
									key={certName}
									skillName={certName}
									skillLevels=""
									skillDesc=""
								/>
						))}
				</SimpleGrid>
			</Box>
		</Box>
	);
};

export default UserCert;
