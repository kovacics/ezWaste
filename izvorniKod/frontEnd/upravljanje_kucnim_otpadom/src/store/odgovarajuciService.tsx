import Axios from "axios";
import {config} from "./token";
import {POCETNA_ADRESA} from "./BaseUrl";


export const getProducts = () =>
    Axios.get(POCETNA_ADRESA + "/products",config)
        .then(function(res) {
            if (res.status === 200) {
                return res;
            }
        })
        .catch(function(error) {
            console.log(error);
            return error;
        });
export const getProductsName = (name:any) =>
    Axios.get(POCETNA_ADRESA + "/products/name/"+name,config)
        .then(function(res) {
            if (res.status === 200) {
                return res;
            }
        })
        .catch(function(error) {
            console.log(error);
            return error;
        });
export const addProduct = (newProduct: any) =>
    Axios.post(POCETNA_ADRESA + "/products/", newProduct,config)
        .then(function(res) {
            if (res.status === 201) {
                console.log("proizvod dodan");
                return true;
            } else {
                console.log("proizvod nije dodan");
                return false;
            }
        })
        .catch(function(error) {
            console.log(error);
            return error;
        });
export const deleteProizvod = (id: string) =>
    Axios.delete(POCETNA_ADRESA + /products/ + id, config)
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
export const updateProizvod = (proizv: any, id : any) =>
    Axios.put(POCETNA_ADRESA + /products/+id,proizv, config)
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

