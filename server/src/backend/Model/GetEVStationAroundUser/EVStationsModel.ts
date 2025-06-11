import { Database, QueryResult, RowsResult } from "../../Database/DatabaseConnection.js"
import  SQL  from "../../Database/DatabaseConnection.js"

type localisation = {
    id_station: string;
    n_station: string;
    ad_station: string;
    coordinates: [xlongitude: number, ylatitude: number];
    ylatitude: string;
    nbre_pdc: number;
    acces_recharge: string;
    puiss_max: number;
    type_prise: string;
    id_bornes: number[];
    available_bornes: boolean[];
};

type catchQueryParameters = { latitude: string; longitude: string };


class EVStationsModel {

    //HelperFunction- This define 10km perimeter around user   
    private async DefinePerimetersArroundUserLocation(catchQueryParameters: catchQueryParameters) 
    {
        const { latitude, longitude } = catchQueryParameters;
        const equivalentOneKilometer = 0.00899; // equivalent of +1km around latitude or longitude

        //Workout Perimeter around a User
        const increaseLatitudeToNorth = Number.parseFloat(latitude) + equivalentOneKilometer * 10;
        const increaseLatitudeToSouth = Number.parseFloat(latitude) - equivalentOneKilometer * 10;
        const increaseLongitudeToEast = Number.parseFloat(longitude) + equivalentOneKilometer * 10;
        const increaseLongitudeToWest = Number.parseFloat(longitude) - equivalentOneKilometer * 10;

        const coordinatesObject = {
            LatitudeNorth: increaseLatitudeToNorth, 
            LatitudeSouth: increaseLatitudeToSouth, 
            longitudeEast: increaseLongitudeToEast, 
            longitudeWest: increaseLongitudeToWest 
        };

        return coordinatesObject;
    }

    //HelperFunction - This rewrite Object return from DB call.
    //Transform 2 entries xlongitude and ylatitude to => //coordinates : [ylatitude, xlongitude]
    private async createCoordinatesEntry(sqlQuerryResult: RowsResult) 
    {
        
        let index = 0;
    
        while(Object.values(sqlQuerryResult)[index]) 
        {

            Object.values(sqlQuerryResult)[index].coordinates = [ Object.values(sqlQuerryResult)[index].ylatitude, Object.values(sqlQuerryResult)[index].xlongitude];
    
            delete Object.values(sqlQuerryResult)[index].xlongitude;
            delete Object.values(sqlQuerryResult)[index].ylatitude;
    
          index++;
        }
    
        return sqlQuerryResult;
    }

    //MainFunction. call DB return Ev stations 10km around location and send a json list of stations  
    async getStationLocalisation(catchQueryParameters: catchQueryParameters) 
    {
        const querryCoords = await this.DefinePerimetersArroundUserLocation(catchQueryParameters);

        //This Join station, bornes, reservation tables on FK and check if available based on start_time and end_time to tell if borne is available| return in json dynamic entry available_bornes[boolean]; 
        const [rows] = await SQL.query<RowsResult>(
          "SELECT s.*, JSON_ARRAYAGG(b.id) AS id_bornes, JSON_ARRAYAGG(CASE WHEN EXISTS (SELECT 1 FROM reservation r WHERE r.borne_id = b.id AND NOW() BETWEEN r.start_time AND r.end_time AND (r.status IS NOT NULL AND r.status != 'cancelled')) THEN 0 ELSE 1 END) AS available_bornes FROM station s JOIN bornes b ON s.id = b.station_id WHERE ylatitude BETWEEN ? AND ? AND xlongitude BETWEEN ? AND ? GROUP BY s.id ORDER BY s.id ASC LIMIT 50",
          [
            querryCoords.LatitudeSouth,
            querryCoords.LatitudeNorth,
            querryCoords.longitudeWest,
            querryCoords.longitudeEast,
          ],
        );
    
        await this.createCoordinatesEntry(rows);

        return rows as localisation[];
      }

}

export default new EVStationsModel();