'use strict';

var DDWAApp = (function () {
	return {
		Models: {
            Scope:{},
            CalculatedScope:{},
            CumulativeScope:{}
		},
		MakeupManager: {
			MakeupCreator: {},
			FormReader: {},
            ElementsEventsProvider: {},
            ScopesFormValidator: {}
		},
		ScopesService: {},
		CONSTANTS: { 
			SERVICE_URL: 'http://localhost:3000/scopes',
			TABLE_ID: 'scopesList',
            DETAILS_TABLE_ID: 'tableDetails',
            FORM_SCOPE_ID: 'formScope',
            CREATE_PART: 'createPart',
            LIST_PART: 'showPart',
            CREATE_SCOPE_BUTTON: 'createScope',
            CREATE_BUTTONS_ID: 'createButtons'
		}
	};
})();

DDWAApp.Models.Scope = function (type) {
	var _id;
	var _pin;
	var _balance;
	var _dateofcreate;
    var _changehistory;
    var _typeofscope;
    var _secretword;
    var _fname;
    var _lname;
    var _nationality;

	this.initialize = function(data){
		_id = data.id;
		_pin = data.pin;
		_balance = data.balance;
		_dateofcreate = data.dateofcreate;
        _changehistory = data.changehistory;
        _typeofscope = data.typeofscope;
        _fname = data.fname;
        _lname = data.lname;
        _nationality = data.nationality;
        _secretword = data.secretword;
	}

	this.getId = function () {
		return _id;
    }    

	this.getPIN = function () {
		return _pin;
	}
	this.setPIN = function (pin) {
		_pin = pin;
	}

	this.getBalance = function () {
		return _balance;
	}
	this.setBalance = function (balance) {
		_balance = balance;
	}

	this.getDateOfCreate = function () {
		return _dateofcreate;
	}
	this.setDateOfCreate = function (dateofcreate) {
		_dateofcreate = dateofcreate;
	}

	this.getChangeHistory = function () {
		return _changehistory;
	}
	this.setChangeHistory = function (changehistory) {
		_changehistory = changehistory;
    }

    this.getTypeOfScope = function () {
		return _typeofscope;
    }
    
	this.setTypeOfScope = function (typeofscope) {
		_typeofscope = typeofscope;
    }
    this.getSecretWord = function () {
		return _secretword;
	}
	this.setSecretWord = function (secretword) {
		_secretword = secretword;
    }
    this.getFName = function () {
		return _fname;
	}
	this.setFName = function (fname) {
		_fname = fname;
    }
    this.getLName = function () {
		return _lname;
	}
	this.setLName = function (lname) {
		_lname = lname;
    }
    this.getNationality = function () {
		return _nationality;
	}
	this.setNationality = function (nationality) {
		_nationality = nationality;
	}
}

DDWAApp.Models.CalculatedScope = function(data){
    DDWAApp.Models.Scope.call(this, true);

    var _persentinrate;
    var _mounth;

	var parentinitialize = this.initialize;
	this.initialize = function (data) {
        parentinitialize.call(this, data);
        _persentinrate = data.persentinrate;
        _mounth = data.mounth;
    }
    
    this.getPersentInarate = function () {
		return _persentinrate;
    }
    
	this.setPersentInarate = function (persentinrate) {
		_persentinrate = persentinrate;
    }
    
    this.getMounth= function () {
		return _mounth;
    }
    
	this.setMounth = function (mounth) {
		_mounth = mounth;
	}
}

DDWAApp.Models.CumulativeScope = function(data){
	DDWAApp.Models.Scope.call(this, false);
    var _year;
	var parentInitialize = this.initialize;
	this.initialize = function (data) {
        parentInitialize.call(this, data);
        _year = data.year;
    }
    this.getYear= function () {
		return _year;
    }
    
	this.setYear = function (year) {
		_year = year;
	}
}

