import {mapJSONToScope} from '../mappers/factory-mapper';
import {ScopeIterator} from '../helpers/scope-iterator';
import * as CONSTANTS from '../constants';

export async function deleteScope(id){
        let data = sendGetMethod('DELETE', '/' + id);
        return data;
};

export async function getAll(){
        let data = await sendGetMethod('GET', '');
                let scopes = [];
                ScopeIterator.scopes = data; 

                for(let item of ScopeIterator[Symbol.iterator]()){
                    let scope = mapJSONToScope(item);
                    scopes.push(scope);
                }
        return scopes;
};

export async function addScope(data){
        let result = await sendPostMethod('POST', CONSTANTS.SERVICE_URL, data);
        return result;
};

export async function updateScope(data, id){
        let result = await sendPostMethod('PUT', CONSTANTS.SERVICE_URL +"/"+id, data);
        return result;
};

export async function getDetails(id){
        let data = await sendGetMethod('GET', '/' + id);
        let scope = mapJSONToScope(data);
        return scope;
};

async function sendGetMethod(method, params) {
    let options= {
        method: method,
        headers: {
            'Content-Type': 'application/json; charset=utf-8'
        }
    };

    let response = await fetch(CONSTANTS.SERVICE_URL + params, options);
    let data = await response.json();

    return data;
}

async function sendPostMethod(method, url, body) {
    let options = {
        method: method,
        headers: {
            'Content-Type': 'application/json; charset=utf-8'
        },
        body: JSON.stringify(body)
    };

    let result = await fetch(url, options);
    let data = await result.json();

    return data;
}
