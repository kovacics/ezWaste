import React, { Component } from "react";
import InputGroup from "react-bootstrap/InputGroup";
import { Alert, Button, Card, Form, FormControl, Table } from "react-bootstrap";
import jwt from "jwt-decode";
import {POCETNA_ADRESA} from "../../store/BaseUrl";

import {
  addBulkyRequest,
  deleteBulkyRequest,
  getBulkyRequestFormsByUserID
} from "../../store/BulkyWastePageService";
import "../../pages/design/complaint.css";
import {getComplaintByID} from "../../store/ComplaintPageService";
import Axios from "axios";

export interface EmployeeResponse {
  id: number;
  content: string;
}

export interface BulkyRequest {
  id: string | number | undefined;
  formType: string;
  userID: string | number | undefined;
  description: string;
  employeeResponse: EmployeeResponse;
}

export default class Otpad extends Component {
  state = {
    render: true,
    id: "",
    description: "",
    employeeResponse: {} as EmployeeResponse,
    initTable: false,
    nijeIzbrisan: true
  };

  private bulkyRequests = [] as BulkyRequest[];
  private firstName = "";
  private lastName = "";
  private city: string;
  private number: number;
  private street: string;
  private userID = 0;
  private initUser = false;
  private noviZahtjev = false;
  private svaPoljaIspunjena = true;
  private uspjesnoSlanje = true;
  private limitZahtjeva = true;
  private brojZahtjeva;
  private napravljenBarJedan;
  private uspjesnoBrisanje = true;
  private pokazujOdgovor = false;
  private pokazujDetalje = false;
  private responseTitle = "Zahtjev za odvozom glomaznog otpada";
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
    if (this.brojZahtjeva < 1) {
      this.setState({ description: "" });
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
        title: one.title,
        description: one.description,
        formType: one.formType,
        employeeResponse: one.employeeResponse,
        userID: one.userID
      } as BulkyRequest;
    });
  };

  private odgovor = (
    description: any,
    complaintID: any,
    title: any
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
          this.responseTitle = title;
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
      formType: "BULKY_WASTE_COLLECTION",
      userID: this.userID
    };

    if (!this.state.description) {
      this.svaPoljaIspunjena = false;
      console.log(this.svaPoljaIspunjena)
      setTimeout(() => {
        this.svaPoljaIspunjena = true; this.setState({render: false})
      }, 3000);
    } else {
      this.svaPoljaIspunjena = true;
    }

    this.dodaj(newRequest);
  };

  private dodaj = (bulkyRequest: any) => {
    if (this.svaPoljaIspunjena) {
      addBulkyRequest(bulkyRequest)
        .then(res => {
          if (res === true) {
            this.bulkyRequests = [...this.bulkyRequests, bulkyRequest];
            this.uspjesnoSlanje = false;
            this.noviZahtjev = false;
            this.brojZahtjeva++;
            this.setState({ initTable: false });
            setTimeout(() => {
              this.uspjesnoSlanje = true; this.setState({render: false})
            }, 4000);
          }
        })
        .catch(error => {
          console.log(error);
        });
    }
    else {
      this.setState({render: false});
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
    getBulkyRequestFormsByUserID(this.userID)
      .then(res => {
        if (res.status === 200) {
          const formatedRequest = this.formating(res.data);
          this.bulkyRequests = formatedRequest.filter(request => request.id);
          this.brojZahtjeva = this.bulkyRequests.length;
          if (!this.state.initTable){
            this.setState({ initTable: true });;
          }
        } else {
          console.log("ne radi get prituzbi");
        }
      })
      .catch(error => {
        console.log(error);
      });

    const izbrisi = (id: any) => {
      const newBulkyRequests = this.bulkyRequests.filter(
        request => (request as BulkyRequest).id !== id
      );

      deleteBulkyRequest(id)
        .then(res => {
          if (res.status === 200) {
            this.uspjesnoBrisanje = false;
            this.pokazujOdgovor = false;
            this.pokazujDetalje = false;
            this.bulkyRequests = newBulkyRequests;
            this.brojZahtjeva--;
            this.setState({ initTable: false });
            setTimeout(() => {
              this.uspjesnoBrisanje = true; this.setState({ render: false });
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

    const mapToRowPending = (bulkyRequest: BulkyRequest) => {
      const isResponseNull = bulkyRequest.employeeResponse === null;
      return (
        <tr key={bulkyRequest.id}>
          <th>{bulkyRequest.id}</th>
          <th>
            <Button onClick={() => this.detalji(bulkyRequest.id)}>
              Detalji
            </Button>
          </th>
          {isResponseNull ? (
            <th>{"BEZ odgovora"}</th>
          ) : (
            <th>
              <Button
                onClick={() =>
                  this.odgovor(
                    bulkyRequest.description,
                    bulkyRequest.id,
                    this.responseTitle
                  )
                }
              >
                Odgovor
              </Button>
            </th>
          )}
          <th>
            <Button onClick = {() => this.preuzmiPDF(bulkyRequest.id)}>Preuzmi</Button>
          </th>
          <th>
            <Button
              variant="danger"
              onClick={() => {
                if (
                  window.confirm("Are you sure you wish to delete this item?")
                )
                  izbrisi(bulkyRequest.id);
              }}
            >
              Izbriši
            </Button>
          </th>
        </tr>
      );
    };

    const showPendingComplaints = () => {
      return this.bulkyRequests.map((request: BulkyRequest) => {
        return mapToRowPending(request);
      });
    };

    return (
      <div>
        <Form className="login100-form validate-form flex-sb flex-w">
          <span className={"login100-form-title"}>Odvoz glomaznog otpada</span>
        </Form>
        <div className="Centered">
          <Table
              striped
              bordered
              hover
              size={"sm"}
              >
            <thead>
            <tr>
              <th >ID</th>
              <th  >Detalji</th>
              <th >Status</th>
              <th >PDF</th>
              <th ><Button
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
              Napravljen maksimalan broj zahtjeva (1)
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
                          {this.responseTitle}
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
                        {this.responseDescription}
                      </Card.Text>
                  </Card.Body>
                  <Card.Footer>
                    Odgovor:
                    <br />
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
                  <Form.Group controlId="formTitle">
                    <InputGroup className="Label">
                      <InputGroup.Text id="basic-addon1">
                        Pritiskom na gumb stvara se zahtjev za odvoz glomaznog
                        otpada
                      </InputGroup.Text>
                    </InputGroup>
                  </Form.Group>
                </Form>
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
                          Zahtjev za odvozom glomaznog otpada
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
