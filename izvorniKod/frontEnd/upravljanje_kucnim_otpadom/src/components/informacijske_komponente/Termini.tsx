import React from "react";
import {
  getScheduleForLocation, addScheduleForLocation, deleteSchedule, getAllSchedules, getUserSchedule, updateSchedule
} from "../../store/terminiService";
import "../../pages/design/termini.css";
import jwt from "jwt-decode";
import {Alert, Button, FormControl, InputGroup, Table} from "react-bootstrap";
export interface Schedule{
  adresses: [{
    city: string;
    street: string;
  }],
  id: number |null,
  time: string
}

export default class Termini extends React.Component {
  state = {
    city : "",
    streets : [],
    ulice : "",
    time : "",
    render : true,
    extraPrivilege: false
  }

  private noviTermin = false;
  private dohvatiTermin = false;
  private uspjesno = false;
  private svaPoljaIspunjena= true;
  private schedule = [] as Schedule[];
  private prikazi = false;
  private prikazSvih = true;
  private initUser = false;
  private userID = 0;
  private prikazUser = true;
  private ulice = ["Unesite ulice"];
  private ulica = "";
  private ul = [];
  private refresh = true;
  private upd = false;
  private termin = {} as Schedule;
  private upGrad = "";
  private upUlice = "";
  private upTime = "";
  private uspjesno2 = false;
  constructor(props: any){
    super(props);
    const item = sessionStorage.getItem("userInfo");
    if(item) {
      const token = jwt(item!);
      if (token) {
        // @ts-ignore
        const role = token.role;
        if(role==="ADMIN" || role==="EMPLOYEE") {
          this.state = {city: "", streets : [], ulice : "", time : "", render : true, extraPrivilege: true};
        }
      }
    }
  }

