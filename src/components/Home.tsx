import React, { useEffect, useState, useMemo } from "react";
import { Button, Input, Container, Box } from "@chakra-ui/react";
import {
  searchSchoolDistricts,
  searchSchools,
  NCESDistrictFeature,
  NCESSchoolFeature,
  PublicSchoolCharacteristicsFeatureAttributes,
  fetchPublicSchoolCharacteristics,
} from "@utils/nces";
import { getGoogleMapsApiKey } from '@utils/maps';

const apiKey = getGoogleMapsApiKey();

import { useJsApiLoader } from "@react-google-maps/api";

import BreadcrumbNav from "./BreadcrumbNav";
import DistrictList from "./DistrictList";
import SchoolsList from "./SchoolsList";
import SchoolDetails from "./SchoolDetails";

const Home: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");

  const [districts, setDistricts] = useState<NCESDistrictFeature[]>([]);
  const [selectedDistrict, setSelectedDistrict] = useState<NCESDistrictFeature | null>(null);
  const [schools, setSchools] = useState<NCESSchoolFeature[]>([]);
  const [selectedSchool, setSelectedSchool] = useState<NCESSchoolFeature | null>(null);

  // const [showMap, setShowMap] = useState(false);
  const [showDistrictMap, setShowDistrictMap] = useState(false);

  const [schoolCharacteristics, setSchoolCharacteristics] = useState<PublicSchoolCharacteristicsFeatureAttributes | null>(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: apiKey,
  });

  // Fetch districts based on search term
  useEffect(() => {
    if (searchTerm.length > 2) {
      searchSchoolDistricts(searchTerm)
        .then((data) => {
          // console.log("District API Response:", data);
          // sorting districts alphabetically by name
          const sortedDistricts = data
            .slice()
            .sort((a, b) =>
              (a.attributes?.NAME ?? "").toLowerCase().localeCompare((b.attributes?.NAME ?? "").toLowerCase())
            );
          setDistricts(sortedDistricts);
        })
        .catch((err) => {
          // console.error("Error fetching districts:", err);
          setDistricts([]);
        });
    } else {
      setDistricts([]);
    }
  }, [searchTerm]);

  // Fetch schools when a district is selected
  useEffect(() => {
    if (selectedDistrict) {
      // console.log("Selected district:", selectedDistrict);
      const leaId = selectedDistrict?.attributes?.LEAID;

      if (leaId) {
        searchSchools("", leaId)
          .then((data) => {
            // console.log("Schools API Response:", data);
            // sorting schools alphabetically by name
            const sortedSchools = data
              .slice()
              .sort((a, b) =>
                (a.attributes?.NAME ?? "").toLowerCase().localeCompare((b.attributes?.NAME ?? "").toLowerCase())
              );
            setSchools(sortedSchools);
          })
          .catch((err) => {
            // console.error("Error fetching schools:", err);
            setSchools([]);
          });
      } else {
        setSchools([]);
      }
    } else {
      setSchools([]);
    }
  }, [selectedDistrict]);

  //  Handle school selection and fetch its characteristics
  const handleSelectSchool = (school: NCESSchoolFeature) => {
    setSelectedSchool(school);

    const schoolId = school.attributes?.NCESSCH;
    if (schoolId) {
      fetchPublicSchoolCharacteristics(schoolId)
        .then((features) => {
          // console.log("Public School Characteristics Response:", features);
          const firstFeature = features[0];
          if (firstFeature?.attributes) {
            setSchoolCharacteristics(firstFeature.attributes);
          } else {
            setSchoolCharacteristics(null);
          }
        })
        .catch((err) => {
          // console.error("Error fetching school characteristics:", err);
          setSchoolCharacteristics(null);
        });
    } else {
      setSchoolCharacteristics(null);
    }
  };

  return (
    <Container maxW="container.xl">
      <Box position="sticky" top="80px" width="100%" zIndex="sticky" bg="white">
        <BreadcrumbNav selectedDistrict={selectedDistrict} selectedSchool={selectedSchool} />

        {!selectedSchool && !selectedDistrict && (
          <Input
            placeholder="Search for a District"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              if (e.target.value.length > 0) {
                setSelectedDistrict(null);
                setSelectedSchool(null);
              }
            }}
            mb={1}
          />
        )}

        {!!selectedDistrict && (
          <Button
            size="sm"
            mb={4}
            colorScheme="green"
            onClick={() => {
              setSelectedSchool(null);
              setSchoolCharacteristics(null);
              setSelectedDistrict(null);
            }}
          >
            ← Back to Districts List
          </Button>
        )}
      </Box>

      {/* Conditional content rendering */}
      {!selectedDistrict && (
        <DistrictList
          districts={districts}
          setSelectedDistrict={setSelectedDistrict}
          showDistrictMap={showDistrictMap}
          setShowDistrictMap={setShowDistrictMap}
          isLoaded={isLoaded}
        />
      )}

      {selectedDistrict && !selectedSchool && (
        <SchoolsList
          schools={schools}
          selectedDistrict={selectedDistrict}
          setSelectedSchool={handleSelectSchool}
          // showMap={showMap}
          // setShowMap={setShowMap}
          isLoaded={isLoaded}
        />
      )}

      {selectedSchool && (
        <SchoolDetails
          selectedSchool={selectedSchool}
          setSelectedSchool={setSelectedSchool}
          schoolCharacteristics={schoolCharacteristics}
        />
      )}
    </Container>
  );

};

export default Home;
