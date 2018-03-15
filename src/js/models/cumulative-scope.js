import Scope from './scope';

export default class CumulativeScope  extends Scope {
    constructor(data) {
        super(data, true);
        this._year = data.year;
    }

    get getYear() {
		return this._year;
    }
    
	set setYear(year) {
		this._year = year;
	}
}