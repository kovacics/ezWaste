import React, { Component } from "react";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";
import Navbar from "react-bootstrap/Navbar";
import { Switch, Route, Redirect } from "react-router-dom";
import Resursi from "../components/Zahtjevi_i_prituzbe_citizen/Resursi";
import Otpad from "../components/Zahtjevi_i_prituzbe_citizen/Otpad";
import Prituzbe from "../components/Zahtjevi_i_prituzbe_citizen/Prituzbe";
import Odgovarajuci from "../components/informacijske_komponente/Odgovarajuci";
import Dostupni from "../components/informacijske_komponente/Dostupni";
import Termini from "../components/informacijske_komponente/Termini";
import Info from "../components/informacijske_komponente/Info";
import logo from "../assets/ezWastePlainpng.png";
import jwt from "jwt-decode";

export class PageForCitizen extends Component {
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
        if (role !== "CITIZEN") {
          return <Redirect to="/" />;
        }
      }
    } else {
      return <Redirect to="/" />;
    }
    return (
      <div>
        <Navbar collapseOnSelect expand="lg" bg="light" variant="light">
          <Navbar.Brand href="/HomePage/">
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
              <NavDropdown title="Moji zahtjevi" id="collasible-nav-dropdown">
                <NavDropdown.Item href="/HomePage/resursi">
                  Dodatni resursi
                </NavDropdown.Item>
                <NavDropdown.Item href="/HomePage/otpad">
                  Glomazni otpad
                </NavDropdown.Item>
              </NavDropdown>
              <Nav.Link href="/HomePage/prituzbe">Moje pritužbe</Nav.Link>
              <NavDropdown title="Informacije" id="collasible-nav-dropdown">
                <NavDropdown.Item href="/HomePage/odgovarajuci">
                  Odgovarajuće odlagalište za traženi proizvod
                </NavDropdown.Item>
                <NavDropdown.Item href="/HomePage/dostupni">
                  Pregled odlagališta
                </NavDropdown.Item>
                <NavDropdown.Item href="/HomePage/termini">
                  Termini odvoza otpada
                </NavDropdown.Item>
                <NavDropdown.Item href="/HomePage">
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
          <Route path="/HomePage/resursi" component={Resursi} />
          <Route exact path="/HomePage/otpad" component={Otpad} />
          <Route path="/HomePage/prituzbe" component={Prituzbe} />
          <Route path="/HomePage/odgovarajuci" component={Odgovarajuci} />
          <Route path="/HomePage/dostupni" component={Dostupni} />
          <Route path="/HomePage/termini" component={Termini} />
          <Route path="/HomePage" component={Info} />
        </Switch>
      </div>
    );
  }

  odjava = () => {
    sessionStorage.clear();
    this.setState({ odjava: true });
  };
}
