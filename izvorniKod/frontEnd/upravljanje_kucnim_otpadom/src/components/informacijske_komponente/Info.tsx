import React from "react";
import "./styles/infoStyle.css";
import ReactHtmlParser from "react-html-parser";
import logo_png from "./styles/80367392_829981297477262_1304022800587030528_n.png";

export default class Info extends React.Component {
  render() {
    const proper = { "overflowY": "scroll" } as React.CSSProperties;
    const htmlBody =
      "<!-- Add a background color and large text to the whole page -->\n" +
      '<div class="w3-sand w3-grayscale w3-large">\n' +
      "\n" +
      "    <!-- About Container -->\n" +
      '    <div class="w3-container" id="about">\n' +
      '        <div class="w3-content" style="max-width:700px text-align:center font-family: Impact">\n' +
      '            <p style="text-align:center;font-size:17px;font-style:italic;"><br/>Na ovoj se aplikaciji građani mogu informirati o načinima razvrstavanja i odlaganja kućnog otpada.</p>\n' +
      "\n" +
      '            <p style="text-align:center;font-size:17px;">Informacije koje korisnik može potražiti su definiranje naziva i kategorija otpada koji se razvrstava te tip resursa za odlaganje, dostupnost odlagališta ' +
      "prema mjestu stanovanja, te informiranje o terminima odvoza za određene lokacije.</p>\n" +
      "\n" +
      '            <p style="text-align:center;font-size:17px;">Također, građani putem aplikacije mogu slati zahtjeve za dodatnim resursima, zahtjeve za odvoz krupnog otpada i pritužbe</p>\n' +
      "\n" +
      '            <p style="text-align:center;font-size:17px;"><br/><br/>Za sve ostale informacije, zahtjeve i pritužbe obratite se na:</p>\n' +
      "\n" +
      '            <h5 class="w3-center w3-padding-64" style="text-align:center;font-size:25px;"><span class=" w3-wide">Zagrebački holding d.o.o.,  Ulica grada Vukovara 41, 10000 Zagreb</span></h5>\n' +
      "\n" +
      '            <p style="text-align:center;font-size:17px;">Podružnica Čistoća, Radnička cesta 82, 10000 Zagreb<br/>\n' +
      "                Tel: 01 6146-400, faks: 01 6187-038</p>\n" +
      "\n" +
      '            <p style="text-align:center;font-size:17px;">e-mail: cistoca@zgh.hr<br/>\n' +
      "                web: www.cistoca.hr</p>\n" +
      "\n" +
      '            <p style="text-align:center;font-size:17px;">Žiro račun: 2360000-1400480347<br/>\n' +
      "                OIB: 85584865987<br/>\n" +
      "                MB: 3677702-004</p>\n" +
      "\n" +
      "        </div>\n" +
      "    </div>";
    return (
      <div>
        <div className="App" style={proper}>
            <img src={logo_png} className="center"></img>
          <div>{ReactHtmlParser(htmlBody)}</div>
        </div>
        ;
      </div>

    );
  }
}
