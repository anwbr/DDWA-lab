import { getAll } from '../services/scope-http-service';
import { createScopesTable } from '../managers/makeup-creating-manager';
import * as CONSTANTS from '../constants';

export async  function searchByValue(){
    let searchData = $('#'+CONSTANTS.SEARCH_INPUT_ID).value;
    let data = await getAll();
        let scopes  = data.filter(item=>{
            if(item.getFName.includes(searchData) || item.getLName.includes(searchData) || item.getPIN.includes(searchData)  )
                return true;
        });
    createScopesTable(scopes);
};
