import Axios from "axios";
import {config} from "./token";
import {POCETNA_ADRESA} from "./BaseUrl";

export const getPendingRequestForms = () =>
    Axios.get(POCETNA_ADRESA + "/forms/res-requests/pending",config)
        .then(function(res) {
            if (res.status === 200) {
                return res;
            }
        })
        .catch(function(error) {
            console.log(error);
            return error;
        });
