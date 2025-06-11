import { Box, Heading, Text, VStack, HStack, Input } from "@chakra-ui/react";
import { GoogleMap, Marker } from '@react-google-maps/api';
import { useState } from "react";
import { SchoolsListProps } from "./types";

const SchoolsList: React.FC<SchoolsListProps> = ({
    schools,
    setSelectedSchool,
    selectedDistrict,
    isLoaded,
    showMap,
    setShowMap,
}) => {
    // Define map container size
    const containerStyle = {
        width: '100%',
        height: '400px',
    };

    const [highlightedSchoolId, setHighlightedSchoolId] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");

    // Filter schools based on case-insensitive match with the search term
    const filteredSchools = schools.filter(school =>
        (school.attributes?.NAME ?? "").toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Box mb={6}>
            {/* Heading showing selected district name */}
            <Heading size="md" mb={3}>
                Schools in {selectedDistrict.attributes?.NAME}
            </Heading>

            {/* Flex row layout: left = school list, right = map */}
            <HStack align="start" spacing={4}>

                {/* School List & Search */}
                <Box flex="1" maxW="40%" overflowY="auto" maxH="400px">

                    {/* Search bar for filtering schools by name */}
                    {schools.length > 0 && (
                        <Input
                            placeholder="Search schools..."
                            mb={3}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    )}

                    {/* Scrollable list of filtered schools */}
                    <VStack align="stretch">
                        {filteredSchools.length === 0 ? (
                            // Empty state when no school matches
                            null
                        ) : (
                            filteredSchools.map((school, index) => (
                                <Box
                                    key={school.attributes?.NCESSCH ?? school.attributes?.NAME ?? `fallback-${index}`}
                                    p={3}
                                    borderWidth={2}
                                    borderColor={highlightedSchoolId === school.attributes?.NCESSCH ? "green.400" : "gray.200"}
                                    borderRadius="md"
                                    cursor="pointer"
                                    bg="white"
                                    onClick={() => setSelectedSchool(school)}
                                    onMouseEnter={() => setHighlightedSchoolId(school.attributes?.NCESSCH ?? null)}
                                    onMouseLeave={() => setHighlightedSchoolId(null)}
                                >
                                    {school.attributes?.NAME} - {school.attributes?.CITY}, {school.attributes?.STATE}
                                </Box>
                            ))
                        )}
                    </VStack>
                </Box>

                {/* Map */}
                <Box flex="2" minH="400px">
                    {/* Render map only when Google Maps API is loaded */}
                    {isLoaded && (
                        filteredSchools.length === 0 ? (
                            <Text>No schools found in this district.</Text>
                        ) : (
                            // @ts-ignore is used here due to typing issues with GoogleMap props
                            <GoogleMap
                                mapContainerStyle={containerStyle}
                                center={{
                                    lat: selectedDistrict.geometry?.y ?? 0,
                                    lng: selectedDistrict.geometry?.x ?? 0,
                                }}
                                zoom={
                                    filteredSchools.length === 1
                                        ? 10
                                        : filteredSchools.length < 5
                                            ? 8
                                            : 6
                                }
                            >
                                {/* Render a marker for each school with valid geometry */}
                                {filteredSchools
                                    .filter(school => school.geometry)
                                    .map((school, index) => (
                                        // @ts-ignore again due to Marker typing limitations
                                        <Marker
                                            key={`marker-${index}`}
                                            position={{
                                                lat: school.geometry!.y,
                                                lng: school.geometry!.x,
                                            }}
                                            title={school.attributes?.NAME}
                                            icon={
                                                highlightedSchoolId === school.attributes?.NCESSCH
                                                    ? "http://maps.google.com/mapfiles/ms/icons/green-dot.png"
                                                    : undefined
                                            }
                                            onClick={() => setSelectedSchool(school)}
                                            onMouseOver={() => setHighlightedSchoolId(school.attributes?.NCESSCH ?? null)}
                                            onMouseOut={() => setHighlightedSchoolId(null)}
                                        />
                                    ))}
                            </GoogleMap>
                        )
                    )}
                </Box>
            </HStack>
        </Box>
    );
};

export default SchoolsList;
