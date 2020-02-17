import React, { Component } from "react";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";
import Navbar from "react-bootstrap/Navbar";
import { Redirect, Route, Switch } from "react-router-dom";
import Odgovarajuci from "../components/informacijske_komponente/Odgovarajuci";
import Dostupni from "../components/informacijske_komponente/Dostupni";
import Termini from "../components/informacijske_komponente/Termini";
import Info from "../components/informacijske_komponente/Info";
import OdResursi from "../components/Zahtjevi_i_prituzbe_employe/OdResursi";
import OdOtpad from "../components/Zahtjevi_i_prituzbe_employe/OdOtpad";
import OdPrituzbe from "../components/Zahtjevi_i_prituzbe_employe/OdPrituzbe";
import jwt from "jwt-decode";
import logo from "../assets/ezWastePlainpng.png";

export class PageForEmploye extends Component {
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
        if (role !== "EMPLOYEE") {
          return <Redirect to="/" />;
        }
      }
    } else {
      return <Redirect to="/" />;
    }
    return (
      <div>
        <Navbar collapseOnSelect expand="lg" bg="light" variant="light">
          <Navbar.Brand href="/employe/" >
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
              <NavDropdown title="Zahtjevi i pritužbe" id="collasible-nav-dropdown">
                <NavDropdown.Item href="/employe/OdNaresursi">
                  Dodatni resursi
                </NavDropdown.Item>
                <NavDropdown.Item href="/employe/OdNaotpad">
                  Glomazni otpad
                </NavDropdown.Item>
                <NavDropdown.Item href="/employe/OdNaprituzbe">
                  Pritužbe
                </NavDropdown.Item>
              </NavDropdown>
              <NavDropdown title="Informacije" id="collasible-nav-dropdown">
                <NavDropdown.Item href="/employe/odgovarajuci">
                  Odgovarajuće odlagalište za traženi proizvod
                </NavDropdown.Item>
                <NavDropdown.Item href="/employe/dostupni">
                  Pregled odlagališta
                </NavDropdown.Item>
                <NavDropdown.Item href="/employe/termini">
                  Termini odvoza otpada
                </NavDropdown.Item>
                <NavDropdown.Item href="/employe">
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
          <Route exact path="/employe/OdNaresursi" component={OdResursi} />
          <Route exact path="/employe/OdNaotpad" component={OdOtpad} />
          <Route exact path="/employe/OdNaprituzbe" component={OdPrituzbe} />
          <Route exact path="/employe/odgovarajuci" component={Odgovarajuci} />
          <Route exact path="/employe/dostupni" component={Dostupni} />
          <Route exact path="/employe/termini" component={Termini} />
          <Route exact path="/employe" component={Info} />
        </Switch>
      </div>
    );
  }

  odjava = () => {
    sessionStorage.clear();
    this.setState({ odjava: true });
  };
}
