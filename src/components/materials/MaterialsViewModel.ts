///<reference path="../../mdl.ts"/>

import IDisposable = Rx.IDisposable;

interface Material {
    material:string;
    quantity: number;
    unitPrice: number;
    tax: number;
}

class MaterialViewModel {

    material = wx.property("");
    quantity = wx.property(0);
    unitPrice =  wx.property(0);
    tax =  wx.property(0);
    selected= wx.property(false);
    editing = wx.property(false);
    toggleEdit = wx.command(()=> this.editing(!this.editing()));

    constructor(private _material:Material,public id) {
        this.material(_material.material);
        this.quantity(_material.quantity);
        this.unitPrice(_material.unitPrice);
        this.tax(_material.tax);
                
    }
    
    dispose(){
        this.material.dispose();
        this.quantity.dispose();
        this.unitPrice.dispose();
        this.tax.dispose();
        this.selected.dispose();
    }
}

export class MaterialsViewModel {

    private _materials : Material[];

    private materials = wx.list<MaterialViewModel>();

    private filter : (m:Material) => boolean ;

    error =  wx.property('');

    isBusy = wx.property(false);

    private fetchMaterials: ()=> void;

    preBindingInit: any;

    postBindingInit: any;

    toggleSelectionCmd = wx.command(()=>{
        this.materials.forEach(x=> x.selected(!x.selected()));
        componentHandler.upgradeAllRegistered();
    });

    constructor(params) {

        this.preBindingInit =  (el, vm /*undefined*/)=> {
            console.log('MaterialsViewModel:preBindingInit');
            console.log(vm);
            console.log(el);
        };

        this.postBindingInit = (el, vm /*undefined*/)=> {             
            componentHandler.upgradeAllRegistered();
        };

        // do something with params
        console.log(params);

        this.filter = m => true;

        this.fetchMaterials = ()=> {

            this.isBusy(true);

            this.error("");

            fetch('../data/materials.json')
                .then(r=>r.json())
                .then(materials=> {

                    console.log('got materials');
                    console.log(materials);

                    this._materials = materials;

                    this.materials.clear();
                   
                    this.mapMaterials();

                    this.isBusy(false);
                }).catch(e=> {
                this.error(e.message);
                this.isBusy(false);
            });

        };

        this.fetchMaterials();
    }
    mapMaterials : () => void  = ()=>{
        var id = 0;
        this.materials.forEach(x=> x.dispose());
        this.materials.addRange(
            this._materials.map(m=>
                new MaterialViewModel(m, `material_${id++}`)));

        componentHandler.upgradeAllRegistered();
    };

    private applyFilter(materials: Material[], filter: (m:Material)=> boolean ) {
        return materials && filter ?
            _.filter(materials, filter) : [];
    }
}