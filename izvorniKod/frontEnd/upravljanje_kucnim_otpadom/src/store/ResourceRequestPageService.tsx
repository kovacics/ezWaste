import Axios from "axios";
import {config} from "./token";
import {POCETNA_ADRESA} from "./BaseUrl";

export const getResRequestFormsByUserID = (currentID: any) =>
    Axios.get(POCETNA_ADRESA + "/forms/res-requests/" + currentID,config)
        .then(function(res) {
            if (res.status === 200) {
                return res;
            }
        })
        .catch(function(error) {
            console.log(error);
            return error;
        });

export const deleteResRequest = (id: string) =>
    Axios.delete(POCETNA_ADRESA + /forms/ + id,config)
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

export const addResRequest = (resRequest: any) =>
    Axios.post(POCETNA_ADRESA + "/forms/", resRequest,config)
        .then(function(res) {
            if (res.status === 201) {
                console.log("prituzba je dodana");
                return true;
            } else {
                console.log("prituzba nije dodana");
                return false;
            }
        })
        .catch(function(error) {
            console.log(error);
            return error;
        });


export const getResponse = (formID: any) =>
    Axios.get(POCETNA_ADRESA + /employeeResponse/ + formID,config)
        .then(function(res) {
            if (res.status === 200) {
                return res;
            }
        })
        .catch(function(error) {
            console.log(error);
            return error;
        });

export const addResponse = (employeeResponse: any) =>
    Axios.post(POCETNA_ADRESA + "/employeeResponse/", employeeResponse,config)
        .then(function(res) {
            if (res.status === 201) {
                return res;
            }
        })
        .catch(function(error) {
            console.log(error);
            return error;
        });
