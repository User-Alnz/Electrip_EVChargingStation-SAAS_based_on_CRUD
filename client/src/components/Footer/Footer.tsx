import Wire from "/btn_borne_minimenu.png";
import Car from "/btn_voiture_minimenu.png";
import { useNavigate } from "react-router-dom";
import { useSelectedView } from "../../contexts/ReservationContext";
import "./Footer.css";

function Footer() 
{
  const {setSelectedView} = useSelectedView();
  const navigate = useNavigate();

  return (
    <>
      <section className="footer">
        <img src={Wire} onClick={()=> {navigate("/reservation"); setSelectedView("ongoing")}} alt="Wirelogo" title="Voir ma reservation" />
        <img src={Car} onClick={()=> {navigate("/reservation"); setSelectedView("history")}} alt="voiturelogo" title ="Historique reservation"/>
      </section>
    </>
  );
}

export default Footer;
