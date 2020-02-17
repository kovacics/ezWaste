import Axios from "axios";
import {config} from "./token";
import {POCETNA_ADRESA} from "./BaseUrl";


export const getScheduleForLocation = (city : any, street : any) =>
    Axios.get(POCETNA_ADRESA + "/collections/location?city=" + city + "&street=" + street,config)
        .then(function(res) {
            if (res.status === 200) {
                return res;
            }
        })
        .catch(function(error) {
            console.log(error);
            return error;
        });

export const addScheduleForLocation = (newSchedule: any) =>
    Axios.post(POCETNA_ADRESA + "/collections/", newSchedule,config)
        .then(function(res) {
            if (res.status === 201) {
                console.log("termin dodan");
                return true;
            } else {
                console.log("termin nije dodan");
                return false;
            }
        })
        .catch(function(error) {
            console.log(error);
            return error;
        });
export const deleteSchedule = (id: string) =>
    Axios.delete(POCETNA_ADRESA + /collections/ + id, config)
        .then(function(res) {
            if (res.status === 200) {
                console.log("uspjesno");
                return res;
            }
        })
        .catch(function(error) {
            console.log(error);
            return error;
        });

export const getAllSchedules = () =>
    Axios.get(POCETNA_ADRESA + "/collections/", config)
        .then(function(res) {
            if (res.status === 200) {
                return res;
            }
        })
        .catch(function(error) {
            console.log(error);
            return error;
        });

export const getUserSchedule = (userID : string) =>
    Axios.get(POCETNA_ADRESA + "/collections/user/" + userID,config)
        .then(function(res) {
            if (res.status === 200) {
                return res;
            }
        })
        .catch(function(error) {
            console.log(error);
            return error;
        });

export const updateSchedule = (id: string, updated : any) =>
    Axios.put(POCETNA_ADRESA + "/collections/"+id,updated,config)
        .then(function(res) {
            if (res.status === 200) {
                console.log("termin azuriran");
                return true;
            } else {
                console.log("termin nije azuriran")
                return false;
            }
        })
        .catch(function(error) {
            console.log(error);
            console.log(id, updated);
            return error;
        });
