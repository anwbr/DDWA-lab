import { getDetails, getAll, deleteScope, addScope, updateScope } from '../services/scope-http-service';
import { getDataForm } from '../managers/form-reading-manager';
import { createScopeDetails, createScopesTable, createScopeForm } from '../managers/makeup-creating-manager';
import { isValidForm } from '../validators/scopes-from-validator';
import CalculatedScope from '../models/calculated-scope';
import CumulativeScope from '../models/cumulative-scope';
import { searchByValue } from '../helpers/search-helper';
import { setSourtByHeaders } from '../helpers/sort-helper'
import * as CONSTANTS from '../constants';

let isUpdateEvent = false;

export function initMakeupButtonsEvents(){
    let moveToListButton = document.getElementById(CONSTANTS.MOVE_TO_LIST_BUTTON);
    moveToListButton.onclick = function(){
        moveToListScopes(); 
        return false;
    };

    let searchButton = document.getElementById(CONSTANTS.SEARCH_BUTTON);
    searchButton.onclick = function(){
        searchByValue();
        return false;
    }

    let createButton = document.getElementById(CONSTANTS.CREATE_SCOPE_BUTTON);
    createButton.onclick = function(){
        moveToCreateScope(true);
        return false;
    }
}

export function moveToScopeDetails(id, type){
    if (isUpdateEvent === true) {
        isUpdateEvent = false;
        return;
    }
    setDisplaySettings('none', 'none', '', 'none', 'none', 'none');
    getDetails(id).then((scope)=>{
      createScopeDetails(scope);
    });
};

export function moveToUpdateScope(id){
    isUpdateEvent = true;
    setDisplaySettings('none', '', 'none', 'none', 'none', 'none', 'none');
    getDetails(id).then((scope)=>{
        createScopeForm(scope, true);
    });
}

export function moveToDeleteScope(id){
    isUpdateEvent = true;
    deleteScope(id).then(function(data){
        getAll().then((data)=>{
            createScopesTable(data);
        });
    });
}

export function moveToCreateScope(isTypeOfScope){
    setDisplaySettings('none', '', 'none', 'none', '', 'none', isTypeOfScope);
    createScopeForm(isTypeOfScope ? new CalculatedScope({}) : new CumulativeScope({}), false);
}

export function moveToListScopes(){
    setDisplaySettings('', 'none', 'none', '', 'none', 'flex');
    getAll().then((data)=>{
        createScopesTable(data);
    });
};

export function createScopeClick(event){
    if (isValidForm(event)) {
        addScope(getDataForm(event)).then(function(data){
            moveToListScopes();                
        });
    } else {
        if (event.preventDefault) event.preventDefault();
    }
}

export function updateScopeClick(event, id){
    if (isValidForm(event)) {
        updateScope(getDataForm(event), id).then(()=>{
            moveToListScopes();
        });

    } else {
        if (event.preventDefault) event.preventDefault();
    }
}

function setDisplaySettings(listTable, workerForm, detailsTable, createWorkerButton, createButtons, searchSection, isTypeOfScope) {
    document.getElementById(CONSTANTS.LIST_PART).style.display = listTable;
    document.getElementById(CONSTANTS.CREATE_PART).style.display = workerForm;
    document.getElementById(CONSTANTS.DETAILS_TABLE_ID).style.display = detailsTable;
    document.getElementById(CONSTANTS.CREATE_SCOPE_BUTTON).style.display = createWorkerButton;
    document.getElementById(CONSTANTS.CREATE_BUTTONS_ID).style.display = createButtons;
    document.getElementById(CONSTANTS.CREATE_CALCULATED_BUTTON).classList.value = isTypeOfScope ? 'btn btn-info' : 'btn btn-default';
    document.getElementById(CONSTANTS.CREATE_CUMULATIVE_BUTTON).classList.value = isTypeOfScope ? 'btn btn-default' : 'btn btn-info';
    document.getElementById(CONSTANTS.SEARCH_SECTION_ID).style.display = searchSection;
}