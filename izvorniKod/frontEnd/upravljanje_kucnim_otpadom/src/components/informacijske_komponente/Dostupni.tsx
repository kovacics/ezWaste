import React from "react";
import {Button, Card, Col, Dropdown, Form, FormControl, Modal} from "react-bootstrap";
import {Karta} from "./karta/Karta";
import jwt from "jwt-decode";
import {
  deleteLandFilled,
  getLongLat,
  giveLandFills,
  giveLandFillsOnId,
  saveLandFill,
  updateLandFill
} from "../../store/LandFillService";
import {Cell, Grid} from "styled-css-grid";
import cloneDeep from 'lodash/cloneDeep';

export interface Locations{
  city:	string;
  id:	number | null;
  number:	number;
  street:	string;
}

export interface Landfill{
  address:	Locations;
  id:	number | null;
  wasteTypes: string[];
  workingHoursEnd:	string;
  workingHoursStart: string;
}

export default class Dostupni extends React.Component{
  state = {
    listOfLandfields: [] as Landfill[],
    extraPrivilege: false,
    creatingLocation: false,
    lokacija: {} as Landfill,
    wasteTypes: ["ORGANIC"] as string[],
    idUsera: -1
  }

  // da mi se ispravno updata stanje na ponuđenim vrstama otpada
  // da mi se prikažu odredene lokacije

  constructor(props: any){
    super(props);
    const item = sessionStorage.getItem("userInfo");
    if(item) {
      const token = jwt(item!);
      console.log(token);
      if (token) {
        // @ts-ignore
        const role = token.role;
        if(role==="ADMIN" || role==="EMPLOYEE") {
          // @ts-ignore
          this.state = {listOfLandfields: [] as Landfill[], extraPrivilege: true, creatingLocation: false, lokacija: {} as Landfill, wasteTypes: ["ORGANIC"] as string[], idUsera: token.id};
        }
        else{
          // @ts-ignore
          this.state = {listOfLandfields: [] as Landfill[], extraPrivilege: false, creatingLocation: false, lokacija: {} as Landfill, wasteTypes: ["ORGANIC"] as string[], idUsera: token.id};
        }
      }
    }
  }

  private saveNotUpdating = true;

  private wasteTypes = ["ORGANIC", "PLASTIC", "METAL", "GLASS", "PAPER", "LIGHT_BULBS", "BATTERIES", "CLOTHES", "E_WASTE"];

  private city_error = false;
  private street_error = false;
  private number_error = false;
  private type_error = false;

  private forSaving = {
    address: {
      city:	"",
      id: null,
      number:	0,
      street:	""
    } as Locations,
    wasteTypes: ["ORGANIC"],
    workingHoursStart: "00:00:00",
    workingHoursEnd: "00:00:00",
    id: null
  } as Landfill;

  componentWillMount() {
    if(!this.state.extraPrivilege && this.state.idUsera>-1){
      giveLandFillsOnId(this.state.idUsera)
          .then((res: any) => {
            if (res.status === 200) {
              console.log(res);
              if (res.data && res.data.length>0){
                this.setState({listOfLandfields: res.data});
              }
              else {
                giveLandFills()
                    .then((res: any) => {
                      if (res.status === 200) {
                        console.log(res.data);
                        this.setState({listOfLandfields: res.data});
                      } else {
                        console.log("nije status 200, a nije error");
                      }
                    })
                    .catch((error: any) => {
                      console.log(error)
                    });
              }
            }
          })
          .catch((error: any) => {
            console.log(error);
          })
    }
    else {
      giveLandFills()
          .then((res: any) => {
            if (res.status === 200) {
              console.log(res.data);
              this.setState({listOfLandfields: res.data});
            } else {
              console.log("nije status 200, a nije error");
            }
          })
          .catch((error: any) => {
            console.log(error)
          });
    }
  }

