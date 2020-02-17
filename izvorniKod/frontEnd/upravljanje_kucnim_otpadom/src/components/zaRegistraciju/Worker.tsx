import React, { Component } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { Link, Redirect } from "react-router-dom";
import { register } from "../../store/service";
import { Alert } from "react-bootstrap";

export interface IWorker {
  userName: String;
  password: String;
}

export class Worker extends Component {
  private goToLogin = false;

  state = {
    userName: "",
    password: ""
  };

  public postojiUsername = false;
  public svaPoljaIspunjena = true;
  public passwordMinOsam = true;

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
            name={"userName"}
            onChange={this.changeState}
            value={this.state.userName}
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

        <div className={"elements"}>
          <Button onClick={this.registerWorker}>Register</Button>
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

  private registerWorker = (dispatch: any) => {
    const user = {
      username: this.state.userName,
      password: this.state.password,
      role: "EMPLOYEE"
    };
    if (!(this.state.userName && this.state.password)) {
      this.svaPoljaIspunjena = false;
    } else {
      this.svaPoljaIspunjena = true;
    }
    if (this.state.password.length < 8) {
      this.passwordMinOsam = false;
    } else {
      this.passwordMinOsam = true;
    }
    if (this.svaPoljaIspunjena && this.passwordMinOsam) {
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
