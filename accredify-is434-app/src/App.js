import { ChakraProvider } from "@chakra-ui/react"
import { Route, Routes } from "react-router-dom";
import Issuer from "./components/Issuer";
import Superadmin from "./components/Superadmin";
import InstitutionAdmin from "./components/InstitutionAdmin";
import UserCert from "./components/UserCert";
import UserJobSearch from "./components/UserJobSearch";
import SidebarWithHeader from './components/SidebarWithHeader';

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
					element={<SidebarWithHeader children={<Superadmin />} />}
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
				<Route
					path="/user/job-search"
					element={<SidebarWithHeader children={<UserJobSearch />} />}
				/>
			</Routes>
		</ChakraProvider>
	);
}

export default App;