  formating = (data: any[]) => {
    return data.map((pod) => {
      return {adresses: pod.addresses, id: pod.id, time: pod.time} as Schedule;
    })
  }
  private addShiftSchedule = () => {
    this.noviTermin = !this.noviTermin;
    this.ulice = [];
    this.setState({render:false, city:"", streets : [], time : "", ulice : ""})
  }
  private getShiftSchedule= () => {
    this.dohvatiTermin = true;
    this.prikazSvih = false
    this.setState({render:false, city:"", streets : [], ulice : ""})
  }
  private addSchedule = ()=>{
      this.ul = [];
      {this.ulice.map((value, index) => {
          this.ul.push({city : this.state.city, street : value})
      })}
      const newSchedule = {
          adresses : this.ul,
          time: this.state.time
      }
      this.dodaj(newSchedule);
      this.setState({city: ''});
      this.setState({streets : []});
      this.setState({time: ''});
  }
  private dodaj = (schedule: any) => {
      addScheduleForLocation(schedule).then((res) => {
        if (res === true) {
          this.uspjesno = true
          this.setState({render: false})
          setTimeout(() => {
            this.uspjesno = false;
            this.setState({render: false})
          }, 1500);
          this.noviTermin = !this.noviTermin;
          this.prikazSvih = true;
        }
      })
          .catch((error) => {
            console.log(error);
          });
  }
  private izbrisi = (id: any) => {
    const newSch = this.schedule.filter(
        sch => (sch as Schedule).id !== id
    );
    deleteSchedule(id)
        .then((res) => {
              if(res.status === 200){
                this.schedule = newSch;
                this.setState({render:false});
              }
              else{
                console.log("nije se obrisao termin");
              }
            }

        ).catch((error) => {
      console.log(error);
    })
  }
    private shiftAzuriraj = (schedule : Schedule) => {
        this.upd = true;
        this.termin = schedule;
        this.upGrad = schedule.adresses[0].city;
        this.upTime = schedule.time;
        this.upUlice = schedule.adresses.reduce((result, item) => {
                const vel = schedule.adresses.length
                if (schedule.adresses[vel-1].street === item.street) {
                    return `${result}${item.street}`
                }else{
                    return `${result}${item.street},`
                }
            }, "")
        this.dohvatiTermin = false;
        this.prikazSvih = true;
        this.setState({render:false, city : this.upGrad, time : this.upTime, ulice : this.upUlice})
    }
    private updSch = (id : any, update: Schedule) => {
        updateSchedule(id, update).then((res) => {
            if (res === true) {
                this.setState({render: false})
            }
        })
            .catch((error) => {
                console.log(error);
            });
    }
    private azuriraj = () => {
        const adr = this.state.ulice.split(",");
        this.ul = []
        {adr.map((value, index) => {
            this.ul.push({city : this.state.city, street : value})
        })}
        const update = {
            adresses : this.ul,
            time: this.state.time
        } as Schedule

        this.updSch(this.termin.id,update)
        this.uspjesno2 = true;
        this.prikazSvih = true
        setTimeout(() => {
            this.uspjesno2 = false;
            this.prikazSvih = true
            this.dohvatiTermin = false
            this.upd = false
            this.prikazi = false
            this.setState({render: false})
        }, 1500);
        this.setState({render: false})
        this.prikazSvih = true
        this.dohvatiTermin = false
        this.upd = false
        this.prikazi = false
        this.setState({render: false})
    }
  private scheduleToTable = (schedule:Schedule) =>{
    return <tr key = {schedule.id}>
      <th>{schedule.id}</th>
      <th>{schedule.adresses.map((value,index) =>
                <div key ={index}>{value.street}</div>
            )}
      </th>
      <th>{schedule.adresses[0].city}</th>
      <th>{schedule.time}</th>
      <th>{this.state.extraPrivilege? <Button type="submit" onClick={() =>{this.izbrisi(schedule.id)}}>Izbriši</Button> : null}</th>
      <th>{this.state.extraPrivilege? <Button type="submit" variant = "info" onClick={() =>{this.shiftAzuriraj(schedule)}}>Ažuriraj</Button> : null}</th>
    </tr>
  }
  private getSchedule = (city: any ,street: any)=>{
    getScheduleForLocation(city,street).then((res) => {
      if (res.status === 200) {
        this.schedule = this.formating(res.data)
        this.prikazi = true
        this.setState({render:false})
      }
    })
      this.ulica = ""
      this.prikazSvih = false
    this.setState({render:false, city : ""})
  }
  private dohvatiSveTermine = () =>{
      getAllSchedules().then((res) =>{
          if(res.status ===200){
              this.schedule = this.formating(res.data)
              this.setState({render : false})
          }
      })
  }
  private scheduleUser = (id : any) =>{
      getUserSchedule(id).then((res) =>{
          if(res.status ===200){
              this.schedule = this.formating(res.data)
              this.setState({render : false})
          }
      })
  }
  private natrag = () => {
    this.dohvatiTermin = !this.dohvatiTermin;
    this.prikazi = false;
    this.prikazSvih = true;
    this.prikazUser = true;
    this.ulica = ""
    this.setState({render:false})
  }
  private natrag2 = () => {
    this.noviTermin = !this.noviTermin;
    this.prikazSvih = true;
    this.prikazUser = true;
    this.ulice = []
    this.setState({render:false, city : "", street : [], time : ""})
  }

  private addStreet = (ulica : any) =>{
      this.ulice.push(ulica);
      this.ulica = "";
      this.refresh = true;
      this.setState({render:false});
  }
  private natrag3 = () =>{
      this.upd = false;
      this.termin = {} as Schedule;
      this.prikazSvih = true;
      this.setState({render:false});
  }


  onChange = (e: any) => {
      this.refresh = true
      this.setState({[e.target.name]: e.target.value});
  }
  onChange2  = (e: any) =>{
      this.ulica = e.target.value
      this.refresh = true
      this.setState({render : false})
  }
  onChange3 = (e:any) =>{
      this.upGrad = e.target.value
      this.setState({[e.target.name]: e.target.value});
  }
    onChange4 = (e:any) =>{
        this.upTime = e.target.value
        this.setState({[e.target.name]: e.target.value});
    }
    onChange5 = (e:any) =>{
        this.upUlice = e.target.value
        this.setState({[e.target.name]: e.target.value});
    }