DDWAApp.MakeupManager.ElementsEventsProvider = function(){
    var self = this || {};
    var isUpdateEvent = false;

    self.moveToScopeDetails = function (id, type) {
        if (isUpdateEvent === true) {
            isUpdateEvent = false;
            return;
        }
        setDisplaySettings('none', 'none', '', 'none', 'none');
		DDWAApp.ScopesService.getDetails(id, DDWAApp.MakeupManager.MakeupCreator.createScopeDetails);
    };

    self.moveToChangeScope = function (id) {
        isUpdateEvent = true;
        setDisplaySettings('none', '', 'none', 'none', 'none');
        DDWAApp.ScopesService.getDetails(id, DDWAApp.MakeupManager.MakeupCreator.createScopeForm);
    }

    self.moveToDeleteScope = function (id) {
        isUpdateEvent = true;
        DDWAApp.ScopesService.deleteScope(id);
    }

    self.moveToCreateScopeForm = function (isTypeOfScope) {
        setDisplaySettings('none', '', 'none', 'none', '', isTypeOfScope);
        DDWAApp.MakeupManager.MakeupCreator.createScopeForm(isTypeOfScope ? new DDWAApp.Models.CalculatedScope() : new DDWAApp.Models.CumulativeScope(), false);
    }

    self.moveToListScopes= function () {
        setDisplaySettings('', 'none', 'none', '', 'none');
        DDWAApp.ScopesService.getAll();
    };

    self.createScope = function (event) {
        if (DDWAApp.MakeupManager.ScopesFormValidator.isValidForm(event)) {
            DDWAApp.ScopesService.addScope(event);

        } else {
            if (event.preventDefault) event.preventDefault();
        }
    }

    function setDisplaySettings(listTable, scopeForm, detailsTable, createScopeButton, createButtons, isTypeOfScope) {
        document.getElementById(DDWAApp.CONSTANTS.LIST_PART).style.display = listTable;
        document.getElementById(DDWAApp.CONSTANTS.CREATE_PART).style.display = scopeForm;
        document.getElementById(DDWAApp.CONSTANTS.DETAILS_TABLE_ID).style.display = detailsTable;
        document.getElementById(DDWAApp.CONSTANTS.CREATE_SCOPE_BUTTON).style.display = createScopeButton;
        document.getElementById(DDWAApp.CONSTANTS.CREATE_BUTTONS_ID).style.display = createButtons;
    }

	return self;
}();

