import React, { Component } from "react";
import { Redirect, Route, Switch } from "react-router";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";
import Odgovarajuci from "../components/informacijske_komponente/Odgovarajuci";
import Dostupni from "../components/informacijske_komponente/Dostupni";
import Termini from "../components/informacijske_komponente/Termini";
import Info from "../components/informacijske_komponente/Info";
import { Korisnici } from "../components/zaAdmina/Korisnici";
import jwt from "jwt-decode";
import logo from "../assets/ezWastePlainpng.png";

export class PageForAdmin extends Component {
  state = {
    odjava: false
  };


  render() {
    if (this.state.odjava) {
      return <Redirect to={"/"} />;
    }
    const item = sessionStorage.getItem("userInfo");
    if (item) {
      const token = jwt(item!);
      if (token) {
        // @ts-ignore
        const role = token.role;
        if (role !== "ADMIN") {
          return <Redirect to="/" />;
        }
      }
    } else {
      return <Redirect to="/" />;
    }
    return (
      <div>
        <Navbar collapseOnSelect expand="lg" bg="light" variant="light">
          <Navbar.Brand href="/admin/">
            <img
                src={logo}
                width="150"
                height="40"
                className="d-inline-block align-top"
            />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="mr-auto">
              <Nav.Link href="/admin/korisnici">Popis korisnika</Nav.Link>
              <NavDropdown title="Informacije" id="collasible-nav-dropdown">
                <NavDropdown.Item href="/admin/odgovarajuci">
                  Odgovarajuće odlagalište za traženi proizvod
                </NavDropdown.Item>
                <NavDropdown.Item href="/admin/dostupni">
                  Pregled odlagališta
                </NavDropdown.Item>
                <NavDropdown.Item href="/admin/termini">
                  Termini odvoza otpada
                </NavDropdown.Item>
                <NavDropdown.Item href="/admin">
                  Informacije o poduzeću
                </NavDropdown.Item>
              </NavDropdown>
            </Nav>
            <Nav>
              <Nav.Link eventKey={2} onClick={this.odjava}>
                Odjava
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Navbar>

        <Switch>
          <Route path="/admin/korisnici" component={Korisnici} />
          <Route path="/admin/odgovarajuci" component={Odgovarajuci} />
          <Route path="/admin/dostupni" component={Dostupni} />
          <Route path="/admin/termini" component={Termini} />
          <Route path="/admin" component={Info} />
        </Switch>
      </div>
    );
  }

  odjava = () => {
    sessionStorage.clear();
    this.setState({ odjava: true });
  };
}
