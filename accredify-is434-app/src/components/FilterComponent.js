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
					{selectOptions === undefined
						? null
						: selectOptions.map((item, i) => {
								return (
									<option key={item + i} value={item}>
										{item}
									</option>
								);
						  })}
				</Select>
			</Box>
		</HStack>
	);
};

export default FilterComponent;
