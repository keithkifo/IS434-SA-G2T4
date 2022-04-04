import { ChakraProvider } from "@chakra-ui/react"
import { Route, Routes } from "react-router-dom";
import Issuer from "./pages/Issuer";
import SuperAdmin from "./pages/SuperAdmin";
import InstitutionAdmin from "./pages/InstitutionAdmin";
import UserCert from "./pages/UserCert";
import UserJobSearch from "./pages/UserJobSearch";
import SidebarWithHeader from "./components/SidebarWithHeader";
import JobRolePage from "./pages/JobRolePage";

function App() {
	return (
		<ChakraProvider>
			<Routes>
				<Route
					index
					path="/"
					element={<SidebarWithHeader children={<Issuer />} />}
				/>
				<Route
					path="/superadmin"
					element={<SidebarWithHeader children={<SuperAdmin />} />}
				/>
				<Route
					path="/institution-admin"
					element={
						<SidebarWithHeader children={<InstitutionAdmin />} />
					}
				/>
				<Route
					path="/user/cert"
					element={<SidebarWithHeader children={<UserCert />} />}
				/>

				<Route path="/user/job-search">
					<Route
						index
						element={
							<SidebarWithHeader children={<UserJobSearch />} />
						}
					/>
					<Route
						path=":jobRole"
						element={
							<SidebarWithHeader children={<JobRolePage />} />
						}
					/>
				</Route>
			</Routes>
		</ChakraProvider>
	);
}

export default App;