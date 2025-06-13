interface NCESSchoolFeatureAttributes {
  NCESSCH?: string,
  LEAID?: string,
  NAME?: string,
  OPSTFIPS?: string,
  STREET?: string,
  CITY?: string,
  STATE?: string,
  ZIP?: string,
  STFIP?: string,
  CNTY?: string,
  NMCNTY?: string,
  LOCALE?: string,
  LAT?: number,
  LON?: number
}

export interface NCESSchoolFeature {
  "attributes"?: NCESSchoolFeatureAttributes,
  "geometry"?: {
    "x": number,
    "y": number
  }
}

interface NCESDistrictFeatureAttributes {
  OBJECTID: number,
  LEAID: string,
  NAME: string,
  OPSTFIPS: string,
  LSTREE: string,
  LCITY: string,
  LSTATE: string,
  LZIP: string,
  LZIP4: string,
  STFIP15: string,
  CNTY15: string,
  NMCNTY15: string,
  LAT1516: number,
  LON1516: number,
  CBSA15: string,
  NMCBSA15: string,
  CBSATYPE15: string,
  CSA15: string,
  NMCSA15: string,
  NECTA15: string,
  NMNECTA15: string,
  CD15: string,
  SLDL15: string,
  SLDU15: string,
}

export interface NCESDistrictFeature {
  "attributes"?: NCESDistrictFeatureAttributes,
  "geometry"?: {
    "x": number,
    "y": number
  }
}

export interface PublicSchoolCharacteristicsFeatureAttributes {
  NCESSCH: string;
  LEA_NAME?: string;
  SCH_NAME?: string;
  LSTREET1?: string;
  LCITY?: string;
  LSTATE?: string;
  LZIP?: string;
  PHONE?: string;
  CHARTER_TEXT?: string;
  VIRTUAL?: string;
  SCHOOL_LEVEL?: string;
  SCHOOL_TYPE_TEXT?: string;
  TOTAL?: number;
  MEMBER?: number;
  FTE?: number;
  TOTFRL?: number;
  AE?: number;
  STUTERATIO?: number;
  LATCOD?: number;
  LONCOD?: number;
}

export interface PublicSchoolCharacteristicsFeature {
  attributes?: PublicSchoolCharacteristicsFeatureAttributes;
  geometry?: {
    type: string;
    coordinates: [number, number];
  };
}

export interface PublicSchoolCharacteristicsFeatureMapped {
  attributes: PublicSchoolCharacteristicsFeatureAttributes;
  geometry?: { x: number; y: number };
}

// const searchSchoolDistricts = async (name:string):Promise<NCESDistrictFeatureAttributes[]> => {
//     let publicSchoolEndpoint = `https://nces.ed.gov/opengis/rest/services/K12_School_Locations/EDGE_GEOCODE_PUBLICLEA_1516/MapServer/0/query?where=UPPER(NAME) LIKE UPPER('%${name}%')&outFields=*&outSR=4326&f=json`;

//     let combinedData = [];
//     let publicResponse = await (await fetch(publicSchoolEndpoint)).json();

//     combinedData = [
//         ...publicResponse.features ? publicResponse.features.map((feature:NCESDistrictFeature) => {return feature.attributes }) : [],
//     ]
//     return combinedData;
// }
const searchSchoolDistricts = async (name: string): Promise<NCESDistrictFeature[]> => {
  const publicSchoolEndpoint = `https://nces.ed.gov/opengis/rest/services/K12_School_Locations/EDGE_GEOCODE_PUBLICLEA_1516/MapServer/0/query?where=UPPER(NAME) LIKE UPPER('%${name}%')&outFields=*&outSR=4326&f=json`;

  const publicResponse = await (await fetch(publicSchoolEndpoint)).json();

  // Return full features (attributes + geometry)
  return publicResponse.features ? publicResponse.features.map((feature: NCESDistrictFeature) => ({
    attributes: feature.attributes,
    geometry: feature.geometry,
  })) : [];
};


