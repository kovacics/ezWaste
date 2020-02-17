import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { Link, Redirect } from "react-router-dom";
import React, { Component } from "react";
import { register } from "../../store/service";
import { Alert } from "react-bootstrap";

export interface ICitizen {
  username: String;
  password: String;
  name: String;
  surname: String;
  street: String;
  number: String;
  city: String;
  email: String;
}

export class Citizen extends Component {
  private goToLogin = false;

  state = {
    username: "",
    password: "",
    name: "",
    surname: "",
    street: "",
    number: "",
    city: "",
    email: ""
  };

  public svaPoljaIspunjena = true;
  public passwordMinOsam = true;
  public brojJe = true;
  public ispravanJeMail = true;
  public postojiUsername = false;

  render() {
    if (this.goToLogin) {
      return <Redirect to="/prijava" />;
    }
    return (
      <div>
        <Form.Group controlId="formUsername">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="username"
            placeholder="Enter username"
            name={"username"}
            onChange={this.changeState}
            value={this.state.username}
          />
        </Form.Group>

        <Form.Group controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            name={"password"}
            onChange={this.changeState}
            value={this.state.password}
          />
        </Form.Group>

        {!this.passwordMinOsam ? (
          <Alert variant={"warning"}>Lozinka ima manje od 8 znamenaka</Alert>
        ) : null}

        <Form.Group controlId="formName">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="username"
            placeholder="Name"
            name={"name"}
            onChange={this.changeState}
            value={this.state.name}
          />
        </Form.Group>

        <Form.Group controlId="formSurname">
          <Form.Label>Surname</Form.Label>
          <Form.Control
            type="Surname"
            placeholder="Surname"
            name={"surname"}
            onChange={this.changeState}
            value={this.state.surname}
          />
        </Form.Group>

        <Form.Group controlId="formStreet">
          <Form.Label>Street</Form.Label>
          <Form.Control
            type="Street"
            placeholder="Street"
            name={"street"}
            onChange={this.changeState}
            value={this.state.street}
          />
        </Form.Group>

        <Form.Group controlId="formNumber">
          <Form.Label>Number</Form.Label>
          <Form.Control
            type="string"
            placeholder="Number"
            name={"number"}
            onChange={this.changeState}
            value={this.state.number}
          />
        </Form.Group>
        {!this.brojJe ? <Alert variant={"warning"}>nije broj</Alert> : null}

        <Form.Group controlId="formCity">
          <Form.Label>City</Form.Label>
          <Form.Control
            type="City"
            placeholder="City"
            name={"city"}
            onChange={this.changeState}
            value={this.state.city}
          />
        </Form.Group>

        <Form.Group controlId="formEmail">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="Email"
            placeholder="Email"
            name={"email"}
            onChange={this.changeState}
            value={this.state.email}
          />
        </Form.Group>
        {!this.ispravanJeMail ? (
          <Alert variant={"warning"}>nije ispravan mail</Alert>
        ) : null}

        <div className={"elements"}>
          <Button onClick={this.callAction}>Register</Button>
          <span />
          <span />
          <Link to="/">{"You have an account? sign in"}</Link>
        </div>
        {this.postojiUsername ? (
          <Alert variant={"warning"}>Postoji username</Alert>
        ) : null}
        {!this.svaPoljaIspunjena ? (
          <Alert variant={"warning"}>Nisu sva polja ispunjena</Alert>
        ) : null}
      </div>
    );
  }
  private callAction = (dispatch: any) => {
    const user = {
      username: this.state.username,
      password: this.state.password,
      firstName: this.state.name,
      lastName: this.state.surname,
      city: this.state.city,
      street: this.state.street,
      number: this.state.number,
      email: this.state.email,
      role: "CITIZEN"
    };
    if (
      !(
        this.state.username &&
        this.state.email &&
        this.state.number &&
        this.state.street &&
        this.state.city &&
        this.state.surname &&
        this.state.name &&
        this.state.password
      )
    ) {
      this.svaPoljaIspunjena = false;
    } else {
      this.svaPoljaIspunjena = true;
    }
    if (this.state.number && !isNaN(parseFloat(this.state.number))) {
      this.brojJe = true;
    } else {
      this.brojJe = false;
    }
    if (this.state.email.includes("@")) {
      this.ispravanJeMail = true;
    } else {
      this.ispravanJeMail = false;
    }
    if (this.state.password.length < 8) {
      this.passwordMinOsam = false;
      this.callingService(user);
    } else {
      this.passwordMinOsam = true;
      this.callingService(user);
    }
  };

  private callingService = (user: any) => {
    if (
      this.svaPoljaIspunjena &&
      this.passwordMinOsam &&
      this.ispravanJeMail &&
      this.brojJe
    ) {
      register(user)
        .then(res => {
          if (res === true) {
            this.goToLogin = true;
            this.setState({ ...this.state });
          } else {
            this.postojiUsername = true;
            this.setState({ ...this.state });
          }
        })
        .catch(error => {
          console.log(error);
        });
    } else {
      this.setState({ ...this.state });
    }
  };

  private changeState = (event: any) => {
    const name = event.target.name;
    const value = event.target.value;
    this.setState({ [name]: value });
  };
}