DDWAApp.MakeupManager.MakeupCreator = function () {

	var self = this || {};

	self.createScopesTable = function (scopes) {
        var table = document.getElementById(DDWAApp.CONSTANTS.TABLE_ID);
        clearTable(table);
		for (var i = 0; i < scopes.length; i++) {
            var tr = document.createElement("tr");
            tr.setAttribute("onclick", "DDWAApp.MakeupManager.ElementsEventsProvider.moveToScopeDetails(" + scopes[i].getId() +  ", " + scopes[i].getTypeOfScope() + ");return false;");
            tr.innerHTML = "<td>" + scopes[i].getPIN() + "</td>" +
                "<td>" + scopes[i].getBalance() + "</td>" +
                "<td>" + scopes[i].getDateOfCreate() + "</td>" +
                "<td>" + scopes[i].getChangeHistory() + "</td>" +
                "<td>" + (scopes[i].getTypeOfScope() == true || scopes[i].getTypeOfScope() == "true" ? "Calculated" : "Cumulative") + "</td>" +
                "<td><a style='cursor: pointer;' onclick='DDWAApp.MakeupManager.ElementsEventsProvider.moveToChangeScope(" + scopes[i].getId() + ");return false;'>Change</a> " +
                "<a style='color:red; cursor: pointer;' onclick = 'DDWAApp.MakeupManager.ElementsEventsProvider.moveToDeleteScope(" + scopes[i].getId() + ");return false;'>Delete</a></td>";
            table.tBodies[0].appendChild(tr);
		}
	};

	self.createScopeDetails = function (scope) {
        var table = document.getElementById(DDWAApp.CONSTANTS.DETAILS_TABLE_ID);
        var inner = "<tr><th>pin</th><td>" + scope.getPIN() + "</td></tr>" +
            "<tr><th>balance</th><td>" + scope.getBalance() + "</td></tr>" +
            "<tr><th>date of create</th><td>" + scope.getDateOfCreate() + "</td></tr>" +
            "<tr><th>change history</th><td>" + scope.getChangeHistory() + "</td></tr>" +
            "<tr><th>secret word</th><td>" + scope.getSecretWord() + "</td></tr>" +
            "<tr><th>first name</th><td>" + scope.getFName() + "</td></tr>" +
            "<tr><th>last name</th><td>" + scope.getLName() + "</td></tr>" +
            "<tr><th>nationality</th><td>" + scope.getNationality() + "</td></tr>" +
            "<tr><th>type of scope</th><td>" + (scope.getTypeOfScope() == true || scope.getTypeOfScope() == "true" ? "Calculated" : "Cumulative") + "</td></tr>";
        if (scope instanceof DDWAApp.Models.CalculatedScope ) {
            inner += 
            "<tr><th>persent inrate</th><td>" + scope.getPersentInarate() + "</td></tr>" +
            "<tr><th>count of mounth</th><td>" + scope.getMounth() + "</td></tr>";
        }else { inner += "<tr><th>count of year</th><td>" + scope.getYear() + "</td></tr>"; }
        table.innerHTML = inner;
    };

    self.createScopeForm = function (scope, isUpdate) {
        var form = document.getElementById(DDWAApp.CONSTANTS.FORM_SCOPE_ID);
        var inner = 
            '<div class="form-group">'+
            '<label>pin</label >' +
            '<label style="color: red; display: none;"><br/>Value must contain only numbers and count of characters dont exceed 4.</label >' +
            '<input name="pin" class="form-control" pattern="[0-9][0-9][0-9][0-9]$" type="text" value="' + getValueForField(scope.getPIN()) + '" required/>' +
            '</div>' +
            '<div class="form-group">'+
            '<label>balance</label >' +
            '<label style="color: red; display: none;"><br/>Value must contain only numbers and count of characters dont exceed 5 and common value dont exceed 99999.</label >' +
            '<input name="balance" class="form-control" pattern="^[1-9][0-9]?[0-9]?[0-9]?[0-9]?$|^99999$" type="text" value="' + getValueForField(scope.getBalance()) + '" required/>' +
            '</div>' +
            '<div class="form-group">'+
            '<label>secret word</label >' +
            '<label style="color: red; display: none;"><br/>Value must contain only symbols and count of characters dont exceed 7.</label >' +
            '<input name="secretword" class="form-control" pattern="^[A-Za-z]+$" type="text" value="' + getValueForField(scope.getSecretWord()) + '" required maxlength="7"/>' +
            '</div>' +
            '<div class="form-group">'+
            '<label>first name</label >' +
            '<label style="color: red; display: none;"><br/>Value must contain only symbols and count of characters dont exceed 8.</label >' +
            '<input name="fname" class="form-control" pattern="^[A-Za-z]+$" type="text" value="' + getValueForField(scope.getFName()) + '" required maxlength="8"/>' +
            '</div>' +
            '<div class="form-group">'+
            '<label>last name</label >' +
            '<label style="color: red; display: none;"><br/>Value must contain only symbols and count of characters dont exceed 8.</label >' +
            '<input name="lname" class="form-control" pattern="^[A-Za-z]+$" type="text" value="' + getValueForField(scope.getLName()) + '" required maxlength="8"/>' +
            '</div>' +
            '<div class="form-group">'+
            '<label>nationality</label >' +
            '<label style="color: red; display: none;"><br/>Value must contain only symbols and count of symbols must be two.</label >' +
            '<input name="nationality" class="form-control" pattern="[A-Za-z][A-Za-z]$" type="text" value="' + getValueForField(scope.getNationality()) + '" required/>' +
            '</div>' ;
            if (scope instanceof DDWAApp.Models.CalculatedScope  ){
                inner += 
                '<div class="form-group">'+
                '<label>persentinrate</label >' +
                '<label style="color: red; display: none;"><br/>Value must contain only numbers and count of characters dont exceed 3 and common value dont exceed 100.</label >' +
                '<input name="persentinrate" class="form-control" pattern="^[1-9][0-9]?$|^100$" type="text" value="' + getValueForField(scope.getPersentInarate()) + '" required/>' +
                '</div>' +
                '<div class="form-group">'+
                '<label>count of mounth</label >' +
                '<label style="color: red; display: none;"><br/>Value must contain only numbers and count of characters dont exceed 1 and common value dont exceed 9.</label >' +
                '<input name="mounth" class="form-control" pattern="^[1-9]?$|^9$" type="text" value="' + getValueForField(scope.getMounth()) + '" required/>' +
                '</div>' +
                '<div class="form-group">' +
                '<input class="form-control" name="typeofscope" style="display: none;" value="true"/>' +
                '</div>' ;
            } else {
                inner += 
                '<div class="form-group">' +
                '<input class="form-control" name="typeofscope" style="display: none;" value="false"/>' +
                '</div>' +
                '<div class="form-group">'+
                '<label>count of year</label >' +
                '<label style="color: red; display: none;"><br/>Value must contain only numbers and count of characters dont exceed 1 and common value dont exceed 4.</label >' +
                '<input name="year" class="form-control" pattern="^[1-4]?$|^4$" type="text" value="' + getValueForField(scope.getYear()) + '" required/>' +
                '</div>' ;
            }
        if (!isUpdate) {
            inner += '<input type="submit" value="Create"  class="btn btn-default" onclick="DDWAApp.MakeupManager.ElementsEventsProvider.createScope(this.form);" />';
        } else {
            inner += '<input type="submit" value="Save"  class="btn btn-default" onclick="DDWAApp.ScopesService.updateScope(this.form, ' + scope.getId() + ');" />';
        }
        form.innerHTML = inner;
    };

    function getValueForField(data) {
        return typeof data == 'undefined' ? '' : data;
    }

	function clearTable(table) {
        table.tBodies[0].innerHTML = "";
	}

	return self;
}();