// const searchSchools = async (name:string, district?:string):Promise<NCESSchoolFeatureAttributes[]> => {
//     let privateSchoolEndpoint = `https://services1.arcgis.com/Ua5sjt3LWTPigjyD/arcgis/rest/services/Private_School_Locations_Current/FeatureServer/0/query?where=UPPER(NAME) LIKE UPPER('%${name}%')${district ? `%20AND%20LEAID%20%3D%20'${district}'` : ""}&outFields=*&outSR=4326&f=json`;
//     let publicSchoolEndpoint = `https://services1.arcgis.com/Ua5sjt3LWTPigjyD/arcgis/rest/services/Public_School_Location_201819/FeatureServer/0/query?where=UPPER(NAME) LIKE UPPER('%${name}%')${district ? `%20AND%20LEAID%20%3D%20'${district}'` : ""}&outFields=*&outSR=4326&f=json`;
//     let combinedData = [];
//     let privateResponse = await (await fetch(privateSchoolEndpoint)).json();
//     let publicResponse = await (await fetch(publicSchoolEndpoint)).json();

//     combinedData = [
//         ...privateResponse.features ? privateResponse.features.map((feature:NCESSchoolFeature) => {return feature.attributes }) : [],
//         ...publicResponse.features ? publicResponse.features.map((feature:NCESSchoolFeature) => {return feature.attributes }) : [],
//     ]
//     return combinedData;
// }
const searchSchools = async (name: string, district?: string): Promise<NCESSchoolFeature[]> => {
  const privateSchoolEndpoint = `https://services1.arcgis.com/Ua5sjt3LWTPigjyD/arcgis/rest/services/Private_School_Locations_Current/FeatureServer/0/query?where=UPPER(NAME) LIKE UPPER('%${name}%')${district ? `%20AND%20LEAID%20%3D%20'${district}'` : ""}&outFields=*&outSR=4326&f=json`;
  const publicSchoolEndpoint = `https://services1.arcgis.com/Ua5sjt3LWTPigjyD/arcgis/rest/services/Public_School_Location_201819/FeatureServer/0/query?where=UPPER(NAME) LIKE UPPER('%${name}%')${district ? `%20AND%20LEAID%20%3D%20'${district}'` : ""}&outFields=*&outSR=4326&f=json`;

  const privateResponse = await (await fetch(privateSchoolEndpoint)).json();
  const publicResponse = await (await fetch(publicSchoolEndpoint)).json();

  const combinedData = [
    ...(privateResponse.features ? privateResponse.features.map((feature: NCESSchoolFeature) => ({
      attributes: feature.attributes,
      geometry: feature.geometry,
    })) : []),
    ...(publicResponse.features ? publicResponse.features.map((feature: NCESSchoolFeature) => ({
      attributes: feature.attributes,
      geometry: feature.geometry,
    })) : []),
  ];

  return combinedData;
};

const fetchPublicSchoolCharacteristics = async (ncessch: string): Promise<PublicSchoolCharacteristicsFeatureMapped[]> => {
  const url = `https://services1.arcgis.com/Ua5sjt3LWTPigjyD/arcgis/rest/services/School_Characteristics_Current/FeatureServer/0/query?where=NCESSCH='${ncessch}'&outFields=NCESSCH,LEA_NAME,SCH_NAME,LSTREET1,LCITY,LSTATE,LZIP,PHONE,CHARTER_TEXT,VIRTUAL,SCHOOL_LEVEL,STATUS,SCHOOL_TYPE_TEXT,TOTAL,MEMBER,FTE,STUTERATIO,TOTFRL,AE,LATCOD,LONCOD&outSR=4326&f=json`;

  const response = await fetch(url);
  const data = await response.json();

  // console.log("Public School Characteristics API Response:", data);

  const features = data.features
    ? data.features.map((feature: PublicSchoolCharacteristicsFeature) => ({
      attributes: feature.attributes, // map properties → attributes → your app can use attributes
      geometry: feature.geometry
        ? {
          x: feature.geometry.coordinates?.[0],
          y: feature.geometry.coordinates?.[1],
        }
        : undefined,
    }))
    : [];

  return features;
};


export { searchSchoolDistricts, searchSchools, fetchPublicSchoolCharacteristics }