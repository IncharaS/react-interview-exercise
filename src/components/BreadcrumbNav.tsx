import { Text } from "@chakra-ui/react";
import { BreadcrumbNavProps } from "./types";

const BreadcrumbNav: React.FC<BreadcrumbNavProps> = ({ selectedDistrict, selectedSchool }) => {
    // Extract district and school names safely with fallback to empty string
    const districtName = selectedDistrict?.attributes?.NAME ?? "";
    const schoolName = selectedSchool?.attributes?.NAME ?? "";

    // Construct breadcrumb text based on what is selected:
    // - If no district selected, show just "Districts"
    // - If district selected but no school, show "Districts > [District Name]"
    // - If both district and school selected, show full path with school details
    const breadcrumbText = selectedDistrict
        ? selectedSchool
            ? `Districts > ${districtName} > ${schoolName} > Details`
            : `Districts > ${districtName}`
        : "Districts";

    return (
        // Display the breadcrumb as a small, gray text above the content for context
        <Text fontSize="sm" color="gray.700" mb={2}>
            You are here: {breadcrumbText}
        </Text>
    );
};

export default BreadcrumbNav;
