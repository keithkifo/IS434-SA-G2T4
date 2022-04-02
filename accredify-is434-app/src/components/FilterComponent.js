import {
	Box,
	HStack,
	Select,
} from "@chakra-ui/react";

const FilterComponent = ({ filter, selectOptions, handleOnChange }) => {
	return (
		<HStack>
			<Box w="20%">{filter.name}:</Box>
			<Box>
				<Select
					variant="outline"
					bg="blue.100"
					placeholder={"Select a " + filter.name}
					onChange={handleOnChange}
				>
					{selectOptions === null
						? null
						: selectOptions.map((item) => (
							<option key={`${item["id"]}-${item["name"]}` } value={item["id"]}>
								{item["name"]}
							</option>
						)
					)}
				</Select>
			</Box>
		</HStack>
	);
};

export default FilterComponent;
