import { Database, QueryResult, RowsResult } from "../../Database/DatabaseConnection.js"
import  SQL  from "../../Database/DatabaseConnection.js"

type Bornes = {
    id: number;
    id_station: string;
    station_id: number;
    available: number;
  };
  
  class BookABornesModel {
    // this function parse if a borne is available and return its id to get reserved
    private async returnBorneID(array: RowsResult): Promise<number> {
      for (let i = 0; i < array.length; i++) {
        if (array[i].available === 0) {
          return array[i].id;
        }
      }
      return -1;
    }
  
    async update(id_station: number) {
      const [searchBornes] = await SQL.query<RowsResult>(
        "SELECT * FROM bornes WHERE station_id = ? AND NOT EXISTS(SELECT 1 FROM reservation WHERE reservation.borne_id = bornes.id AND NOW() BETWEEN reservation.start_time AND reservation.end_time)",
        [id_station]
      );
      
      const borne_id_toBook = await this.returnBorneID(searchBornes);

      if (borne_id_toBook === -1) throw new Error("Invalid parameters");

      const fakeUserId = 1;
  
      const [result] = await SQL.query<QueryResult>(
        "INSERT INTO reservation (user_id, borne_id, start_time, end_time) VALUES ( ?, ?, NOW(), DATE_ADD(NOW(), INTERVAL 1 HOUR))",
        [ fakeUserId ,borne_id_toBook]
      );
  
      return result.affectedRows; 
    }
  }
  
  export default new BookABornesModel();