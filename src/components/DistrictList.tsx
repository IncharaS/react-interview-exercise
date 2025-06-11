import { Box, Heading, Text, VStack, HStack } from "@chakra-ui/react";
import { GoogleMap, Marker } from "@react-google-maps/api";
import { useState } from "react";
import { DistrictListProps } from "./types";

const DistrictList: React.FC<DistrictListProps> = ({
    districts,
    setSelectedDistrict,
    isLoaded,

}) => {
    // Define fixed map container size for consistent UI layout
    const containerStyle = {
        width: "100%",
        height: "400px",
    };

    // Track which district is currently hovered or highlighted
    const [highlightedDistrictId, setHighlightedDistrictId] = useState<number | null>(null);

    // Set map center to first district's location or default to central US coords
    const center = {
        lat: districts[0]?.geometry?.y ?? 39.5,
        lng: districts[0]?.geometry?.x ?? -98.35,
    };

    // Determine zoom level based on number of districts to give best overview
    const zoomLevel =
        districts.length === 1
            ? 10
            : districts.length < 5
                ? 8
                : districts.length <= 20
                    ? 6
                    : 3;

    return (
        <Box mb={6}>
            {/* Section heading */}
            <Heading size="md" mb={3}>
                Matching Districts
            </Heading>

            {/* Main layout: list on left, map on right */}
            <HStack align="start" spacing={4}>
                {/* District List Box */}
                <Box flex="1" maxW="40%" overflowY="auto" maxH="400px">
                    <VStack align="stretch">
                        {/* Render each district with hover and click handling */}
                        {districts.map((district, index) => (
                            <Box
                                key={`district-${district.attributes?.LEAID ?? `fallback-${index}`}`}
                                p={3}
                                borderWidth={2}
                                borderColor={
                                    highlightedDistrictId === district.attributes?.OBJECTID
                                        ? "green.400"
                                        : "gray.200"
                                }
                                borderRadius="md"
                                cursor="pointer"
                                bg="white"
                                onClick={() => setSelectedDistrict(district)} // Select district on click
                                onMouseEnter={() => setHighlightedDistrictId(district.attributes?.OBJECTID ?? null)} // Highlight on hover
                                onMouseLeave={() => setHighlightedDistrictId(null)} // Remove highlight on mouse out
                            >
                                {/* Show district name or fallback LEAID */}
                                {district.attributes?.NAME ?? `District LEAID: ${district.attributes?.LEAID}`}
                                <Text fontSize="sm" color="gray.500">
                                    {/* Show additional district info */}
                                    {district.attributes?.NMCBSA15}
                                </Text>
                            </Box>
                        ))}
                    </VStack>
                </Box>

                {/* Google Map Box */}
                <Box flex="2" minH="400px">
                    {isLoaded ? (
                        districts.length === 0 ? (
                            // Prompt when no districts found / selected
                            <Text>Search a School District</Text>
                        ) : (
                            // Render the map centered and zoomed appropriately
                            // @ts-ignore - react-google-maps types workaround
                            <GoogleMap
                                mapContainerStyle={containerStyle}
                                center={center}
                                zoom={zoomLevel}
                            ><></>
                                {/* Map markers for each district with interactive highlighting  */}
                                {districts
                                    .filter(d => d.geometry) // Only districts with geometry
                                    .map((district, index) => (
                                        // @ts-ignore
                                        <Marker
                                            key={`district-marker-${index}`}
                                            position={{
                                                lat: district.geometry!.y,
                                                lng: district.geometry!.x,
                                            }}
                                            title={district.attributes?.NAME}
                                            icon={
                                                highlightedDistrictId === district.attributes?.OBJECTID
                                                    ? "http://maps.google.com/mapfiles/ms/icons/green-dot.png"
                                                    : undefined
                                            }
                                            onClick={() => setSelectedDistrict(district)} // Select district from marker click
                                            onMouseOver={() => setHighlightedDistrictId(district.attributes?.OBJECTID ?? null)} // Highlight marker on hover
                                            onMouseOut={() => setHighlightedDistrictId(null)} // Remove highlight on mouse out
                                        />
                                    ))}
                            </GoogleMap>
                        )
                    ) : (
                        // Map loading state
                        <Text>Loading map...</Text>
                    )}
                </Box>
            </HStack>
        </Box>
    );
};

export default DistrictList;
