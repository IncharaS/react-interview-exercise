import { Box, Button, Heading, Text, Flex, Stack, Divider, SimpleGrid } from "@chakra-ui/react";
import { SchoolDetailsProps } from "./types";
const SchoolDetails: React.FC<SchoolDetailsProps> = ({ selectedSchool, setSelectedSchool, schoolCharacteristics }) => {
    const lat = selectedSchool.geometry?.y;
    const lon = selectedSchool.geometry?.x;

    return (
        <Box p={6} borderWidth={1} borderRadius="md" bg="white" >

            <Box position="sticky" top="150px" width="100%" zIndex="sticky" bgGradient="linear(to-r, white 25%, rgba(255, 255, 255, 0) 100%)" py={3}>
                <Flex align="center" justify="space-between">
                    {/* Left button */}
                    <Button
                        size="sm"
                        onClick={() => setSelectedSchool(null)}
                        colorScheme="green"
                        variant="outline"
                        bg="white"
                    >
                        ← Back to Schools List
                    </Button>

                    {/* Center heading */}
                    <Heading size="lg" color="gray.700" mb={0}>
                        {selectedSchool.attributes?.NAME}
                    </Heading>
                    {lat && lon && (
                        <Box mt={4}>
                            <a
                                href={`https://www.google.com/maps/search/?api=1&query=${lat},${lon}`}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {/* Right button */}
                                <Button
                                    size="sm"
                                    colorScheme="green"
                                    bg="white"
                                >
                                    View on Google Maps
                                </Button>
                            </a>
                        </Box>
                    )}

                </Flex>
            </Box>
            {/* 
              Main content area showing detailed school information. Data fetched from privateSchoolEndpoint OR publicSchoolEndpoint
              Uses a vertical stack layout with spacing between sections.
            */}
            <Stack spacing={2}>
                <SimpleGrid columns={[1, 2]} spacing={4}>
                    <Box>
                        <Text fontWeight="bold">Address:</Text>
                        <Text>
                            {selectedSchool.attributes?.STREET}, {selectedSchool.attributes?.CITY}, {selectedSchool.attributes?.NMCNTY}, {selectedSchool.attributes?.STATE} {selectedSchool.attributes?.ZIP}
                        </Text>
                    </Box>

                    <Box>
                        <Text fontWeight="bold">District ID:</Text>
                        <Text>{selectedSchool.attributes?.LEAID}</Text>
                    </Box>

                    {lat && lon && (
                        <Box>
                            <Text fontWeight="bold">Coordinates:</Text>
                            <Text>Lat: {lat}, Lon: {lon}</Text>
                        </Box>
                    )}
                </SimpleGrid>

                <Divider my={4} />
                {/* 
                This data is additional. Available only for Public schools.
                  Conditionally render additional school characteristics if provided.
                  Uses a grid layout for neat two-column display.
                  Falls back to a simple message if no data is available.
                */}
                {schoolCharacteristics ? (
                    <>
                        <Heading size="md" mb={2}>Additional Characteristics</Heading>

                        <SimpleGrid columns={[1, 2]} spacing={4}>
                            <Box>
                                <Text fontWeight="bold">Phone:</Text>
                                <Text>{schoolCharacteristics.PHONE ?? "N/A"}</Text>
                            </Box>

                            <Box>
                                <Text fontWeight="bold">Whether a Charter School:</Text>
                                <Text>{schoolCharacteristics.CHARTER_TEXT ?? "N/A"}</Text>
                            </Box>

                            <Box>
                                <Text fontWeight="bold">Virtual School:</Text>
                                <Text>{schoolCharacteristics.VIRTUAL ?? "N/A"}</Text>
                            </Box>

                            <Box>
                                <Text fontWeight="bold">School Level:</Text>
                                <Text>{schoolCharacteristics.SCHOOL_LEVEL ?? "N/A"}</Text>
                            </Box>
                            <Box>
                                <Text fontWeight="bold">Total of free lunch and reduced-price lunch eligible:</Text>
                                <Text>{schoolCharacteristics.TOTFRL ?? "N/A"}</Text>
                            </Box>

                            <Box>
                                <Text fontWeight="bold">School Type:</Text>
                                <Text>{schoolCharacteristics.SCHOOL_TYPE_TEXT ?? "N/A"}</Text>
                            </Box>

                            <Box>
                                <Text fontWeight="bold">Total Students:</Text>
                                <Text>{schoolCharacteristics.TOTAL ?? "N/A"}</Text>
                            </Box>
                            <Box>
                                <Text fontWeight="bold">Adult Education Students:</Text>
                                <Text>{schoolCharacteristics.AE ?? "N/A"}</Text>
                            </Box>

                            <Box>
                                <Text fontWeight="bold">Student-Teacher Ratio:</Text>
                                <Text>{schoolCharacteristics.STUTERATIO ?? "N/A"}</Text>
                            </Box>
                        </SimpleGrid>
                    </>
                ) : (
                    <Text>No additional characteristics found.</Text>
                )}


            </Stack>
        </Box>
    );
};

export default SchoolDetails;
