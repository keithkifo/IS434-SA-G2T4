import { ChakraProvider } from "@chakra-ui/react"
import { Route, Routes } from "react-router-dom";
import Issuer from "./pages/Issuer";
import Superadmin from "./pages/Superadmin";
import InstitutionAdmin from "./pages/InstitutionAdmin";
import UserCert from "./pages/UserCert";
import UserJobSearch from "./pages/UserJobSearch";
import SidebarWithHeader from "./components/SidebarWithHeader";

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