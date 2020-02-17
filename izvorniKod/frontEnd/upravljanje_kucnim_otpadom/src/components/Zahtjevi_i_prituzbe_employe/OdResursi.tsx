import React, { Component } from "react";
import InputGroup from "react-bootstrap/InputGroup";
import { Alert, Button, Card, Form, FormControl, Table } from "react-bootstrap";
import jwt from "jwt-decode";
import {getPendingRequestForms} from "../../store/ResourceResponsePageService";
import {
    deleteComplaint, getComplaintByID, addResponse
} from "../../store/ComplaintPageService";


export interface EmployeeResponse {
  id: number;
  content: string;
}

export interface ResRequest {
  id: string | number | undefined;
  description: string;
  resourceType: string;
  resourceQuantity: number;
  formType: string;
  userID: string | number | undefined;
  employeeResponse: EmployeeResponse;
}

export default class OdResursi extends Component {
  state = {
    render: true,
    id: "",
    employeeResponse: {} as EmployeeResponse,
    content: "",
    initTable: false,
    nijeIzbrisan: true
  };

  private requests = [] as ResRequest[];
  private firstName = "";
  private lastName = "";
  private city: string;
  private number: number;
  private street: string;
  private userID = 0;
  private initUser = false;
  private authorID = 0;
  private formID = 0;
  private svaPoljaIspunjena = true;
  private uspjesnoSlanje = true;
  private uspjesnoBrisanje = true;
  private odgovaraj = false;
  private responseType = "";
  private responseQuantity = 0;
  private responseDescription = "";


  formating = (data: any[]) => {
    return data.map(one => {
      return {
        id: one.id,
        resourceType: one.resourceType,
        resourceQuantity: one.resourceQuantity,
        description: one.description,
        formType: one.formType,
        employeeResponse: one.employeeResponse,
        userID: one.userID
      } as ResRequest;
    });
  };


  private odgovor =(complaintID : any) =>{
      getComplaintByID(complaintID)
          .then(res => {
              if (res.status === 200) {
                  this.responseDescription = res.data.description;
                  this.lastName = res.data.user.lastName;
                  this.firstName = res.data.user.firstName;
                  this.city = res.data.user.address.city;
                  this.number = res.data.user.address.number;
                  this.street = res.data.user.address.street;
                  this.responseQuantity = res.data.resourceQuantity;
                  this.responseType = res.data.resourceType;
                  this.formID = complaintID;
                  this.odgovaraj=true;
                  this.setState({ render: false });
              }
              else{
                  this.odgovaraj = false;
                  this.setState({ nijeIzbrisan: false });
                  setTimeout(() => {
                      this.setState({ nijeIzbrisan: true });
                  }, 2000);
              }
          })
          .catch(error => {
              console.log(error);
          });
    };


  private callAction = (dispatch: any) => {
          const newResponse = {
              authorID: this.authorID,
              formID: this.formID,
              response: this.state.content
          };
          if (!(this.state.content)) {
              this.svaPoljaIspunjena = false;
              setTimeout(() => {
                  this.svaPoljaIspunjena = true; this.setState({ render: false });
              }, 3000);
          } else {
              this.svaPoljaIspunjena = true;
          }

          this.dodaj(newResponse);
      };

  private dodaj = (response: any) => {
          if (this.svaPoljaIspunjena) {
              addResponse(response)
                  .then(res => {
                      if (res === true) {
                          this.uspjesnoSlanje = false;
                          this.setState({ content: "" });
                          this.odgovaraj=false;
                          this.setState({ initTable: false });
                          setTimeout(() => {
                              this.uspjesnoSlanje = true; this.setState({ render: false });
                          }, 1500);
                      }
                      else{
                          this.odgovaraj = false;
                          this.setState({ content: "" });
                          this.setState({ nijeIzbrisan: false });
                          setTimeout(() => {
                              this.setState({ nijeIzbrisan: true });
                          }, 2000);
                      }
                  })
                  .catch(error => {
                      console.log(error);
                  });
          } else {
              this.requests = [...this.requests];
              this.setState({ ...this.state });
          }
      };

  private refreshTable = () => {
        this.setState({ initTable: false });
    };

  onChange = (e: any) => this.setState({ [e.target.name]: e.target.value });

