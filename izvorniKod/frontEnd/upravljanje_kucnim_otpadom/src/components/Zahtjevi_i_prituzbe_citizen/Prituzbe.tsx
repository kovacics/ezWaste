import React, { Component } from "react";
import InputGroup from "react-bootstrap/InputGroup";
import { Alert, Button, Card, FormControl, Form, Table } from "react-bootstrap";
import jwt from "jwt-decode";
import {
  addComplaint,
  deleteComplaint,
  getComplaintByID,
  getComplaintFormsByUserID
} from "../../store/ComplaintPageService";
import "../../pages/design/complaint.css";
import Axios from "axios";
import {POCETNA_ADRESA} from "../../store/BaseUrl";

export interface EmployeeResponse {
  id: number;
  content: string;
}

export interface Complaints {
  id: string | number | undefined;
  title: string;
  description: string;
  formType: string;
  userID: string | number | undefined;
  employeeResponse: EmployeeResponse;
}

export default class Prituzbe extends Component {
  state = {
    render: true,
    id: "",
    employeeResponse: {} as EmployeeResponse,
    title: "",
    description: "",
    initTable: false,
    nijeIzbrisan: true
  };

  private firstName = "";
  private lastName = "";
  private city: string;
  private number: number;
  private street: string;
  private userID = 0;
  private initUser = false;
  private brojPrituzbi;
  private complaints = [] as Complaints[];
  private novaPrituzba = false;
  private svaPoljaIspunjena = true;
  private uspjesnoSlanje = true;
  private uspjesnoBrisanje = true;
  private pokazujOdgovor = false;
  private pokazujDetalje = false;
  private limitPrituzbi = true;
  private responseTitle = "";
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
          if(response.status===200){
            const file = new Blob([response.data], {
              type: "application/pdf"
            });
            const fileURL = URL.createObjectURL(file);
            window.open(fileURL);
          }
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
    if (this.brojPrituzbi < 5) {
      this.setState({ title: "" });
      this.setState({ description: "" });
      this.pokazujOdgovor = false;
      this.pokazujDetalje = false;
      this.novaPrituzba = !this.novaPrituzba;
    } else {
      this.limitPrituzbi = false;
      this.setState({ initTable: false });
      setTimeout(() => {
        this.limitPrituzbi = true; this.setState({render: false})
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
      } as Complaints;
    });
  };

  private odgovor = (
    complaintID: any,
    title: any,
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
          this.responseTitle = title;
          this.responseDescription = description;
          this.novaPrituzba = false;
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
          this.responseTitle = res.data.title;
          this.responseDescription = res.data.description;
          this.lastName = res.data.user.lastName;
          this.firstName = res.data.user.firstName;
          this.city = res.data.user.address.city;
          this.number = res.data.user.address.number;
          this.street = res.data.user.address.street;
          this.novaPrituzba = false;
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
    const newComplaint = {
      id: null,
      title: this.state.title,
      description: this.state.description,
      formType: "COMPLAINT",
      userID: this.userID
    };
    if (!(this.state.title && this.state.description)) {
      this.svaPoljaIspunjena = false;
      setTimeout(() => {
        this.svaPoljaIspunjena = true; this.setState({render: false})
      }, 3000);
    } else {
      this.svaPoljaIspunjena = true;
    }

    this.dodaj(newComplaint);
  };

  private dodaj = (complaint: any) => {
    if (this.svaPoljaIspunjena) {
      addComplaint(complaint)
        .then(res => {
          if (res === true) {
            this.complaints = [...this.complaints, complaint];
            this.brojPrituzbi++;
            this.uspjesnoSlanje = false;
            this.novaPrituzba = false;
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
      this.complaints = [...this.complaints];
      this.setState({ ...this.state });
    }
  };

  private izbrisi = (id: any) => {
    const newComplaints = this.complaints.filter(
        complaint => (complaint as Complaints).id !== id
    );
    deleteComplaint(id)
        .then(res => {
          if (res.status === 200) {
            console.log("brisanje")
            this.uspjesnoBrisanje = false;
            this.pokazujOdgovor = false;
            this.pokazujDetalje = false;
            this.complaints = newComplaints;
            this.brojPrituzbi--;
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

    getComplaintFormsByUserID(this.userID)
      .then(res => {
        if (res.status === 200) {
          const formatedComplaint = this.formating(res.data);
          this.complaints = formatedComplaint.filter(complaint => complaint.id);
          this.brojPrituzbi = this.complaints.length;
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


    const mapToRowPending = (complaint: Complaints) => {
      const isResponseNull = complaint.employeeResponse === null;
      return (
        <tr key={complaint.id}>
          <th>{complaint.id}</th>
          <th>{complaint.title}</th>
          <th>
            <Button onClick={() => this.detalji(complaint.id)}>Detalji</Button>
          </th>
          {isResponseNull ? (
            <th>{"BEZ odgovora"}</th>
          ) : (
            <th>
              <Button
                onClick={() =>
                  this.odgovor(
                    complaint.id,
                    complaint.title,
                    complaint.description
                  )
                }
              >
                Odgovor
              </Button>
            </th>
          )}
          <th>
              <Button onClick = {() => this.preuzmiPDF(complaint.id)}>Preuzmi</Button>
          </th>
          <th>
            <Button
              variant="danger"
              onClick={() => {
                if (
                  window.confirm("Are you sure you wish to delete this item?")
                )
                  this.izbrisi(complaint.id);
              }}
            >
              Izbriši
            </Button>
          </th>
        </tr>
      );
    };

    const showPendingComplaints = () => {
      return this.complaints.map((complaint: Complaints) => {
        return mapToRowPending(complaint);
      });
    };

    return (
      <div>
        <Form className="login100-form validate-form flex-sb flex-w">
          <span className={"login100-form-title"}>Pritužbe</span>
        </Form>
        <div className="Centered">
          <Table striped bordered hover size={"sm"}>
            <thead>
            <tr>
              <th>ID</th>
              <th>Naslov</th>
              <th>Sadržaj</th>
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


        {!this.novaPrituzba ? (
          <div className={"newComplaintButton"}>
            <Button
              className={"sendButtonNew"}
              variant="success"
              onClick={() => {
                this.changeNewComponent();
              }}
            >
              Nova Pritužba
            </Button>
          </div>
        ) : null}
        <div className={"newComplaintButton"}>
          {!this.limitPrituzbi ? (
            <Alert variant={"warning"}>
              Napravljen maksimalan broj zahtjeva (5)
            </Alert>
          ) : null}
          {!this.uspjesnoBrisanje ? (
            <Alert variant={"success"}>Uspješno brisanje pritužbe!</Alert>
          ) : null}
          {!this.uspjesnoSlanje ? (
            <Alert variant={"success"}>Uspješno slanje pritužbe!</Alert>
          ) : null}
          {!this.state.nijeIzbrisan ? (
              <Alert variant={"danger"}>Greška prilikom dohvaćanja pritužbe!</Alert>
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
                    {this.responseContent}
                  </Card.Footer>
                </Card>

              </div>
            </div>
          </div>
        ) : this.novaPrituzba ? (
          <div className="limiter">
            <div className="container-login100">
              <div className="wrap-login100 p-l-85 p-r-85 p-t-55 p-b-55">
                <Form className="login100-form validate-form flex-sb flex-w">
                  <span className={"login100-form-title"}>Nova pritužba</span>
                  <Form.Group controlId="formTitle">
                    <InputGroup className="ComplaintTitle">
                      <InputGroup.Text>Naslov</InputGroup.Text>
                      <FormControl
                        as="textarea"
                        rows="1"
                        placeholder="Naslov pritužbe"
                        name="title"
                        maxLength="25"
                        value={this.state.title}
                        onChange={this.onChange}
                      />
                    </InputGroup>
                  </Form.Group>
                </Form>

                <InputGroup className="ComplaintText">
                  <FormControl
                    as="textarea"
                    rows="5"
                    placeholder={"Opis pritužbe"}
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
                      <br/>
                      <br/>
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
