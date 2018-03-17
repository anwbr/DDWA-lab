import { getDetails, getAll, deleteScope, addScope, updateScope } from '../services/scope-http-service';
import { getDataForm } from '../managers/form-reading-manager';
import { createScopeDetails, createScopesTable, createScopeForm, reloadTable } from '../managers/makeup-creating-manager';
import { isValidForm } from '../validators/scopes-from-validator';
import CalculatedScope from '../models/calculated-scope';
import CumulativeScope from '../models/cumulative-scope';
import { searchByValue } from '../helpers/search-helper';
import { setSourtByHeaders } from '../helpers/sort-helper'
import * as CONSTANTS from '../constants';

let isUpdateEvent = false;

export function initMakeupButtonsEvents(){
    $('#'+CONSTANTS.MOVE_TO_LIST_BUTTON).click(function(){
        moveToListScopes(); 
        return false;
    });
}

export function initTableHendlers(){
        $('#'+CONSTANTS.CREATE_SCOPE_BUTTON).click(function () {
            moveToCreateScope(true);
        });
        $('.detailsScopeBtn').click(function (event) {
            moveToScopeDetails(event.currentTarget.value);
        });
        $('.deleteScopeBtn').click(function (event) {
             moveToDeleteScope(event.currentTarget.value);
        });
        $('.editScopeBtn').click(function (event) {
            moveToUpdateScope(event.currentTarget.value);
        });
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
    setDisplaySettings('none', '', 'none', 'none', 'none', 'none');
    getDetails(id).then((scope)=>{
        createScopeForm(scope, true);
    });
}

export function moveToDeleteScope(id){
    isUpdateEvent = true;
    deleteScope(id).then(function(data){
        getAll().then((data)=>{
            reloadTable();
        });
    });
}

export function moveToCreateScope(isTypeofScope){
    setDisplaySettings('none', '', 'none', 'none', '', 'none', isTypeofScope);
    createScopeForm(isTypeofScope ? new CalculatedScope({}) : new CumulativeScope({}), false);
}

export function moveToListScopes(){
    setDisplaySettings('', 'none', 'none', '', 'none', 'flex');
    getAll().then((data)=>{
        reloadTable();
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

function setDisplaySettings(listTable, scopeForm, detailsTable, createscopeButton, createButtons, searchSection, isFactoryscope) {
    $('#'+CONSTANTS.LIST_PART).css('display',listTable);
    $('#'+CONSTANTS.CREATE_PART).css('display',scopeForm);
    $('#'+CONSTANTS.DETAILS_TABLE_ID).css('display', detailsTable);
    $('#'+CONSTANTS.CREATE_SCOPE_BUTTON).css('display', createscopeButton);
    $('#'+CONSTANTS.CREATE_BUTTONS_ID).css('display', createButtons);
    $('#'+CONSTANTS.CREATE_CALCULATED_BUTTON).addClass(isFactoryscope ? 'btn btn-info' : 'btn btn-default');
    $('#'+CONSTANTS.CREATE_CUMULATIVE_BUTTON).addClass(isFactoryscope ? 'btn btn-default' : 'btn btn-info');
   // document.getElementById(CONSTANTS.SEARCH_SECTION_ID).style.display = searchSection;
}