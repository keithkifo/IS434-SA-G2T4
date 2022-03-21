import { ChevronDownIcon } from "@chakra-ui/icons";
import { Box, Button, HStack, Menu, MenuButton, MenuItem, MenuList, VStack } from "@chakra-ui/react";

const FilterComponent = (prop) => {
    return (
		<VStack align="left">
			{prop.filters.map((item, i) => {
				return (
					<HStack>
						<Box w="20%">{item.name}:</Box>
						<Box>
							<Menu>
								<MenuButton
									as={Button}
									rightIcon={<ChevronDownIcon />}
									colorScheme="pink"
								>
									List of {item.name}
								</MenuButton>
								<MenuList>
									<MenuItem>Course 1</MenuItem>
								</MenuList>
							</Menu>
						</Box>
					</HStack>
				);
			})}
		</VStack>
	);
}

export default FilterComponent