import React from "react";
import ReactSearchBox from 'react-search-box'
import {
  getProducts, getProductsName, addProduct, deleteProizvod, updateProizvod
} from "../../store/odgovarajuciService";
import "../../pages/design/termini.css";
import {Alert, Button, Form, FormControl, InputGroup} from "react-bootstrap";
import biootpad from '../../assets/odlaganje/biootpad.jpeg'
import biootpad2 from '../../assets/odlaganje/biootpad.png'
import crno from '../../assets/odlaganje/crno.png'
import papir from '../../assets/odlaganje/papir.png'
import plastika from '../../assets/odlaganje/plastika.png'
import plastika_vrecice from '../../assets/odlaganje/plastika_vrecice.jpg'
import plavo from '../../assets/odlaganje/plavo.png'
import smedje from '../../assets/odlaganje/smedje.png'
import staklo from '../../assets/odlaganje/staklo.png'
import tekstil from '../../assets/odlaganje/tekstil.jpg'
import zeleno from '../../assets/odlaganje/zeleno.png'
import zuto from '../../assets/odlaganje/zuto.png'
import baterija from '../../assets/odlaganje/baterije.jpg'
import "../../pages/design/odlaganje.css";
import jwt from "jwt-decode";
export interface Proizvod{
  id: string |null,
  name : string,
  wasteType : string
}
export default class Odgovarajuci extends React.Component {
  state = {
    proizvod : "",
    imenaProizvoda : [],
    render : true,
    extraPrivilege: false,
    wasteType : "",
    name : ""
  }
  private reciklaza = false;
  private tip = "";
  private svaPoljaIspunjena = false
  private uspjesno = false;
  private uspjesno2 = false
  private dodavanje = false
  private uspjesnoBrisanje = false;
  private prviPut = false;
  private azuriranje = false;
  private ime = "";
  private waste = ""
  private dodajProizvod(proizvod: Proizvod){
    this.setState({ imenaProizvoda: [...this.state.imenaProizvoda, ({key : proizvod.id, value : proizvod.name})]})
  }
  constructor(props: any){
    super(props);
    const item = sessionStorage.getItem("userInfo");
    if(item) {
      const token = jwt(item!);
      if (token) {
        // @ts-ignore
        const role = token.role;
        if(role==="ADMIN" || role==="EMPLOYEE") {
          this.state = {proizvod: "", imenaProizvoda : [], render : true, extraPrivilege: true, wasteType : "",name : ""};
        }
      }
    }
  }
  private dohvatiSlike = ()=>{
    if (this.tip === "ORGANIC"){
      this.tip = ""
      return(
      <div>
          <label><h2>Biootpad možemo odlagati u:</h2></label>
          <br/>
        <img src={biootpad} alt="biootpad" width="300px" height="300px"/>
        <img src={smedje} alt="biootpad" width="300px" height="300px"/>
          <br/>
        <img src={biootpad2} alt="biootpad" width="300px" height="300px"/>
      </div>)
    }else if(this.tip === "PLASTIC"){
      this.tip = ""
      return(
          <div>
              <label><h2>Plastiku možemo odlagati u:</h2></label>
              <br/>
            <img src={plastika} alt="plastika" width="300px" height="300px"/>
            <img src={zuto} alt="plastika" width="300px" height="300px"/>
            <br/>
            <img src={plastika_vrecice} alt="plastika" width="300px" height="300px"/>
          </div>)
    }else if(this.tip === "METAL"){
      this.tip = ""
      return(
          <div>
              <label><h2>Metal možemo odvajati u:</h2></label>
              <br/>
            <img src={plastika_vrecice} alt="metal" width="300px" height="300px"/>
          </div>)
    }else if(this.tip === "GLASS"){
      this.tip = ""
      return(
          <div>
              <label><h2>Staklo možemo odlagati u:</h2></label>
              <br/>
            <img src={staklo} alt="staklo" width="300px" height="300px"/>
            <img src={zeleno} alt="staklo" width="300px" height="300px"/>
          </div>)
    }else if(this.tip === "PAPER"){
      this.tip = ""
      return(
          <div>
              <label><h2>Papir možemo odlagati u:</h2></label>
              <br/>
            <img src={papir} alt="papir" width="300px" height="300px"/>
            <img src={plavo} alt="papir" width="300px" height="300px"/>
          </div>)
    }else if(this.tip === "LIGHT_BULBS"){
      this.tip = ""
      return(
          <div>
              <label><h2>Žarulje:</h2></label>
              <br/>
            <p>
              smatra se opasnim otpadom te se predaju ovlaštenom sakupljaču
            </p>
            <p>
              pozivom na broj 0800 444 110 koji besplatno preuzima navedeni otpad
            </p>
            <p>
              na kućnoj adresi ili besplatno dovesti na reciklažno dvorište (OPREZNO RUKOVATI,
            </p>
            <p>
              PO MOGUĆNOSTI PREDAVATI U AMBALAŽI U KOJOJ JE KUPLJENO)
            </p>
          </div>)

    }else if(this.tip === "BATTERIES"){
      this.tip = ""
      return(
          <div>
              <label><h2>Baterije možemo odlagati u:</h2></label>
              <br/>
            <img src={baterija} alt="baterije" width="300px" height="300px"/>
          </div>)
    }else if(this.tip === "CLOTHES"){
      this.tip = ""
      return(
          <div>
              <label><h2>Tekstil možemo odlagati u:</h2></label>
              <br/>
            <img src={tekstil} alt="odjeca" width="300px" height="300px"/>
          </div>)
    }else if(this.tip === "E_WASTE"){
        this.tip = ""
        return(
            <div>
                <label><h2>E-otpad:</h2></label>
                <br/>
                <p>
                    Predati ovlaštenom sakupljaču pozivom na broj
                </p>
                <p>
                    0800 444 110 koji besplatno preuzima (EE otpad)
                </p>
                na kućnoj adresi, ili besplatno dovesti na reciklažno
                <p>
                    dvorište, uz uvjet da nije prethodno rastavljen radi vađenja zasebnih komponenti.
                </p>
            </div>)
    }else if(this.tip === "MIXED_WASTE"){
        this.tip = ""
        return(
            <div>
                <label><h2>Mješoviti otpad možemo odlagati u:</h2></label>
                <br/>
                <img src={crno} alt="mjesani" width="300px" height="300px"/>
            </div>)
    }
    this.setState({render:false})
  }
  private getProizvodi = ()=>{
    this.setState({imenaProizvoda : []});
    getProducts().then((res) => {
      if (res.status === 200) {
        return res.data.map((proizvod: Proizvod) => {
          return this.dodajProizvod(proizvod)
        })
      }
    })
    this.reciklaza = true
  }
  private getProizvodName = (proizvod:any)=>{
    getProductsName(proizvod).then((res) => {
      if (res.status === 200) {
          this.ime = proizvod
          this.waste = res.data.wasteType
        this.tip = res.data.wasteType
        this.setState({render:false})
      }
    })
  }
  private dodajItem = () =>{
    this.dodavanje = !this.dodavanje
      this.azuriranje = false;
    this.setState({render:false})
  }
    private azurirajItem = () =>{
        this.azuriranje= !this.azuriranje
        this.dodavanje = false
        this.ime = this.state.proizvod
        this.setState({render:false})
    }
  private addProizvod = ()=>{
    const newProizvod = {
      name : this.state.name,
      wasteType: this.state.wasteType
    }
    if(!(this.state.name&&this.state.wasteType)){
      this.svaPoljaIspunjena = false;
      setTimeout(()=>{this.svaPoljaIspunjena=true;},3000);
    }
    else{
      this.svaPoljaIspunjena = true;
    }
    this.dodaj(newProizvod);
    this.setState({name: ''});
    this.prviPut = false;
    this.setState({wasteType: ''});

  }
  private dodaj = (proizvod: any) => {
    if (this.svaPoljaIspunjena) {
      addProduct(proizvod).then((res) => {
        if (res === true) {
          this.uspjesno = true
            this.prviPut = false;
          this.setState({render: false})
          setTimeout(() => {
            this.uspjesno = false;
            this.setState({render: false})
            this.dodajItem()
          }, 1500);
        }
      })
          .catch((error) => {
            console.log(error);
          });
    }else{
      this.setState({render:false})
    }
  }
  private updateProiz = (proizvod : any, tip : any) =>{
      console.log(this.state.proizvod)
      getProductsName(this.state.proizvod).then((res) => {
          if (res.status === 200) {
              const proizv = {
                  name : proizvod,
                  wasteType : tip
              }
              updateProizvod(proizv, res.data.id)
                  .then((res) => {
                          if(res.status === 200){
                              this.uspjesno2 = true
                              setTimeout(() => {
                                  this.uspjesno2 = false;
                                  this.setState({render: false})
                                  this.azurirajItem()
                              }, 1500);
                              this.setState({render:false});
                          }
                          else{
                              console.log("nije se ažurirao");
                          }
                      }

                  ).catch((error) => {
                  console.log(error);
              })
              this.setState({render:false})
          }
      })
  }
  private brisanje = (proizvod: any) => {
    getProductsName(proizvod).then((res) => {
      if (res.status === 200) {
        deleteProizvod(res.data.id)
            .then((res) => {
                  if(res.status === 200){
                    this.uspjesnoBrisanje = true
                    setTimeout(() => {
                      this.uspjesnoBrisanje = false;
                      this.setState({render: false})
                    }, 1500);
                    this.prviPut = false;
                      this.setState({render:false});
                  }
                  else{
                    console.log("nije se obrisao proizvod");
                  }
                }

            ).catch((error) => {
          console.log(error);
        })
        this.setState({render:false})
      }
    })
  }
  private odustani = () => {
    this.dodajItem()
    this.setState({render : false, name : "", wasteType : ""})
  }
    private odustani2 = () => {
        this.azurirajItem()
        this.setState({render : false, name : "", wasteType : ""})
    }


