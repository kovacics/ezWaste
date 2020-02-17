import React, { Component } from "react";
import InputGroup from "react-bootstrap/InputGroup";
import { Alert, Button, Card, Form, FormControl, Table } from "react-bootstrap";
import jwt from "jwt-decode";
import {
  addResRequest,
  deleteResRequest,
  getResRequestFormsByUserID
} from "../../store/ResourceRequestPageService";
import { getComplaintByID } from "../../store/ComplaintPageService";
import Axios from "axios";
import {POCETNA_ADRESA} from "../../store/BaseUrl";

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

export default class Resursi extends Component {
  state = {
    render: true,
    id: "",
    employeeResponse: {} as EmployeeResponse,
    title: "Zahtjev za dodatnim resursima",
    description: "",
    formType: "",
    resourceQuantity: 1,
    resourceType: "PLASTIC_BAG",
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
  private svaPoljaIspunjena = true;
  private uspjesnoSlanje = true;
  private uspjesnoBrisanje = true;
  private pokazujOdgovor = false;
  private pokazujDetalje = false;
  private brojZahtjeva;
  private limitZahtjeva = true;
  private noviZahtjev = false;
  private responseType = "";
  private responseQuantity = 0;
  private responseContent = "";
  private responseDescription = "";

  private preuzmiPDF = (complaintID: any) => {
    const token = JSON.parse(sessionStorage.getItem("userInfo")!);
    Axios(POCETNA_ADRESA + `/forms/pdf/`+complaintID, {
      method: "GET",
      responseType: "blob",
      headers: {'Authorization': "Bearer " + token}
    })
        .then(response => {
          const file = new Blob([response.data], {
            type: "application/pdf"
          });
          const fileURL = URL.createObjectURL(file);
          window.open(fileURL);
        })
        .catch(error => {
          this.pokazujDetalje = false;
          this.setState({ nijeIzbrisan: false });
          setTimeout(() => {
            this.setState({ nijeIzbrisan: true });
          }, 2000);
          console.log(error);
        });
  }

  private changeNewComponent = () => {
    if (this.brojZahtjeva < 5) {
      this.setState({ title: "" });
      this.setState({ description: "" });
      this.setState({ resourceType: "PLASTIC_BAG"});
      this.setState({ resourceQuantity: 1});
      this.pokazujOdgovor = false;
      this.pokazujDetalje = false;
      this.noviZahtjev = !this.noviZahtjev;
    } else {
      this.limitZahtjeva = false;
      this.setState({ initTable: false });
      setTimeout(() => {
        this.limitZahtjeva = true; this.setState({render: false})
      }, 2000);
    }
  };

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

  private odgovor = (
    complaintID: any,
    type: string,
    quantity: any,
    description: any
  ) => {
    getComplaintByID(complaintID)
      .then(res => {
        if (res.status === 200) {
          this.lastName = res.data.user.lastName;
          this.firstName = res.data.user.firstName;
          this.city = res.data.user.address.city;
          this.number = res.data.user.address.number;
          this.street = res.data.user.address.street;
          this.setState({ employeeResponse: res.data.employeeResponse });
          this.responseContent = res.data.employeeResponse.content;
          this.responseType=type;
          this.responseQuantity = quantity;
          this.responseDescription = description;
          this.noviZahtjev = false;
          this.pokazujOdgovor = true;
          this.pokazujDetalje = false;
          this.setState({ render: false });
        } else{
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

  private detalji = (complaintID: any) => {
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
          this.noviZahtjev = false;
          this.pokazujDetalje = true;
          this.pokazujOdgovor = false;
          this.setState({ render: false });
        } else{
          this.pokazujDetalje = false;
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
    const newRequest = {
      id: null,
      description: this.state.description,
      formType: "RESOURCE_REQUEST",
      userID: this.userID,
      resourceQuantity: this.state.resourceQuantity,
      resourceType: this.state.resourceType
    };
    if (!this.state.description) {
      this.svaPoljaIspunjena = false;
      setTimeout(() => {
        this.svaPoljaIspunjena = true; this.setState({render: false})
      }, 3000);
    } else {
      this.svaPoljaIspunjena = true;
    }

    this.dodaj(newRequest);
  };

  private dodaj = (request: any) => {
    if (this.svaPoljaIspunjena) {
      addResRequest(request)
        .then(res => {
          if (res === true) {
            this.requests = [...this.requests, request];
            this.uspjesnoSlanje = false;
            this.noviZahtjev = false;
            this.brojZahtjeva++;
            this.setState({ initTable: false });
            setTimeout(() => {
              this.uspjesnoSlanje = true; this.setState({render: false})
            }, 1500);
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
          this.userID = currentID;
          this.initUser = true;
        } else {
          console.log("token nije string");
        }
      } else {
        console.log("ne postoji item");
      }
    }
    getResRequestFormsByUserID(this.userID)
      .then(res => {
        if (res.status === 200) {
          const formatedRequest = this.formating(res.data);
          this.requests = formatedRequest.filter(request => request.id);
          this.brojZahtjeva = this.requests.length;
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
      deleteResRequest(id)
        .then(res => {
          if (res.status === 200) {
            this.uspjesnoBrisanje = false;
            this.pokazujOdgovor = false;
            this.pokazujDetalje = false;
            this.requests = newRequests;
            this.brojZahtjeva--;
            this.setState({ initTable: false });
            setTimeout(() => {
              this.uspjesnoBrisanje = true; this.setState({render: false})
            }, 1000);
          } else{
            this.pokazujDetalje = false;
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
      const isResponseNull = request.employeeResponse === null;
      return (
        <tr key={request.id}>
          <th>{request.id}</th>
          <th>
            {request.resourceType === "PLASTIC_BAG" ? "VREĆICA" : "KANTA"}
          </th>
          <th>
            <Button onClick={() => this.detalji(request.id)}>Detalji</Button>
          </th>
          {isResponseNull ? (
            <th>{"BEZ odgovora"}</th>
          ) : (
            <th>
              <Button
                onClick={() =>
                  this.odgovor(
                    request.id,
                    request.resourceType,
                    request.resourceQuantity,
                    request.description
                  )
                }
              >
                Odgovor
              </Button>
            </th>
          )}
          <th>
            <Button onClick = {() => this.preuzmiPDF(request.id)}>Preuzmi</Button>
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
      <div>
        <Form className="login100-form validate-form flex-sb flex-w">
          <span className={"login100-form-title"}>
            Zahtjevi za dodatnim resursima
          </span>
        </Form>
        <div className="Centered">
          <Table striped bordered hover size={"sm"}>
            <thead>
            <tr>
              <th>id</th>
              <th>Vrsta resursa</th>
              <th>Detalji</th>
              <th>Status</th>
              <th>PDF</th>
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

        {!this.noviZahtjev ? (
          <div className={"newComplaintButton"}>
            <Button
              className={"sendButtonNew"}
              variant="success"
              onClick={() => {
                this.changeNewComponent();
              }}
            >
              Novi Zahtjev
            </Button>
          </div>
        ) : null}
        <div className={"newComplaintButton"}>
          {!this.limitZahtjeva ? (
            <Alert variant={"warning"}>
              Napravljen maksimalan broj zahtjeva (5)
            </Alert>
          ) : null}
          {!this.uspjesnoBrisanje ? (
            <Alert variant={"success"}>Uspješno brisanje zahtjeva!</Alert>
          ) : null}
          {!this.uspjesnoSlanje ? (
            <Alert variant={"success"}>Uspješno slanje zahtjeva!</Alert>
          ) : null}
          {!this.state.nijeIzbrisan ? (
              <Alert variant={"danger"}>Greška prilikom dohvaćanja zahtjeva!</Alert>
          ) : null}
        </div>

        {this.pokazujOdgovor ? (
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
                      <br />
                      <br />
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
                  <Card.Footer>
                    <Card.Text>{this.responseContent}</Card.Text>
                  </Card.Footer>
                </Card>
              </div>
            </div>
          </div>
        ) : this.noviZahtjev ? (
          <div className="limiter">
            <div className="container-login100">
              <div className="wrap-login100 p-l-85 p-r-85 p-t-55 p-b-55">
                <Form className="login100-form validate-form flex-sb flex-w">
                  <span className={"login100-form-title"}>Novi zahtjev</span>
                </Form>

                <InputGroup className="ResourceSelect">
                  <InputGroup.Prepend>
                    <InputGroup.Text
                      className={"selectLabel"}
                      id="basic-addon1"
                    >
                      Odaberite tip resursa
                    </InputGroup.Text>
                  </InputGroup.Prepend>
                  <InputGroup.Append>
                    <select
                      onChange={this.onChange}
                      name="resourceType"
                      className={"formControl"}
                    >
                      <option value={"PLASTIC_BAG"}>Vrećica</option>
                      <option value={"TRASH_CAN"}>Kanta</option>
                    </select>
                  </InputGroup.Append>
                </InputGroup>

                <InputGroup className="ResourceSelect">
                  <InputGroup.Prepend>
                    <InputGroup.Text
                      className={"selectLabel"}
                      id="basic-addon1"
                    >
                      Odaberite količinu
                    </InputGroup.Text>
                  </InputGroup.Prepend>
                  <InputGroup.Append>
                    <select
                      onChange={this.onChange}
                      name={"resourceQuantity"}
                      className={"formControl"}
                      id="sel1"
                    >
                      <option value={"1"}>1</option>
                      <option value={"2"}>2</option>
                      <option value={"3"}>3</option>
                      <option value={"4"}>4</option>
                      <option value={"5"}>5</option>
                    </select>
                  </InputGroup.Append>
                </InputGroup>

                <InputGroup className="ComplaintText">
                  <FormControl
                    as="textarea"
                    rows="5"
                    placeholder={"Razlog podnošenja zahtjeva"}
                    aria-label="ComplaintTextArea"
                    maxLength="512"
                    name="description"
                    value={this.state.description}
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
                      this.changeNewComponent();
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
        ) : null}
        {this.pokazujDetalje ? (
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
                      <br />
                      <br />
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
              </div>
            </div>
          </div>
        ) : null}
      </div>
    );
  }
}
