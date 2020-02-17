import Axios from "axios";
import {config} from "./token";
import {POCETNA_ADRESA} from "./BaseUrl";


export const signin = (credentials: any) =>
  Axios.post(POCETNA_ADRESA + "/login", credentials)
    .then(function(res) {
      if (res.status === 200) {
        sessionStorage.setItem("userInfo", JSON.stringify(res.data));
        console.log("response exists");
        return res;
      }
    })
    .catch(function(error) {
      console.log(error);
      return error;
    });

export const getPendingRequests = () =>
  Axios.get(POCETNA_ADRESA + "/forms/complaints/pending",config)
    .then(function(res) {
      if (res.status === 200) {
        return res;
      }
    })
    .catch(function(error) {
      console.log(error);
      return error;
    });

export const register = (newUser: any) =>
  Axios.post(POCETNA_ADRESA + "/registration", newUser)
    .then(function(res) {
      if (res.status === 200) {
        console.log("user je registriran");
        return true;
      } else {
        console.log("korisniik je već registriran");
        return false;
      }
    })
    .catch(function(error) {
      console.log(error);
      return error;
    });
