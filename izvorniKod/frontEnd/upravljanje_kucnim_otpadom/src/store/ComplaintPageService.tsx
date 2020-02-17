import Axios from "axios";
import {config} from "./token";
import {POCETNA_ADRESA} from "./BaseUrl";



export const getComplaintFormsByUserID = (currentID: any) =>
    Axios.get(POCETNA_ADRESA + "/forms/complaints/" + currentID,config)
        .then(function(res) {
            if (res.status === 200) {
                return res;
            }
        })
        .catch(function(error) {
            console.log(error);
            return error;
        });

export const getComplaintByID = (formID: any) =>
    Axios.get(POCETNA_ADRESA + "/forms/" + formID,config)
        .then(function(res) {
            if (res.status === 200) {
                return res;
            }
        })
        .catch(function(error) {
            console.log(error);
            return error;
        });

export const deleteComplaint = (id: string) =>
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

export const addComplaint = (newComplaint: any) =>
    Axios.post(POCETNA_ADRESA + "/forms/", newComplaint,config)
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

export const addResponse = (employeeResponse: any) =>
    Axios.post(POCETNA_ADRESA + "/employeeResponse/", employeeResponse,config)
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







