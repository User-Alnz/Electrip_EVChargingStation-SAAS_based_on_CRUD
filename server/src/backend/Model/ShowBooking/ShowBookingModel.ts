import { type } from "os";
import { Database, QueryResult, RowsResult } from "../../Database/DatabaseConnection.js"
import  SQL  from "../../Database/DatabaseConnection.js"


type ReservationData =[{
    borne_id:   number, //7869,
    start_time:  string, //2025-05-26T16:27:17.000Z,
    end_time: string, //2025-05-26T17:27:17.000Z,
    id_station: string, //'FRCPIE6506905',
    n_station: string, //'station name',
    ad_station: string, //'adress',
    nbre_pdc: number, //1,
    acces_recharge:  string | null,
    accessibilite: string,//'Lun-Vend 7AM à 8PM\nSam 7AM à 12PM',
    puiss_max: string, //'24',
    type_prise: string, //'Combo'
}]
      
class ShowBookingModel{

    async readUserbookingUnderway( userId : number ){

        const [displayReservation] = await SQL.query<RowsResult>(
            "SELECT r.borne_id, r.start_time, r.end_time, s.id_station, s.n_station, s.ad_station, s.nbre_pdc, s.acces_recharge, s.accessibilite, s.puiss_max, s.type_prise FROM reservation r JOIN bornes b ON r.borne_id = b.id JOIN station s ON b.station_id = s.id WHERE NOW() BETWEEN r.start_time AND r.end_time AND r.user_id = ?",
            [userId]
        );

        if(displayReservation.length < 1)
        return false;

        return displayReservation as ReservationData;
    }
}

export default new ShowBookingModel;
