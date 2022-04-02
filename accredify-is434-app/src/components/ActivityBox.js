import { Box, Table, Thead, Tr, Th, Tbody, Td, Heading, Center } from "@chakra-ui/react";
const ActivityBox = ({ activityBreakdown, tableHeaders, clickCalDate }) => {
    let d = new Date(clickCalDate)
    let d_str = d.toDateString().split(" ")
    let d_reorg = `${d_str[2]} ${d_str[1]} ${d_str[3]} (${d_str[0]})`;

    return (
        <Box mt={10}>
            <Center mb={20}>
                <Heading fontSize={"2xl"}>Issuance Activity for {d_reorg}</Heading>
            </Center>
            <Table size="sm">
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