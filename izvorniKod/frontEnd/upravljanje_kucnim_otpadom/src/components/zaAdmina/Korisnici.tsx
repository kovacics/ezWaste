import React, { Component } from "react";
import { Button, Table } from "react-bootstrap";
import { deleteUser, getUsers } from "../../store/adminUsers";

export interface Useri {
  id: string;
  username: string;
  uloga: string;
}

export class Korisnici extends Component {
  state = {
    useri: [] as Useri[],
    pocetniPrikaz: 0
  };

  componentWillMount(): void {
    getUsers()
      .then(res => {
        if (res.status === 200) {
          console.log(res.data);
          const formatedUsers = this.formating(res.data);
          this.setState({ useri: formatedUsers.filter(user => user.id) });
        } else {
          console.log("ne radi get osoba");
        }
      })
      .catch(error => {
        console.log(error);
      });
  }

  formating = (data: any[]) => {
    return data.map(one => {
      if (one.role === "CITIZEN" || one.role === "EMPLOYEE") {
        return {
          id: one.id,
          username: one.username,
          uloga: one.role==="CITIZEN" ? "Građanin": "Zaposlenik"
        } as Useri;
      } else return { id: "", username: "", uloga: "" } as Useri;
    });
  };

  render() {
    const izbrisi = (id: string) => {
      const noviUseri = this.state.useri.filter(
        user => (user as Useri).id !== id
      );
      deleteUser(id)
        .then(res => {
          if (res.status === 200) {
            this.setState({ useri: noviUseri });
          } else {
            console.log("nije se obrisao osoba");
          }
        })
        .catch(error => {
          console.log(error);
        });
    };

    const mapToRow = (user: Useri) => {
      return (
        <tr>
          <th>{user.id}</th>
          <th>{user.username}</th>
          <th>{user.uloga}</th>
          <th>
            <Button onClick={() => izbrisi(user.id)}>Izbriši</Button>
          </th>
        </tr>
      );
    };

    const showUsers = () => {
      return this.state.useri.slice(this.state.pocetniPrikaz,this.state.pocetniPrikaz+10).map((user: Useri) => {
        return mapToRow(user);
      });
    };

    const nazad = () => {
      if (this.state.pocetniPrikaz > 0) {
        this.setState({pocetniPrikaz: this.state.pocetniPrikaz - 10})
      }
    }

    const naprijed = () => {
      if (this.state.pocetniPrikaz + 10 < this.state.useri.length) {
        this.setState({pocetniPrikaz: this.state.pocetniPrikaz + 10})
      }
    }

    return (
      <div>
        <div style ={{fontSize: "18px", marginTop: "30px"}} className="container" >
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>ID</th>
              <th>Username</th>
              <th>Uloga</th>
              <th>Izbriši</th>
            </tr>
          </thead>
          <tbody>
            {showUsers()}
            {console.log(this.state.useri + "dole")}
          </tbody>
        </Table>
        <div className="bg-info">
          <Button variant="primary" className="btn btn-secondary float-left" onClick = {nazad} children={"<<"}/>
          <Button variant="primary" className="btn btn-secondary float-right" onClick = {naprijed} children={">>"}/>
        </div>
      </div>
      </div>
    );
  }
}
