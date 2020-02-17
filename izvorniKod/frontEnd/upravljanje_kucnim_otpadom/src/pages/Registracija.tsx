import React, { Component } from "react";
import Form from "react-bootstrap/Form";
import "./design/signIn.css";
import ToggleButton from "react-bootstrap/ToggleButton";
import ToggleButtonGroup from "react-bootstrap/ToggleButtonGroup";
import ButtonToolbar from "react-bootstrap/ButtonToolbar";
import { Citizen } from "../components/zaRegistraciju/Citizen";
import { Worker } from "../components/zaRegistraciju/Worker";

export class Registracija extends Component {
  state = {
    citizen: true
  };

  render() {
    return (
      <div className="limiter">
        <div className="container-login100">
          <div className="wrap-login100 p-l-85 p-r-85 p-t-55 p-b-55">
            <Form className="login100-form validate-form flex-sb flex-w">
              <span className={"login100-form-title"}>Register</span>
              <ButtonToolbar>
                <ToggleButtonGroup type="radio" name="options" defaultValue={1}>
                  <ToggleButton
                    size="lg"
                    value={1}
                    variant="light"
                    onChange={this.switchingToCitizen}
                  >
                    Citizen
                  </ToggleButton>
                  <ToggleButton
                    size="lg"
                    value={2}
                    variant="light"
                    onChange={this.switchingToWorker}
                  >
                    Employe
                  </ToggleButton>
                </ToggleButtonGroup>
              </ButtonToolbar>
              {this.state.citizen ? <Citizen /> : <Worker />}
            </Form>
          </div>
        </div>
      </div>
    );
  }

  private switchingToCitizen = (dispatch: any) => {
    this.setState({ citizen: true });
  };

  private switchingToWorker = (dispatch: any) => {
    this.setState({ citizen: false });
  };
}
