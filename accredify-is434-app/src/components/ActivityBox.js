import { Box, Table, Thead, Tr, Th, Tbody, Td, Heading } from "@chakra-ui/react";
const ActivityBox = ({ activityBreakdown, tableHeaders, clickCalDate }) => {
    return (
        <Box>
            <Heading fontSize={"xl"}>Issuance Activity for {clickCalDate}</Heading>
            <Table mt={3}>
                <Thead>
                    <Tr>
                        {tableHeaders.map(th => {
                            return (
                                <Th key={th}>{th}</Th>
                            )
                        })}
                    </Tr>
                </Thead>
                <Tbody>
                    {tableHeaders.length === 3
                        ?
                        Object.entries(activityBreakdown).map(([issuer, courses]) => {
                            return (
                                Object.entries(courses).map(([course, dateCount]) => {
                                    return (
                                        <Tr key={`${issuer}-${course}`}>
                                            <Td>{issuer}</Td>
                                            <Td>{course}</Td>
                                            <Td>{dateCount[Object.keys(dateCount)[0]]}</Td>
                                        </Tr>
                                    )
                                })
                            )
                        })
                        :
                        Object.entries(activityBreakdown).map(([course, dateCount]) => {
                            return (
                                <Tr key={course}>
                                    <Td>{course}</Td>
                                    <Td>{dateCount[Object.keys(dateCount)[0]]}</Td>
                                </Tr>
                            )
                        })
                    }
                </Tbody>
            </Table>
        </Box>
    )
}

export default ActivityBox