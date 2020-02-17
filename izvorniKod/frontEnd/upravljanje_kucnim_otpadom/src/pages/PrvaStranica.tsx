import React, { Component } from "react";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";
import { Route, Switch } from "react-router-dom";
import Odgovarajuci from "../components/informacijske_komponente/Odgovarajuci";
import Dostupni from "../components/informacijske_komponente/Dostupni";
import Termini from "../components/informacijske_komponente/Termini";
import Info from "../components/informacijske_komponente/Info";
import logo from "../assets/ezWastePlainpng.png";

export class PrvaStranica extends Component {
  render() {
    return (
      <div>
        <Navbar collapseOnSelect expand="lg" bg="light" variant="light">
          <Navbar.Brand href="/pocetna">
            <img
                src={logo}
                width="120"
                height="40"
                className="d-inline-block align-top"
            />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="mr-auto">
              <NavDropdown title="Informacije" id="collasible-nav-dropdown">
                <NavDropdown.Item href="/pocetna/odgovarajuci">
                  Odgovarajuće odlagalište za traženi proizvod
                </NavDropdown.Item>
                <NavDropdown.Item href="/pocetna/dostupni">
                  Pregled odlagališta
                </NavDropdown.Item>
                <NavDropdown.Item href="/pocetna/termini">
                  Termini odvoza otpada
                </NavDropdown.Item>
                <NavDropdown.Item href="/pocetna">
                  Informacije o poduzeću
                </NavDropdown.Item>
              </NavDropdown>
            </Nav>
            <Nav>
              <Nav.Link href="/prijava">Prijava</Nav.Link>
              <Nav.Link href="/registracija">Registracija</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Navbar>

        <Switch>
          <Route path="/pocetna/odgovarajuci" component={Odgovarajuci} />
          <Route path="/pocetna/dostupni" component={Dostupni} />
          <Route path="/pocetna/termini" component={Termini} />
          <Route path="/pocetna" component={Info} />
        </Switch>
      </div>
    );
  }
}