  render(){

    // za prikaz informacija kada se klikne na tu ikonu

    const showDetailsOfLocation = (land: Landfill) => {
      this.setState({lokacija: land});
    }

    const showModalForCreatingLocation = () => {
      this.setState({wasteTypes: this.forSaving.wasteTypes, creatingLocation: true});
    }

    const hideModalForCreatingLocation = (listOfLocations: Landfill[]) => {
      this.forSaving = {
        address: {
          city:	"",
          id: null,
          number:	0,
          street:	""
        } as Locations,
        wasteTypes: ["ORGANIC"],
        workingHoursStart: "00:00:00",
        workingHoursEnd: "00:00:00",
        id: null
      } as Landfill;
      console.log(this.forSaving);
      console.log(this.state.lokacija);
      this.saveNotUpdating = true;
      if(this.state.lokacija && this.state.lokacija.id){
        const lokacija = cloneDeep(listOfLocations.find(loc => loc.id === this.state.lokacija.id));
        this.setState({creatingLocation: false, listOfLandfields: listOfLocations, lokacija: lokacija});
      }
      else{
        this.setState({creatingLocation: false, listOfLandfields: listOfLocations});
      }
    }

    const dodajIzatvori = () => {
      const saNovimIStarim = [...this.state.listOfLandfields, this.forSaving as Landfill];
      hideModalForCreatingLocation(saNovimIStarim);
    }

    const updatajIzatvori = () => {
      const filtriraniLandfildovi = this.state.listOfLandfields.filter(landField => landField.id !== this.forSaving.id);
      const saIzmjenjenim = [...filtriraniLandfildovi,this.forSaving];
      hideModalForCreatingLocation(saIzmjenjenim);
    }

    const sajvaj = () => {
      console.log("sajvaj");
      this.forSaving.wasteTypes=this.state.wasteTypes;
      //if(this.forSaving.address.city && this.forSaving.address.street && this.forSaving.address.number && this.forSaving.wasteTypes.length > 0) {
        if (this.saveNotUpdating) {
          console.log(this.forSaving);
          saveLandFill(this.forSaving)
              .then((res: any) => {
                if (res.status === 201) {
                  dodajIzatvori();
                } else {

                }
              })
              .then((error: any) => {
                console.log(error);
              })
        } else {
          if (this.forSaving.id) {
            updateLandFill(this.forSaving)
                .then((res: any) => {
                  if (res.status === 200) {
                    updatajIzatvori();
                  } else {
                    console.log("ne uspjelo updatanje")
                  }
                })
                .then((error: any) => {
                  console.log(error);
                })
          }
        }
      //}
      /*else {
        if(this.forSaving.address.city) {
          this.city_error = true;
        }
        if(this.forSaving.address.street) {
          this.street_error = true;
        }
        if(this.forSaving.address.number) {
          this.number_error = true;
        }
        if(this.forSaving.wasteTypes.length===0){
          this.type_error = true;
        }
        this.setState({});
      }

       */
    }

    const izbrisi = () => {
      if(this.state.lokacija.id) {
        deleteLandFilled(this.state.lokacija.id)
            .then((res: any) => {
              if (res.status === 200) {
                this.setState({listOfLandfields: this.state.listOfLandfields.filter((landField: Landfill) => landField.id !== this.forSaving.id), lokacija: {} as Landfill})
                console.log("uspilo je")
              } else {
                console.log("neuspješno")
              }
            })
            .catch((e) => {
              console.log(e);
            })
      }
    }

    const uredi = () => {
        console.log("ne gleda me");
        this.saveNotUpdating = false;
        this.forSaving = cloneDeep(this.state.lokacija);
        showModalForCreatingLocation();
    }

    const addToList = (vrstaOtpada: string) => {
      if(this.state.wasteTypes && this.state.wasteTypes.find(was => was===vrstaOtpada)){
        this.forSaving.wasteTypes = this.state.wasteTypes.filter(was => was!==vrstaOtpada);
        this.setState({wasteTypes: this.state.wasteTypes.filter(was => was!==vrstaOtpada)});
      }
      else{
        const tipovi = [...this.state.wasteTypes,vrstaOtpada];
        console.log(tipovi);
        this.forSaving.wasteTypes = tipovi;
        this.setState({wasteTypes: tipovi});
      }
    }

    const getTimestring = (time: string) => {
      const times = time.toString().split(':');
      return times[0]+":"+times[1];
    }

    const retValue = (str: string) => {
      return str? str: undefined;
    }

    const checkWaste = (waste: string) => {
      return this.forSaving.wasteTypes.some(w => w === waste);
    }


    return(
        <Grid areas={["a a b"]} style={{marginTop: "20px"}} columns={3}>
          <Cell area={"a"}>
            <div style={{width: "1200px"}}>
              <Karta landfills={this.state.listOfLandfields} showlandfill={showDetailsOfLocation}/>
            </div>
          </Cell>
          <Cell area={"b"}>
          {this.state.extraPrivilege?
          <div>
            <Button style={{marginBottom: "40px"}} onClick={showModalForCreatingLocation}>{this.saveNotUpdating? "Dodaj lokaciju" : "Uredi lokaciju"}</Button>
            <Modal show={this.state.creatingLocation} onHide={() => hideModalForCreatingLocation(this.state.listOfLandfields)} animation={false}>
              <Modal.Header closeButton>
                <Modal.Title>Dodaj lokaciju</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form>

                  <Form.Group controlId="grad">
                    <Form.Label>Grad</Form.Label>
                    <Form.Control placeholder="Grad" onChange={(e: any) => {this.forSaving.address.city=e.target.value;this.setState({})}} value={this.forSaving.address.city}/>
                  </Form.Group>

                  <Form.Row>
                    <Form.Group as={Col} controlId="Ulica">
                      <Form.Label>Ulica</Form.Label>
                      <Form.Control placeholder="Ulica" onChange={(e: any) => {this.forSaving.address.street=e.target.value;this.setState({})}} value={this.forSaving.address.street}/>
                    </Form.Group>

                    <Form.Group as={Col} controlId="broj">
                      <Form.Label>broj</Form.Label>
                      <Form.Control type="number" placeholder="broj" value={this.forSaving.address.number? this.forSaving.address.number.toString(): ""} onChange={(e: any) => {if(e.target.value){this.forSaving.address.number=e.target.value;this.setState({})}}}/>
                    </Form.Group>
                  </Form.Row>

                  <div key={`inline-checkbox`} className="mb-3">
                    <Form.Check inline label="ORGANIC" type='checkbox' id={`inline-checkbox-1`} checked={checkWaste("ORGANIC")} onChange={() => addToList("ORGANIC")}/>
                    <Form.Check inline label="PLASTIC" type='checkbox' id={`inline-checkbox-2`} checked={checkWaste("PLASTIC")} onChange={() => addToList("PLASTIC")}/>
                    <Form.Check inline label="METAL" type='checkbox' id={`inline-checkbox-3`} checked={checkWaste("METAL")} onChange={() => addToList("METAL")}/>
                    <Form.Check inline label="GLASS" type='checkbox' id={`inline-checkbox-4`} checked={checkWaste("GLASS")} onChange={() => addToList("GLASS")}/>
                    <Form.Check inline label="E_WASTE" type='checkbox' id={`inline-checkbox-9`} checked={checkWaste("E_WASTE")} onChange={() => addToList("E_WASTE")}/>
                  </div>
                  <div key={`inline-checkbox`} className="mb-3">
                    <Form.Check inline label="PAPER" type='checkbox' id={`inline-checkbox-5`} checked={checkWaste("PAPER")} onChange={() => addToList("PAPER")}/>
                    <Form.Check inline label="LIGHT_BULBS" type='checkbox' id={`inline-checkbox-6`} checked={checkWaste("LIGHT_BULBS")} onChange={() => addToList("LIGHT_BULBS")}/>
                    <Form.Check inline label="BATTERIES" type='checkbox' id={`inline-checkbox-7`} checked={checkWaste("BATTERIES")} onChange={() => addToList("BATTERIES")}/>
                    <Form.Check inline label="CLOTHES" type='checkbox' id={`inline-checkbox-8`} checked={checkWaste("CLOTHES")} onChange={() => addToList("CLOTHES")}/>
                  </div>


                  <Form.Group controlId="Pocvrijeme">
                    <Form.Label>Pocetno Vrijeme</Form.Label>
                    <FormControl value={this.forSaving.workingHoursStart?this.forSaving.workingHoursStart.slice(0,-3):null} onChange={(e: any) => {this.forSaving.workingHoursStart=e.target.value+":00";this.setState({})}}/>
                  </Form.Group>

                  <Form.Group controlId="Zavvrijeme">
                    <Form.Label>Završno Vrijeme</Form.Label>
                    <FormControl value={this.forSaving.workingHoursEnd?this.forSaving.workingHoursEnd.slice(0,-3):null} onChange={(e: any) => {this.forSaving.workingHoursEnd=e.target.value+":00";this.setState({})}}/>
                  </Form.Group>
                </Form>

              </Modal.Body>

              <Modal.Footer>
                <Button variant="secondary" onClick={() => hideModalForCreatingLocation(this.state.listOfLandfields)}>
                  Close
                </Button>
                <Button variant="primary" onClick={sajvaj}>
                  Save Changes
                </Button>
              </Modal.Footer>

            </Modal>
          </div>: null}
          {this.state.lokacija && this.state.lokacija.address?
          <Card bg="light" style={{ width: '18rem' }}>
            <Card.Header>Info o lokaciji</Card.Header>
            <Card.Body>
              <Card.Title>{this.state.lokacija.address.city} {this.state.lokacija.address.street} {this.state.lokacija.address.number}</Card.Title>
              <Card.Text>
                {console.log(this.state.lokacija.workingHoursStart)}
                <div>
                Na odlagalištu se odlaže {this.state.lokacija.wasteTypes.join(', ')+' '}
                </div>
                <div>
                 Radi od {getTimestring(this.state.lokacija.workingHoursStart)} do {getTimestring(this.state.lokacija.workingHoursEnd)}
                </div>
              </Card.Text>
              {this.state.extraPrivilege?
                <div>
                  <Button style={{marginRight: "30px", marginLeft: "30px"}} onClick={() => izbrisi()}>
                      izbrisi
                  </Button>
                  <Button onClick={() => uredi()}>
                    uredi
                  </Button>
                </div>:null
              }
            </Card.Body>
          </Card> : null}
          </Cell>
        </Grid>
    );
  }
}
