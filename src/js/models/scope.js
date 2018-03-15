export default  class Scope {

    constructor(data, type){
        this._id = data.id;
        this._pin = data.pin;
        this._balance = data.balance;
        this._dateofcreate = data.dateofcreate;
        this._changehistory = data.changehistory;
        this._typeofscope = data.typeofscope;
        this._secretword = data.secretword;
        this._fname = data.fname;
        this._lname = data.lname;
        this._nationality = data.nationality;
    }

	get getId(){
		return this._id;
    }    

	get getPIN(){
		return this._pin;
    }
    
	set setPIN(pin) {
		this._pin = pin;
	}

	get getBalance(){
		return this._balance;
	}
	set setBalance(balance) {
		this._balance = balance;
	}

	get getDateOfCreate(){
		return this._dateofcreate;
	}
	set setDateOfCreate(dateofcreate) {
		this._dateofcreate = dateofcreate;
	}

	get getChangeHistory(){
		return this._changehistory;
	}
	set setChangeHistory(changehistory) {
		this._changehistory = changehistory;
    }

    get getTypeOfScope(){
		return this._typeofscope;
    }
    
	set setTypeOfScope(typeofscope) {
		this._typeofscope = typeofscope;
    }
    get getSecretWord(){
		return this._secretword;
	}
	set setSecretWord(secretword) {
		this._secretword = secretword;
    }
    get getFName(){
		return this._fname;
	}
	set setFName(fname) {
		this._fname = fname;
    }
    get getLName(){
		return this._lname;
	}
	set setLName(lname) {
		this._lname = lname;
    }
    get getNationality(){
		return this._nationality;
	}
	set setNationality(nationality) {
		this._nationality = nationality;
	}
}