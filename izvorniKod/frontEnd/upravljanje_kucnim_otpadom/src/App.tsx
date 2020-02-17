import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Prijava } from "./pages/Prijava";
import { Registracija } from "./pages/Registracija";
import { PageForCitizen } from "./pages/PageForCitizen";
import { PageForAdmin } from "./pages/PageForAdmin";
import { PageForEmploye } from "./pages/PageForEmploye";
import { PrvaStranica } from "./pages/PrvaStranica";
import { Redirect } from "react-router-dom";

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/pocetna">
          <PrvaStranica />
        </Route>
        <Route exact path="/prijava">
          <Prijava />
        </Route>
        <Route exact path="/registracija">
          <Registracija />
        </Route>
        <Route path="/HomePage">
          <PageForCitizen />
        </Route>
        <Route path="/admin">
          <PageForAdmin />
        </Route>
        <Route path="/employe">
          <PageForEmploye />
        </Route>
        <Route path="/">
          <Redirect to="/pocetna" />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
