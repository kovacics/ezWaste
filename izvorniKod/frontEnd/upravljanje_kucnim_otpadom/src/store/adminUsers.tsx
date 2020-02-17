import Axios from "axios";
import {config} from "./token";
import {POCETNA_ADRESA} from "./BaseUrl";

export const getUsers = () =>
  Axios.get(POCETNA_ADRESA + "/users/",config)
    .then(function(res) {
      if (res.status === 200) {
        return res;
      }
    })
    .catch(function(error) {
      console.log(error);
      return error;
    });

export const deleteUser = (id: string) =>
  Axios.delete(POCETNA_ADRESA + "/users/" + id,config)
    .then(function(res) {
      if (res.status === 200) {
        return res;
      }
    })
    .catch(function(error) {
      console.log(error);
      return error;
    });
