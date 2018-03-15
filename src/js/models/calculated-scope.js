import Scope from './scope';

export default class CalculatedScope  extends Scope {
    constructor(data) {
        super(data, true);
        this._persentinrate = data.persentinrate;
        this._mounth = data.mounth;
    }
    
    get getPersentInarate(){
		return this._persentinrate;
    }
    
	set setPersentInarate(persentinrate) {
		this._persentinrate = persentinrate;
    }
    
    get getMounth() {
		return this._mounth;
    }
    
	set setMounth(mounth) {
		this._mounth = mounth;
	}
}