  onSelect = (e: any) => this.setState({proizvod: e.value});
  onChange = (e: any) => this.setState({[e.target.name]: e.target.value});
    onChange2 = (e: any) => {
        this.setState({[e.target.name]: e.target.value});
        this.ime = e.target.value
    }
    onChange3 = (e: any) => {
        this.setState({[e.target.name]: e.target.value});
        this.waste = e.target.value
    }
  render() {
      if(!this.prviPut){
          {this.getProizvodi()}
          this.prviPut = true
      }
    return (
        <div className={"cent"}>
            {this.reciklaza && !this.dodavanje && !this.azuriranje?
            <label><h1>Recikliranje proizvoda</h1></label> : null}
          {this.reciklaza && !this.dodavanje && !this.azuriranje?
              <div className={"col-4"}>
                <ReactSearchBox
                    placeholder="Unesite proizvod"
                    data={this.state.imenaProizvoda}
                    callback={record => console.log(record)}
                    onSelect = {this.onSelect}
                />
                <Button variant="secondary" type="submit" className={"Odlaganje"} onClick={() =>{this.getProizvodName(this.state.proizvod)}}>
                  Odlaganje
                </Button>
                  {this.state.extraPrivilege?<Button variant="info" className={"btnZap"} type="submit" onClick={() =>{this.azurirajItem()}}>Ažuriraj</Button> : null}
                  {this.state.extraPrivilege?<Button variant="danger" className={"btnZap"} type="submit" onClick={() =>{this.brisanje(this.state.proizvod)}}>Obriši</Button> : null}
                <div>{this.state.extraPrivilege?
                    <div>
                        <Button variant="primary" type="submit" className={"btnZap3"} onClick={() =>{this.dodajItem()}}>Dodaj</Button>{' '}
                    </div>
                :null}</div>
              </div>: null
        }<div>
          </div>
          {this.dodavanje && !this.azuriranje?<Form.Group className="inp">
                  <Form.Label><h1>Dodavanje novog proizvoda</h1></Form.Label>
                    <br/>
                  <Form.Label>Naziv proizvoda</Form.Label>
                <FormControl
                    aria-label="Default"
                    aria-describedby="inputGroup-sizing-default"
                    className="col-4"
                    name = "name"
                    value = {this.state.name}
                    onChange={this.onChange}
                />
              </Form.Group>

              : null
          }

          {this.dodavanje&& !this.azuriranje?<Form.Group className="inp">
                  <Form.Label>Waste Type</Form.Label>
                  <Form.Control as="select"
                                className="col-4"
                                name = "wasteType"
                                value = {this.state.wasteType}
                                onChange={this.onChange}
                  >
                      <option>Choose...</option>
                      <option>ORGANIC</option>
                      <option>PLASTIC</option>
                      <option>METAL</option>
                      <option>GLASS</option>
                      <option>PAPER</option>
                      <option>LIGHT_BULBS</option>
                      <option>BATTERIES</option>
                      <option>CLOTHES</option>
                      <option>E_WASTE</option>
                      <option>MIXED_WASTE</option>
                  </Form.Control>
              </Form.Group>
              : null
          }
          {this.dodavanje&& !this.azuriranje?
              <Button variant="primary" type="submit" className="inp" onClick={() =>{this.addProizvod()}}>
                Kreiraj
              </Button> : null}
            {this.uspjesno?
                <Alert variant={"success"} className={"col-4"}>
                    Uspješno dodavanje proizvoda!
                </Alert>:null
            }
          {' '}
          {this.dodavanje&& !this.azuriranje?
              <Button variant="danger" type="submit" className="inp" onClick={() =>{this.odustani()}}>
                Odustani
              </Button> : null}
            {this.azuriranje && !this.dodavanje?<Form.Group className="inp">
                    <Form.Label><h1>Ažuriranje proizvoda</h1></Form.Label>
                <br/>
                    <Form.Label>Naziv proizvoda</Form.Label>
                    <FormControl
                        aria-label="Default"
                        aria-describedby="inputGroup-sizing-default"
                        className="col-4"
                        name = "name"
                        value = {this.ime}
                        onChange={this.onChange2}
                    />
                </Form.Group>

                : null
            }

            {this.azuriranje && !this.dodavanje?<Form.Group className="inp">
                    <Form.Label>Waste Type</Form.Label>
                    <Form.Control as="select"
                                  className="col-4"
                                  name = "wasteType"
                                  value = {this.waste}
                                  onChange={this.onChange3}
                    >
                        <option>Choose...</option>
                        <option>ORGANIC</option>
                        <option>PLASTIC</option>
                        <option>METAL</option>
                        <option>GLASS</option>
                        <option>PAPER</option>
                        <option>LIGHT_BULBS</option>
                        <option>BATTERIES</option>
                        <option>CLOTHES</option>
                        <option>E_WASTE</option>
                        <option>MIXED_WASTE</option>
                    </Form.Control>
                </Form.Group>
                : null
            }
            {this.azuriranje && !this.dodavanje?
                <Button variant="info" type="submit" className="inp" onClick={() =>{this.updateProiz(this.ime,this.waste)}}>
                    Ažuriraj
                </Button> : null}
            {' '}
            {this.azuriranje && !this.dodavanje?
                <Button variant="danger" type="submit" className="inp" onClick={() =>{this.odustani2()}}>
                    Odustani
                </Button> : null}
            {this.uspjesno2?
                <Alert variant={"success"} className={"col-4"}>
                    Uspješno ažuriranje proizvoda!
                </Alert>:null
            }
              <div>
            <div>
          {this.tip && this.reciklaza? this.dohvatiSlike() : null}
            </div>
          </div>
          {this.uspjesnoBrisanje?
          <Alert variant={"success"} className={"col-4"}>
            Uspješno brisanje proizvoda!
          </Alert>:null
          }
        </div>
    )
  }
}