DDWAApp.MakeupManager.FormReader = function () {
	var self = this || {};

	self.getDataForm = function (form) {
        var type = form["typeofscope"].value;
		var data = {};

		if (type == 'true') {
			data = getDataFormCalculatedScope(form);
		} else {
			data = getDataFormCumulativeScope(form);
		};

		return data;
	};

	function getCommonDataFromForm(form) {
        var d = new Date();
        
		var body = {
			pin: form["pin"].value,
            balance: form["balance"].value,
            dateofcreate: d.getFullYear() +" "+ (d.getMonth() + 1) +" "+ d.getDate(),
            changehistory: d.getFullYear() +" "+ (d.getMonth() + 1) +" "+ d.getDate(),
            secretword: form["secretword"].value,
            fname: form["fname"].value,
            lname: form["lname"].value,
            nationality: form["nationality"].value,
			typeofscope: form["typeofscope"].value
		};

		return body
	};

	function getDataFormCalculatedScope(form) {
		var data = getCommonDataFromForm(form);

        data.persentinrate = form["persentinrate"].value;
        data.mounth = form["mounth"].value;

		return data;
	};

	function getDataFormCumulativeScope(form) {
        var data = getCommonDataFromForm(form);
        
        data.year = form["year"].value;

		return data;
	};

	return self;
}();

