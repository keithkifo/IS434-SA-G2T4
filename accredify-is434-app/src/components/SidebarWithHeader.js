import React from "react";
import {
	IconButton,
	Avatar,
	Box,
	CloseButton,
	Flex,
	HStack,
	VStack,
	Icon,
	useColorModeValue,
	Link as ChakraLink,
	Drawer,
	DrawerContent,
	Text,
	useDisclosure,
	Menu,
	MenuButton,
	MenuDivider,
	MenuItem,
	MenuList,
	Image,
} from "@chakra-ui/react";
import {
	FiHome,
	FiTrendingUp,
	FiCompass,
	FiStar,
	FiSettings,
	FiMenu,
	FiBell,
	FiChevronDown,
} from "react-icons/fi";

import { Link, useLocation } from "react-router-dom";


const LinkItems = [
	{
		name: "Issuer",
		icon: FiHome,
		address: "/",
		username: "Sherman Lee",
		userTitle: "Issuer",
		imageURL:
			"https://media-exp1.licdn.com/dms/image/C5603AQGgH4JOeQ7awA/profile-displayphoto-shrink_200_200/0/1589885406154?e=1653523200&v=beta&t=ifw7Wb4VzK517Slepu3hT2CgqDwAfMZKHKNoSH3NkYc",
	},
	{
		name: "Superadmin",
		icon: FiTrendingUp,
		address: "/superadmin",
		username: "Derrick Lee",
		userTitle: "Super Admin",
		imageURL: "https://accredify.io/_nuxt/img/derrick.6bb4b68.jpg",
	},
	{
		name: "Institution Admin",
		icon: FiCompass,
		address: "/institution-admin",
		username: "Keith Chiang",
		userTitle: "SMUA Admin",
		imageURL:
			"https://media-exp1.licdn.com/dms/image/C5603AQF_YCD8xLzT1A/profile-displayphoto-shrink_200_200/0/1612933950176?e=1653523200&v=beta&t=U1KtPVFUATRa2pHaLg2DizxeVNWzTI4ZcJOajQCGIcI",
	},
	{
		name: "User Single Cert",
		icon: FiStar,
		address: "/user/cert",
		username: "Jon Wong",
		userTitle: "User",
		imageURL:
			"https://media-exp1.licdn.com/dms/image/C5603AQFeZapapTMqkw/profile-displayphoto-shrink_200_200/0/1610194997061?e=1653523200&v=beta&t=ifeYV2gxiIJpcFRXG2M1HUOvzCeT_Djn86JQeKTDSHI",
	},
	{
		name: "User Job Search",
		icon: FiSettings,
		address: "/user/job-search",
		username: "Justina Clark",
		userTitle: "User",
		imageURL:
			"https://images.unsplash.com/photo-1619946794135-5bc917a27793?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&s=b616b2c5b373a80ffc9636ba24f7a4a9",
	},
];

export default function SidebarWithHeader({ children }) {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const location = useLocation()
	var userItem = {}

	for (let item of LinkItems) {
		if (item["address"] === location.pathname) {
			userItem = item
		}
	}

	return (
		<Box minH="100vh" bg={useColorModeValue("gray.100", "gray.900")}>
			<SidebarContent
				onClose={() => onClose}
				display={{ base: "none", md: "block" }}
			/>
			<Drawer
				autoFocus={false}
				isOpen={isOpen}
				placement="left"
				onClose={onClose}
				returnFocusOnClose={false}
				onOverlayClick={onClose}
				size="full"
			>
				<DrawerContent>
					<SidebarContent onClose={onClose} />
				</DrawerContent>
			</Drawer>

			{/* mobilenav */}
			<MobileNav onOpen={onOpen} userItem={userItem}/>
			<Box ml={{ base: 0, md: 60 }} p="4">
				{children}
			</Box>
		</Box>
	);
}

const SidebarContent = ({ onClose, ...rest }) => {
	return (
		<Box
			transition="3s ease"
			bg={useColorModeValue("#141E32", "gray.900")}
			color="white"
			borderRight="1px"
			borderRightColor={useColorModeValue("gray.200", "gray.700")}
			w={{ base: "full", md: 60 }}
			pos="fixed"
			h="full"
			{...rest}
		>
			<Flex
				h="20"
				alignItems="center"
				mx="8"
				justifyContent="space-between"
			>
				<Link to="/">
					<Image src="/images/accredify-logo.png" />
				</Link>
				<CloseButton
					display={{ base: "flex", md: "none" }}
					onClick={onClose}
				/>
			</Flex>
			{LinkItems.map((link) => (
                <Link to={link.address}>
                    <NavItem key={link.name} icon={link.icon}>
                        {link.name}
                    </NavItem>
                </Link>
			))}
		</Box>
	);
};

const NavItem = ({ icon, children, ...rest }) => {
	return (
		<ChakraLink
			style={{ textDecoration: "none" }}
			_focus={{ boxShadow: "none" }}
		>
			<Flex
				align="center"
				p="4"
				mx="4"
				borderRadius="lg"
				role="group"
				cursor="pointer"
				_hover={{
					bg: "cyan.400",
					color: "white",
				}}
				{...rest}
			>
				{icon && (
					<Icon
						mr="4"
						fontSize="16"
						_groupHover={{
							color: "white",
						}}
						as={icon}
					/>
				)}
				{children}
			</Flex>
		</ChakraLink>
	);
};

const MobileNav = ({ onOpen, userItem, ...rest }) => {
	return (
		<Flex
			ml={{ base: 0, md: 60 }}
			px={{ base: 4, md: 4 }}
			height="20"
			alignItems="center"
			bg={useColorModeValue("white", "gray.900")}
			borderBottomWidth="1px"
			borderBottomColor={useColorModeValue("gray.200", "gray.700")}
			justifyContent={{ base: "space-between", md: "flex-end" }}
			{...rest}
		>
			<IconButton
				display={{ base: "flex", md: "none" }}
				onClick={onOpen}
				variant="outline"
				aria-label="open menu"
				icon={<FiMenu />}
			/>

			<Text
				display={{ base: "flex", md: "none" }}
				fontSize="2xl"
				fontFamily="monospace"
				fontWeight="bold"
			>
				<Image src="/images/accredify-logo.png" />
			</Text>

			<HStack spacing={{ base: "0", md: "6" }}>
				<IconButton
					size="lg"
					variant="ghost"
					aria-label="open menu"
					icon={<FiBell />}
				/>
				<Flex alignItems={"center"}>
					<Menu>
						<MenuButton
							py={2}
							transition="all 0.3s"
							_focus={{ boxShadow: "none" }}
						>
							<HStack>
								<Avatar size={"md"} src={userItem["imageURL"]} />
								<VStack
									display={{ base: "none", md: "flex" }}
									alignItems="flex-start"
									spacing="1px"
									ml="2"
								>
									<Text fontSize="sm">
										{userItem["username"]}
									</Text>
									<Text fontSize="xs" color="gray.600">
										{userItem["userTitle"]}
									</Text>
								</VStack>
								<Box display={{ base: "none", md: "flex" }}>
									<FiChevronDown />
								</Box>
							</HStack>
						</MenuButton>
						<MenuList
							bg={useColorModeValue("white", "gray.900")}
							borderColor={useColorModeValue(
								"gray.200",
								"gray.700"
							)}
						>
							<MenuItem>Profile</MenuItem>
							<MenuItem>Settings</MenuItem>
							<MenuItem>Billing</MenuItem>
							<MenuDivider />
							<MenuItem>Sign out</MenuItem>
						</MenuList>
					</Menu>
				</Flex>
			</HStack>
		</Flex>
	);
};