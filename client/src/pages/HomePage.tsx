import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

import Footer from "../components/Footerhome/Footerhome";
import Header from "../components/Header/Header";

import "../App.css";
import "./HomePage.css";

import Buttonplus from "/btn_+.png";
import ImgAbout from "/img_about.jpg";
import ImgCharger from "/img_borne.jpg";
import ImgCar from "/img_voiture.jpg";
import MarkerAbout from "/marker_about.png";
import MarkerCharger from "/marker_borne.png";
import MarkerCar from "/marker_voiture.png";
import { useCallback } from "react";

function HomePage() 
{
  const { auth } = useAuth();

  const displayButton = useCallback((authEndpoint : string, notAuthEndpoint : string , message : string) => 
  {
    return(
      <>
        {auth ? (
          <Link to={authEndpoint}>
            <button type="button">{message}</button>
          </Link>
          ):(
          <Link to={notAuthEndpoint}>
            <button type="button">{`${message}`}</button>
          </Link>)}
      </>
    )
  },[])

  return (
    <>
      <Header />
      <section className="section1">
        <div className="homeContenair">
          <div className="homeInfo">
            <div className="homeTitle">
              <img src={MarkerCharger} alt="Chargeur de voiture" />
              <h2>Trouver une borne</h2>
            </div>
            <div className="homeContent">
              <p>
                Avec notre service de localisation avancé, Electrip vous garantit de trouver 
                rapidement une borne de recharge dans votre région, 
                ville ou arrondissement. Vous retrouverez toutes les stations 
                disponibles autour de votre position dans un périmètre de 10 km.
              </p>
              {displayButton("/trouver_une_borne", "/mon_compte", "Trouver une bone")}
            </div>
          </div>
          <img className="imgHome" src={ImgCharger} alt="cliqué d'une borne" />
        </div>
      </section>

      <section className="section2">
        <div className="homeContenair2">
          <div className="homeInfo2">
            <div className="homeTitle">
              <img src={MarkerCar} alt="cliché d'une voiture" />
              <h2>Suivre Votre reservation</h2>
            </div>
            <div className="homeContent">
              <p>
              De la même manière que pour trouver une borne, vous pouvez 
              suivre votre réservation en temps réel, brancher votre voiture,
              annuler votre réservation, consulter votre consommation en temps réel, 
              puis accéder à tout votre historique.
              </p>
              {displayButton("/reservation", "/mon_compte", "Mes reservation")}
            </div>
          </div>
          <img className="imgHome" src={ImgCar} alt="cliché d'une voiture" />
        </div>
      </section>

      <section className="section1">
        <div className="homeContenair">
          <div className="homeInfo">
            <div className="homeTitle">
              <img src={MarkerAbout} alt="Icone qui redirige vers à propos" />
              <h2>À propos</h2>
            </div>
            <div className="homeContent">
              <p>
              Electrip est la première super-appli française de localisation de bornes de recharge. 
              Nous luttons pour des villes plus respirables en offrant de meilleures alternatives à la voiture thermique.
              </p>
              <ul>
                <li>Plus de 2 millions d'usagés sur nos services</li>
                <li>
                  Large couverture avec environ 70% du territoire Français.
                </li>
              </ul>
            </div>
          </div>
          <img
            className="imgHome"
            src={ImgAbout}
            alt="cliché illustrant un homme qui cour"
          />
        </div>
      </section>

      <section className="section2">
        <div className="homeContenair">
          <div className="homeContent">
            <h2>Questions fréquentes</h2>
            <details className="homeDetails">
              <summary className="homeSummary">
                Puis-je bénéficier des services de localisation de bornes pour
                mon véhicule personnel ?
                <img
                  className="buttonplus"
                  src={Buttonplus}
                  alt="bouton pour developper"
                />
              </summary>
              <p>
                Oui, vous pouvez utiliser notre service pour localiser
                rapidement les bornes de recharge proches de votre véhicule.
                Accédez à notre carte interactive pour vérifier leur
                disponibilité et leurs caractéristiques en temps réel.
              </p>
            </details>
            <details className="homeDetails">
              <summary className="homeSummary">
                Quel est le prix de l'utilisation d'une borne de recharge ?
                <img
                  className="buttonplus"
                  src={Buttonplus}
                  alt="bouton pour developper"
                />
              </summary>
              <p>
                Vous trouverez toutes les informations dans l'onglet "Tarifs".
              </p>
            </details>
            <details className="homeDetails">
              <summary className="homeSummary">
                Puis je annuler ma reservation ?
                <img
                  className="buttonplus"
                  src={Buttonplus}
                  alt="bouton pour developper"
                />
              </summary>
              <p>Oui, à condition que vous n'ayez pas encore utilisé la borne</p>
            </details>
            <details className="homeDetails">
              <summary className="homeSummary">
                Quel est le prix d'une location d'un véhicule électrique ?
                <img
                  className="buttonplus"
                  src={Buttonplus}
                  alt="bouton pour developper"
                />
              </summary>
              <p>
                Entre 0,15 € et 0,75 € le kWh. Soit entre 15 € et 75 € pour 100 kWh. Bien évidemment, ce prix varie en fonction de la puissance de la prise qui vous est proposée.
              </p>
            </details>
            <details className="homeDetails">
              <summary className="homeSummary">
                Combien de temps puis-je louer une borne ?
                <img
                  className="buttonplus"
                  src={Buttonplus}
                  alt="bouton pour developper"
                />
              </summary>
              <p>
                La durée standard est d'une heure pour faciliter le roulement avec d'autres utiliseurs.
              </p>
            </details>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

export default HomePage;
