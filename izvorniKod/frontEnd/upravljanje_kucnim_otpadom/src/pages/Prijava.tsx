import React, { Component } from "react";
import { signin } from "../store/service";
import { Link, Redirect } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import "./design/signIn.css";
import { Alert } from "react-bootstrap";
import jwt from "jwt-decode";

export class Prijava extends Component {
  constructor(props: Readonly<{}>) {
    super(props);
    this.callAction = this.callAction.bind(this);
  }
  state = {
    user: "",
    password: "",
    numOfMistakes: 0,
    toHomePage: false
  };

  componentDidMount(): void {
    sessionStorage.clear();
  }

  render() {
    if (this.state.toHomePage) {
      const item = sessionStorage.getItem("userInfo");
      if (item) {
        const token = jwt(item!);
        if (token) {
          // @ts-ignore
          const role = token.role;
          if (role === "ADMIN") {
            return <Redirect to="/admin" />;
          } else if (role === "EMPLOYEE") {
            return <Redirect to="/employe" />;
          } else if (role === "CITIZEN") {
            return <Redirect to="/HomePage" />;
          } else {
            return <h1>POGRESKA</h1>;
          }
        } else {
          console.log("token nije string");
        }
      } else {
        console.log("ne postoji item");
      }
    }
    return (
      <div className="limiter">
        <div className="container-login100">
          <div className="wrap-login100 p-l-85 p-r-85 p-t-55 p-b-55">
            <Form className="login100-form validate-form flex-sb flex-w">
              <span className={"login100-form-title"}>Login</span>
              <Form.Group controlId="formUsername">
                <Form.Label>Username</Form.Label>
                <Form.Control
                  type="username"
                  placeholder="Enter username"
                  name="user"
                  value={this.state.user}
                  onChange={this.settingUser}
                />
              </Form.Group>

              <Form.Group controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Password"
                  name="password"
                  value={this.state.password}
                  onChange={this.settingPassword}
                />
              </Form.Group>
              <div className={"elements"}>
                <Button onClick={this.callAction}>Log in</Button>
                <span />
                <span />
                <Link to="/registracija">
                  {"don't have an account? sign up"}
                </Link>
              </div>
            </Form>
            {this.state.numOfMistakes > 0 ? (
              <Alert variant={"danger"}>
                Neispravna lozinka ili korisnicko ime!
              </Alert>
            ) : null}
          </div>
        </div>
      </div>
    );
  }

  callAction = (dispatch: any) => {
    const credentials: any = {
      username: this.state.user,
      password: this.state.password
    };
    signin(credentials)
      .then((res: { status: number }) => {
        if (res.status === 200) {
          this.setState({ ...this.state, toHomePage: true });
        } else {
          this.setState({
            ...this.state,
            numOfMistakes: this.state.numOfMistakes + 1
          });
        }
      })
      .catch(function(error: any) {
        console.log(error);
      });
    //TODO sprjecit vise od tri krivih pokusaja
  };

  private settingUser = (event: any) => {
    const text = event.target.value;
    this.setState({ ...this.state, user: text });
  };

  private settingPassword = (event: any) => {
    const text = event.target.value;
    this.setState({ ...this.state, password: text });
  };
}
