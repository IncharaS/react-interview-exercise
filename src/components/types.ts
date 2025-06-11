// types.ts

import { NCESDistrictFeature, NCESSchoolFeature, PublicSchoolCharacteristicsFeatureAttributes } from "@utils/nces";

export interface BreadcrumbNavProps {
  selectedDistrict: NCESDistrictFeature | null;
  selectedSchool: NCESSchoolFeature | null;
}

export interface DistrictListProps {
  districts: NCESDistrictFeature[];
  setSelectedDistrict: (district: NCESDistrictFeature) => void;
  showDistrictMap: boolean;
  setShowDistrictMap: React.Dispatch<React.SetStateAction<boolean>>;
  isLoaded: boolean;
}

export interface SchoolsListProps {
  schools: NCESSchoolFeature[];
  setSelectedSchool: (school: NCESSchoolFeature) => void;
  selectedDistrict: NCESDistrictFeature;
  showMap: boolean;
  setShowMap: React.Dispatch<React.SetStateAction<boolean>>;
  isLoaded: boolean;
}

export interface SchoolDetailsProps {
  selectedSchool: NCESSchoolFeature;
  setSelectedSchool: React.Dispatch<React.SetStateAction<NCESSchoolFeature | null>>;
  schoolCharacteristics: PublicSchoolCharacteristicsFeatureAttributes | null;
}
