import { Database, QueryResult, RowsResult } from "../../Database/DatabaseConnection.js"
import  SQL  from "../../Database/DatabaseConnection.js"

type bornesResult = [{
    id: number; //7869, is id for bornes table
    station_id: number; //3863,
    id_station: string; // 'FRCPIE6506905',
    available: number; // 0 | 1
  }];

 type updated = 1|0;
  
  class BookABornesModel {
    
    private async returnBorneID(array: RowsResult): Promise<number> {
      for (let i = 0; i < array.length; i++) {
        if(array[i].available === 1) {
          return array[i].id;
        }
      }
      return -1;
    }
    
    async update(station_id : number, user_id : number) : Promise<updated | -1>{

      const [searchBornes] = await SQL.query<RowsResult>(
        "select b.id, b.station_id, b.id_station, case when exists (select 1 from reservation r where r.borne_id = b.id and NOW() BETWEEN r.start_time AND r.end_time AND r.status IN ('reserved', 'used') ) then 0 else 1 end as available from bornes b where b.station_id=?",
        [station_id]
      );

      const borne_id_toBook = await this.returnBorneID(searchBornes);

      if(borne_id_toBook === -1) 
      return -1;

      const [result] = await SQL.query<QueryResult>(
        "INSERT INTO reservation (user_id, borne_id, start_time, end_time, status) SELECT ?, ?, NOW(), DATE_ADD(NOW(), INTERVAL 1 HOUR), 'reserved' FROM DUAL WHERE NOT EXISTS ( SELECT 1 FROM reservation WHERE user_id = ? AND NOW() < end_time AND status IN ('reserved', 'used'));",
        [user_id, borne_id_toBook, user_id]
      );

  
      return result.affectedRows as updated; 
    }
  }
  
  export default new BookABornesModel();