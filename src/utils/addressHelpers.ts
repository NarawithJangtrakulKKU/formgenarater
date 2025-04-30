import { mockAddressData } from './mockData';
import { ThaiAddress, AddressOption } from './types';

// Get unique provinces as options
export const getUniqueProvinces = (): AddressOption[] => {
  const uniqueProvinces = Array.from(new Set(mockAddressData.map((addr: ThaiAddress) => addr.province)));
  return uniqueProvinces.map((province: string) => ({
    label: province,
    value: province
  }));
};

// Get districts by province
export const getDistrictsByProvince = (province: string): AddressOption[] => {
  const districts = mockAddressData
    .filter((addr: ThaiAddress) => addr.province === province)
    .map((addr: ThaiAddress) => addr.district);
  
  const uniqueDistricts = Array.from(new Set(districts));
  return uniqueDistricts.map((district: string) => ({
    label: district,
    value: district
  }));
};

// Get sub-districts by province and district
export const getSubDistrictsByDistrict = (province: string, district: string): AddressOption[] => {
  const subDistricts = mockAddressData
    .filter((addr: ThaiAddress) => addr.province === province && addr.district === district)
    .map((addr: ThaiAddress) => addr.subDistrict);
  
  const uniqueSubDistricts = Array.from(new Set(subDistricts));
  return uniqueSubDistricts.map((subDistrict: string) => ({
    label: subDistrict,
    value: subDistrict
  }));
};

// Get addresses by postcode
export const getAddressByPostcode = (postcode: string): ThaiAddress[] => {
  return mockAddressData.filter((addr: ThaiAddress) => addr.postcode === postcode);
};

// Get postcode by address details
export const getPostcodeByAddress = (
  province: string,
  district: string,
  subDistrict: string
): string | null => {
  const address = mockAddressData.find(
    (addr: ThaiAddress) => 
      addr.province === province && 
      addr.district === district && 
      addr.subDistrict === subDistrict
  );
  return address ? address.postcode : null;
};