DDWAApp.MakeupManager.ScopesFormValidator = function() {
    var self = this || {};

    self.isValidForm = function (event) {
        event = (event ? event : window.event);
        var form = event;
        var field;
        var formvalid = true;

        for (var i = 0; i < form.elements.length; i++) {
            field = form.elements[i];
            if (!isInputField(field)) continue;

            if (typeof field.willValidate !== "undefined") {
                if (field.nodeName === "INPUT") {
                    field.setCustomValidity(LegacyValidation(field) ? "" : "error");
                }

                field.checkValidity();
            } else {

                field.validity = field.validity || {};

                field.validity.valid = LegacyValidation(field);
            }

            if (field.validity.valid) {
                field.style.border = "1px solid rgba(0, 0, 0, 0.15)";
                if (field.parentElement.children[1].nodeName !== "INPUT")
                    field.parentElement.children[1].style.display = "none";

            } else {

                field.style.border = "1px solid red";
                field.parentElement.children[1].style.display = "inline-table";

                formvalid = false;
            }

        }

        return formvalid;
    }

    function isInputField(field) {
        return (field.nodeName === "INPUT" || field.nodeName === "TEXTAREA" || field.nodeName !== "SELECT") && field.style.display !== "none" && field.type != "submit";
    }

    function LegacyValidation(field) {

        var
            valid = true,
            val = field.value,
            type = field.getAttribute("type"),
            chkbox = (type === "checkbox" || type === "radio"),
            required = field.getAttribute("required"),
            minlength = field.getAttribute("minlength"),
            maxlength = field.getAttribute("maxlength"),
            pattern = field.getAttribute("pattern");

        if (field.disabled) return valid;

        valid = valid && (!required ||
            (chkbox && field.checked) ||
            (!chkbox && val !== "")
        );

        valid = valid && (chkbox || (
            (!minlength || val.length >= minlength) &&
            (!maxlength || val.length <= maxlength)
        ));

        if (valid && pattern) {
            pattern = new RegExp(pattern);
            valid = pattern.test(val);
        }

        return valid;
    }

    return self;
} ();

DDWAApp.ScopesService = function () {
	var self = this || {};

	self.deleteScope = function (id) {
		var url = DDWAApp.CONSTANTS.SERVICE_URL;
		var xhr = new XMLHttpRequest();
		xhr.open("DELETE", url + '/' + id, true);
		xhr.onload = function () {
			if (xhr.readyState != 4) return;
			if (xhr.status == 200) {
				DDWAApp.ScopesService.getAll();
			}
		}
		xhr.send(null);
	};

	self.getAll = function () {
		var xhr = new XMLHttpRequest();
		xhr.open('GET', DDWAApp.CONSTANTS.SERVICE_URL, true);
		xhr.send();
		xhr.onreadystatechange = function () {
			if (xhr.readyState != 4) return;
			if (xhr.status == 200) {
                var data = JSON.parse(xhr.responseText);    
				var scopes = [];
				for (var i = 0; i < data.length; i++) {
					var scope = createScope(data[i]);
					scopes.push(scope);
				}
				DDWAApp.MakeupManager.MakeupCreator.createScopesTable(scopes);
			}
		}
	};

	self.addScope = function (data) {
		var xhr = new XMLHttpRequest();
		var body = JSON.stringify(DDWAApp.MakeupManager.FormReader.getDataForm(data));

		xhr.open("POST", DDWAApp.CONSTANTS.SERVICE_URL, true);
		xhr.setRequestHeader('Content-Type', 'application/json');

		xhr.onreadystatechange = function () {
			if (xhr.readyState != 4) return;
			DDWAApp.ScopesService.getAll();
		};

		xhr.send(body);
	};

	self.updateScope = function (data, id) {
		var xhr = new XMLHttpRequest();
		var body = JSON.stringify(DDWAApp.MakeupManager.FormReader.getDataForm(data));

		xhr.open("PUT", DDWAApp.CONSTANTS.SERVICE_URL + "/" + id, true);
		xhr.setRequestHeader('Content-Type', 'application/json');

		xhr.onreadystatechange = function () {
			if (xhr.readyState != 4) return;
			DDWAApp.ScopesService.getAll();
		};

		xhr.send(body);
	};
	
	self.getDetails = function (id, callback) {
		var xhr = new XMLHttpRequest();

		xhr.open('GET', DDWAApp.CONSTANTS.SERVICE_URL + "/" +id, true);
		xhr.send();
		xhr.onreadystatechange = function () {
			if (xhr.readyState != 4) return;
			if (xhr.status == 200) {
				var data = JSON.parse(xhr.responseText);
				var scope = createScope(data);

				callback(scope, true);
			}
		}
	};

	function createScope(data) {
		var scope;
        if (data.typeofscope === true || data.typeofscope === 'true') {
			scope = new DDWAApp.Models.CalculatedScope();
			scope.initialize(data);
		} else {
			scope = new DDWAApp.Models.CumulativeScope();
			scope.initialize(data);
		}
		return scope;
	}

	return self;
}();

document.addEventListener("DOMContentLoaded", function (event) {
	DDWAApp.ScopesService.getAll();
});