import Axios from "axios";
import {Landfill} from "../components/informacijske_komponente/Dostupni";
import {config} from "./token";
import {POCETNA_ADRESA} from "./BaseUrl";


export const giveLandFills = () => Axios.get(POCETNA_ADRESA+"/landfills");

export const giveLandFillsOnId = (id: number) => Axios.get(POCETNA_ADRESA+"/landfills/nearby/user/"+id, config);

export const saveLandFill = (landFill: Landfill) => Axios.post(POCETNA_ADRESA + '/landfills', transform(landFill), config);

export const updateLandFill = (landFill: Landfill) => Axios.put(POCETNA_ADRESA + '/landfills/'+landFill.id,landFill, config);

export const deleteLandFilled = (id: number) => Axios.delete(POCETNA_ADRESA + '/landfills/'+id, config);

export const getLongLat = (id: number) => Axios.get(POCETNA_ADRESA + `/landfills/geolocation/`+id, config);

const transform = (landfill: Landfill) => {
  const a = {
    city: landfill.address.city,
    number: landfill.address.number,
    street: landfill.address.street,
    wasteTypes: filterWasteTypes(landfill.wasteTypes),
    workingHoursEnd: hormin(landfill.workingHoursEnd),
    workingHoursStart: hormin(landfill.workingHoursStart)
  }
  return a;
}

const hormin = (str: string) => {
  const lis = str.split(":");
  return lis[0]+":"+lis[1];
}

const filterWasteTypes = (str: string[]) => {
  return str.map(s => s);
}