  render() {
      if (!this.initUser) {
          const item = sessionStorage.getItem("userInfo");
          if (item) {
              const token = jwt(item!);
              if (token) {
                  // @ts-ignore
                  const currentID = token.id;
                  this.userID = currentID;
                  this.initUser = true;
              } else {
                  console.log("token nije string");
              }
          } else {
              console.log("ne postoji item");
          }
      }
      if (this.prikazUser && !this.state.extraPrivilege){
          {this.scheduleUser(this.userID)}
          this.prikazUser = false
      }
    if (this.prikazSvih && this.state.extraPrivilege){
        {this.dohvatiSveTermine()}
        this.prikazSvih = false
    }
    const showSchedule = () => {
      return this.schedule.map((schedule: Schedule) => {
        return this.scheduleToTable(schedule)
      })
    }
    return (
        <div className={"cent" }>
            {this.noviTermin? <label> <h1>Dodavanje termina</h1></label>: null}
            {this.dohvatiTermin? <label> <h1>Pretraživanje termina po lokaciji</h1></label>: null}
            {this.noviTermin || this.dohvatiTermin?
                <InputGroup className="mb-3" >
                    <InputGroup.Prepend >
                        <InputGroup.Text id="city">Grad</InputGroup.Text>
                    </InputGroup.Prepend>
                    <FormControl
                        aria-label="Default"
                        className="col-4"
                        aria-describedby="inputGroup-sizing-default"
                        name = "city"
                        value = {this.state.city}
                        onChange={this.onChange}
                    />
                </InputGroup>
                :null}
          {this.noviTermin && this.state.extraPrivilege?
              <InputGroup className="mb-3">
                <InputGroup.Prepend>
                  <InputGroup.Text id="time">Termin</InputGroup.Text>
                </InputGroup.Prepend >
                <FormControl
                    aria-label="Default"
                    className="col-4"
                    aria-describedby="inputGroup-sizing-default"
                    placeholder="yyyy-MM-dd HH:mm"
                    name = "time"
                    value = {this.state.time}
                    onChange={this.onChange}
                />
              </InputGroup>: null
          }
          {this.noviTermin?
            <Table striped bordered hover className="col-4">
                <thead>
                <tr>
                    <th>Popis ulica</th>
                </tr>
                </thead>

                {this.refresh?<tbody>
                            {this.ulice.map((value, index) => {
                                return (<tr key={index}>
                                    <th key={index}>{value}</th>
                                </tr>)
                        })}
                        {this.refresh = false}
                </tbody>: null}

            </Table> : null}
            {this.noviTermin || this.dohvatiTermin?
                <InputGroup className="mb-3">
                    <InputGroup.Prepend >
                        <InputGroup.Text id="street" >Ulica</InputGroup.Text>
                    </InputGroup.Prepend>
                    <FormControl
                        aria-label="Default"
                        className="col-3"
                        aria-describedby="inputGroup-sizing-default"
                        name = "street"
                        value = {this.ulica}
                        onChange = {this.onChange2}
                    />
                </InputGroup>: null
            }
            {this.noviTermin?
                <Button variant="primary" type="submit" onClick={() =>{this.addStreet(this.ulica)}}>
                    Dodaj ulicu
                </Button>
                : null
            }
            <br/>

          {!this.noviTermin && !this.dohvatiTermin && this.state.extraPrivilege && !this.upd?
            <div>
              <label><h1>Termini odvoza</h1></label>
            </div>
            :null}
          {!this.noviTermin && !this.dohvatiTermin && !this.state.extraPrivilege && !this.upd?
              <div>
                <label><h1>Moji termini odvoza</h1></label>
              </div>
              :null}
            {!this.noviTermin && !this.dohvatiTermin && this.state.extraPrivilege && !this.upd?
                <div>
                    {!this.prikazi?
                        <Table className="col-5">
                            <thead>
                            <tr>
                                <th>ID</th>
                                <th>Ulica</th>
                                <th>Grad</th>
                                <th>Termin</th>
                                <th>{this.state.extraPrivilege?"Brisanje":null}</th>
                                <th>{this.state.extraPrivilege?"Uređivanje":null}</th>
                            </tr>
                            </thead>
                            <tbody>
                            {showSchedule()}
                            </tbody>
                        </Table> : null}
                </div> : null }
            {!this.noviTermin && !this.dohvatiTermin && !this.state.extraPrivilege && !this.upd?
                <div>
                    {!this.prikazi?
                        <Table className="col-4">
                            <thead>
                            <tr>
                                <th>ID</th>
                                <th>Ulica</th>
                                <th>Grad</th>
                                <th>Termin</th>
                            </tr>
                            </thead>
                            <tbody>
                            {showSchedule()}
                            </tbody>
                        </Table> : null}
                </div> : null }
          {!this.noviTermin && !this.dohvatiTermin && !this.upd?
          <Button variant="secondary" type="submit" className={"drugi"} size="lg" onClick={() =>{this.getShiftSchedule()}}>
            Izlistaj po lokaciji
          </Button>
            :null}
          {' '}
          {!this.noviTermin && !this.dohvatiTermin && this.state.extraPrivilege && !this.upd?
          <Button variant="primary" type="submit" className={"drugi"} size="lg" onClick={() =>{this.addShiftSchedule()}}>
            Dodaj novi termin
          </Button>
              :null}
          {this.noviTermin && !this.dohvatiTermin&& this.state.extraPrivilege && !this.upd?
              <Button variant="primary" type="submit" className = "posTermin"onClick={() =>{this.addSchedule()}}>
                Postavi termin
              </Button>
              :null}
          {' '}
          {this.noviTermin && !this.dohvatiTermin&& this.state.extraPrivilege && !this.upd?
              <Button variant="warning" type="submit" className = "posTermin" onClick={() =>{this.natrag2()}}>
                Natrag
              </Button>
              :null}
          {this.dohvatiTermin && !this.noviTermin && !this.upd?
              <Button variant="secondary" type="submit" onClick={() =>{this.getSchedule(this.state.city, this.ulica)}}>
                Izlistaj
              </Button>
              :null}
          {' '}
          {this.dohvatiTermin && !this.noviTermin && !this.upd?
              <Button variant="warning" type="submit" onClick={() =>{this.natrag()}}>
                Natrag
              </Button>
              :null}
          <div>
            {this.prikazi && this.dohvatiTermin && !this.upd?
                <Table className="col-5">
                  <thead>
                  <tr>
                    <th>ID</th>
                    <th>Ulica</th>
                    <th>Grad</th>
                    <th>Termin</th>
                    <th>{this.state.extraPrivilege?"Brisanje":null}</th>
                      <th>{this.state.extraPrivilege?"Uređivanje":null}</th>
                  </tr>
                  </thead>
                  <tbody>
                  {showSchedule()}
                  </tbody>
                </Table> : null}
          </div>
            <div>{this.upd?
            <div>
                <label><h1>Ažuriranje termina</h1></label>
                <InputGroup className="mb-3">
                <InputGroup.Prepend >
                    <InputGroup.Text id="street" >Grad</InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl
                    aria-label="Default"
                    className="col-3"
                    aria-describedby="inputGroup-sizing-default"
                    name = "city"
                    value = {this.upGrad}
                    onChange = {this.onChange3}

                />
            </InputGroup>
                <InputGroup className="mb-3">
                    <InputGroup.Prepend >
                        <InputGroup.Text id="street" >Ulice</InputGroup.Text>
                    </InputGroup.Prepend>
                    <FormControl
                        aria-label="Default"
                        className="col-3"
                        aria-describedby="inputGroup-sizing-default"
                        name = "ulice"
                        value = {this.upUlice}
                        onChange = {this.onChange5}

                    />
                </InputGroup>
                <InputGroup className="mb-3">
                    <InputGroup.Prepend>
                        <InputGroup.Text id="time">Termin</InputGroup.Text>
                    </InputGroup.Prepend >
                    <FormControl
                        aria-label="Default"
                        className="col-4"
                        aria-describedby="inputGroup-sizing-default"
                        placeholder="yyyy-MM-dd HH:mm"
                        name = "time"
                        value = {this.upTime}
                        onChange = {this.onChange4}
                    />
                </InputGroup>
                <Button variant="primary" type = "submit" onClick={() =>{this.azuriraj()}}>Potvrdi</Button>
                {' '}
                <Button variant="warning" type = "submit" onClick={() =>{this.natrag3()}}>Odustani</Button>
                {this.uspjesno2?
                    <Alert variant={"success"}>
                        Uspješno azuriranje!
                    </Alert>:null
                }
            </div>
            :null}

            </div>
          {this.uspjesno?
              <Alert variant={"success"} className="col-4">
                Uspješno postavljanje termina!
              </Alert>:null
          }
          {!this.svaPoljaIspunjena?
              <Alert variant={"warning"}>
                Nisu ispunjena sva polja
              </Alert>:null
          }
        </div>
    );
  }
}