  render() {

    if (!this.initUser) {
      const item = sessionStorage.getItem("userInfo");
      if (item) {
        const token = jwt(item!);
        if (token) {
          // @ts-ignore
          const currentID = token.id;
          this.authorID = currentID;
          this.initUser = true;
        } else {
          console.log("token nije string");
        }
      } else {
        console.log("ne postoji item");
      }
    }
    getPendingRequestForms()
        .then(res => {
          if (res.status === 200) {
            const formatedRequest = this.formating(res.data);
            this.requests = formatedRequest.filter(request => request.id);
              if (!this.state.initTable){
                  this.setState({ initTable: true });;
              }
          } else {
            console.log("ne radi get zahtjeva");
          }
        })
        .catch(error => {
          console.log(error);
        });

    const izbrisi = (id: any) => {
      const newRequests = this.requests.filter(
          request => (request as ResRequest).id !== id
      );
      deleteComplaint(id)
          .then(res => {
            if (res.status === 200) {
                this.uspjesnoBrisanje = false;
                this.odgovaraj = false;
                this.requests = newRequests;
                this.setState({initTable: false});
                setTimeout(() => {
                    this.uspjesnoBrisanje = true;
                    this.setState({render: false});
                }, 1000);
            }else{
                this.odgovaraj = false;
                this.setState({ nijeIzbrisan: false });
                setTimeout(() => {
                    this.setState({ nijeIzbrisan: true });
                }, 2000);
                }
          })
          .catch(error => {
            console.log(error);
          });
    };

    const mapToRowPending = (request: ResRequest) => {
      return (
          <tr key={request.id}>
            <th>{request.id}</th>
            <th>
              {request.resourceType === "PLASTIC_BAG" ? "VREĆICA" : "KANTA"}
            </th>
            <th>
              <Button onClick={() => this.odgovor(request.id)}>Odgovori</Button>
            </th>

            <th>
              <Button
                  variant="danger"
                  onClick={() => {
                    if (
                        window.confirm("Are you sure you wish to delete this item?")
                    )
                      izbrisi(request.id);
                  }}
              >
                Izbriši
              </Button>
            </th>
          </tr>
      );
    };

    const showPendingComplaints = () => {
      return this.requests.map((request: ResRequest) => {
        return mapToRowPending(request);
      });
    };

    return (
        <div className="PageLayout">
            <Form className="login100-form validate-form flex-sb flex-w">
              <span className={"login100-form-title"}>
                Odgovori na zahtjeve za dodatnim resursima
              </span>
            </Form>
            {this.odgovaraj ? (
                <div className="limiter">
                    <div className="container-login100">
                        <div className="wrap-login100 p-l-85 p-r-85 p-t-55 p-b-55">
                            <Card
                                className="login100-form validate-form flex-sb flex-w"
                                border="success"
                                bg={"light"}
                                text="dark"
                            >
                                <Card.Header>
                                    <InputGroup className="newComplaintButton">
                                        <Card.Title>
                        <span className={"login100-form-title"}>
                          Zahtjev za resursima
                        </span>
                                        </Card.Title>
                                    </InputGroup>
                                </Card.Header>
                                <Card.Body>
                                    <Card.Text className={"infoLabel"}>
                                        Korisnik: {this.firstName} {this.lastName}
                                        <br />
                                        Adresa: {this.street} {this.number}, {this.city}
                                        <br/>
                                        <br/>

                                            Vrsta resursa:{" "}
                                            {this.responseType === "PLASTIC_BAG"
                                                ? "VREĆICA"
                                                : "KANTA"}
                                            <br />
                                            Količina resursa: {this.responseQuantity}
                                            <br />
                                            {this.responseDescription}

                                    </Card.Text>
                                </Card.Body>
                            </Card>

                            <InputGroup className="ComplaintText">
                                <FormControl
                                    as="textarea"
                                    rows="5"
                                    placeholder={"Ovdje upišite vaš odgovor"}
                                    aria-label="ComplaintTextArea"
                                    maxLength="512"
                                    name="content"
                                    value={this.state.content}
                                    onChange={this.onChange}
                                />
                            </InputGroup>

                            <InputGroup className="ComplaintButton">
                                <Button
                                    className={"sendButton"}
                                    variant="success"
                                    onClick={this.callAction}
                                >
                                    Pošalji
                                </Button>
                                <Button
                                    className={"sendButton"}
                                    variant="danger"
                                    onClick={() => {
                                        this.odgovaraj=false;
                                        this.setState({ content: "" });
                                        this.firstName = "";
                                        this.lastName = "";
                                        this.city="";
                                        this.number=0;
                                        this.street="";
                                        this.responseDescription = "";
                                    }}
                                >
                                    Odustani
                                </Button>
                                {!this.svaPoljaIspunjena ? (
                                    <Alert variant={"warning"}>Nisu sva polja ispunjena</Alert>
                                ) : null}
                            </InputGroup>
                        </div>
                    </div>
                </div>
            ) :null}
            <div className={"newComplaintButton"}>

                {!this.uspjesnoBrisanje ? (
                    <Alert variant={"success"}>Uspješno brisanje zahtjeva!</Alert>
                ) : null}
                {!this.uspjesnoSlanje ? (
                    <Alert variant={"success"}>Uspješno slanje odgovora!</Alert>
                ) : null}
                {!this.state.nijeIzbrisan ? (
                    <Alert variant={"danger"}>Greška prilikom dohvaćanja zahtjeva!</Alert>
                ) : null}
            </div>
            <div className="Centered">
                <Table striped bordered hover size={"sm"}>
                    <thead>
                    <tr>
                        <th>id</th>
                        <th>Vrsta resursa</th>
                        <th>Odgovor</th>
                        <th><Button
                            className={"refreshButton"}
                            variant="warning"
                            onClick={() => {
                                this.refreshTable();
                            }}
                        >
                            Osvježi
                        </Button></th>
                    </tr>
                    </thead>
                    <tbody>{showPendingComplaints()}</tbody>
                </Table>
            </div>


        </div>
    );
  }
}
