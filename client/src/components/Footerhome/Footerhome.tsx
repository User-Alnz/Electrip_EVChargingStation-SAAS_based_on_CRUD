import { Link } from "react-router-dom";

import Edf from "/edf.png";
import Engie from "/engie.png";
import Green from "/green-choice.png";
import Enercoop from "/logo-enercoop.png";
import Eqwateur from "/logo-eqwateur.png";
import Ilek from "/logo-ilek.png";
import Ohm from "/logo-ohm-Q-3.png";
import Total from "/total-energie.png";

import "./Footerhome.css";

function Footer() {
  return (
    <>
      <section className="partnersHome">
        <div className="wrapPartnersHome">
          <div className="scroll-container">
            <div className="logos">
              <img src={Edf} alt="edflogo" />
              <img src={Engie} alt="engielogo" />
              <img src={Total} alt="totallogo" />
              <img src={Green} alt="greenlogo" />
              <img src={Enercoop} alt="enercooplogo" />
              <img src={Eqwateur} alt="eqwatelulogo" />
              <img src={Ilek} alt="ileklogo" />
              <img src={Ohm} alt="ohmlogo" />
            </div>
            <div className="logos">
              <img src={Edf} alt="edflogo" />
              <img src={Engie} alt="engielogo" />
              <img src={Total} alt="totallogo" />
              <img src={Green} alt="greenlogo" />
              <img src={Enercoop} alt="enercooplogo" />
              <img src={Eqwateur} alt="eqwatelulogo" />
              <img src={Ilek} alt="ileklogo" />
              <img src={Ohm} alt="ohmlogo" />
            </div>
          </div>
        </div>
      </section>
      <footer className="footerHome">
        <div className="wrapFooterHome">
          <p>BORNE to be alive présente le projet ELECTRIP</p>
          <Link className="linkCGU" to="/Conditions_Generales_d'Utilisation">
            Conditions Générales d'Utilisation
          </Link>
        </div>
      </footer>
    </>
  );
}

export default Footer;
