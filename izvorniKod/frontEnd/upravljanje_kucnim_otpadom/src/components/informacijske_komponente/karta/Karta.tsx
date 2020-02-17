import React from 'react';
import {Map, Marker, Popup, TileLayer} from "react-leaflet";
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import './karta.css';
import {Landfill} from "../Dostupni";
import {getLongLat} from "../../../store/LandFillService";

export interface KartaProps{
  landfills: Landfill[];
  showlandfill: (landfill: Landfill) => void;
}

export interface KartaState{

}

export interface Loc{
  Longitude: number;
  Latitude: number;
  idLandfill: number;
}

export class Karta extends React.Component<KartaProps, KartaState> {

  state= {
    listOfLoc: [] as Loc[]
  };

  constructor(props: any){
    super(props);
    console.log(props);
  }
  private jedan: Loc = {} as Loc;


  componentDidMount() {
    console.log(this.props);

    const listOfLoc = [] as Loc[];
   this.props.landfills.map((landfill: Landfill) => {
      getLongLat(landfill.id!).then((kord: any) => {
        listOfLoc.push({Longitude: kord.Longitude, Latitude: kord.Latitude, idLandfill: landfill.id!})
      });
    })
    this.setState({listOfLoc: listOfLoc})
  }

  componentDidUpdate(prevProps){
    if(prevProps.landfills !== this.props.landfills){
      const listOfLoc = [] as Loc[];
      this.props.landfills.map((landfill: Landfill) => {
        getLongLat(landfill.id!).then((kord: any) => {
            listOfLoc.push({Longitude: kord.data.Longitude, Latitude: kord.data.Latitude, idLandfill: landfill.id!})
        }).catch(e => {});
      })
      setTimeout(() => this.setState({listOfLoc: listOfLoc}), 1500);
    }
  }

  render() {
      console.log(this.state.listOfLoc);
      const customMarker = L.icon({iconUrl: require('./marker.png')});
      const getlandfill = (id: number) => {
        return this.props.landfills.find((land) => land.id === id);
      }
      let listOfMarkers;
      if (this.state.listOfLoc) {
        listOfMarkers =
            this.state.listOfLoc.map((loc: Loc) => {
              return <Marker icon={customMarker} position={[loc.Latitude, loc.Longitude]}
                             onClick={() => this.props.showlandfill(getlandfill(loc.idLandfill)!)}>
                      </Marker>
            });
      }
      console.log(this.state.listOfLoc);
      // {listOfMarkers}

      return (
          <div className="Cstyle">
            <Map style={{height: "80vh"}} center={[45.75, 16]} zoom={10} className="Cstyle">
              <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              {listOfMarkers}
            </Map>
          </div>
      );
    }
}
