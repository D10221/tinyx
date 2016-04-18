export class Tab2VieModel {
    key;
    value;

    constructor(params) {
        console.log('Tab2');
        console.log(params);
        this.key = params.key;
        this.value = params.value;
        //do something with params
    }
}

