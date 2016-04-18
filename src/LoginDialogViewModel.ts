/*
 *
 * */

import {Dialog, UserData, Guid, IHaveId} from "./definitions";

import SnackBarMessageData = mdl.SnackBarMessageData;

import Observable = Rx.Observable;

import {TinytStore} from "./TinytStore";


export class LoginDialogViewModel implements IHaveId {

    idx = Guid.newGuid();

    store = new TinytStore<UserData>("user");

    showCmd = wx.command(()=> this.show());

    closeCmd = wx.command(()=> { 
        if(this.signedIn()){
            this.close();
        }
    });

    loginCmd = wx.command(()=> this.login());

    show:()=> void;

    close:()=> void;

    login:()=> void;

    label = wx.property('Sign In');

    rememberme = wx.property(false);

    username = wx.property("");

    private userData:UserData;

    isBusy =  wx.property(false);

    error = wx.property("?");

    getPassword():string {
        var inputElement = (<HTMLInputElement>this.dialog.getElementsByClassName("password")[0]);
        return inputElement ? inputElement.value : "";
    }

    signedIn =  wx.property(false);
    
    constructor(private dialog:Dialog) {

        wx.messageBus.listen('login-dialog-show').subscribe(e=> this.show());

        var loadUser = () => {

            var user:UserData = this.store.getItem();
            if (user && user.username && user.username != '') {

                this.userData = user;
                this.username(user.username);
                this.rememberme(true);
                this.signedIn(true);
                this.label("Sign out");
                
                console.log(this.userData);
            }
        };

        loadUser();

        this.show = () => {
            this.dialog.showModal();
        };

        this.close = ()=> {
            this.dialog.close();
        };

        this.login = ()=> {

            this.error("");

            this.isBusy(true);

            // Signing out
            if(this.signedIn()){

                //Simulate dealey
                Observable.timer(1000,0).take(1).subscribe( () =>{

                    this.isBusy(true);

                    this.username("");
                    this.signedIn(false);
                    this.label("Sign In");
                    this.userData = null;
                    this.updateStore();

                    wx.messageBus.sendMessage(null, "tinyx.user.login");

                    this.isBusy(false);

                    this.updateStore();
                });

                return;
            }

            var password = this.getPassword();
            //Simulate delay: call to authenticate , gets token and roles
            Observable.timer(1000, 0).take(1).subscribe(()=> {

                if (this.username() != "admin" || password != "password") {
                    //FAIL
                    wx.messageBus.sendMessage(null, "tinyx.user.login");
                    this.error("BAD username || password");

                } else {

                    this.label("Sign out");
                    
                    this.signedIn(true);

                    this.userData = {username: this.username(), token: "0123456789ABCDEF", roles: ["admin"]};

                    this.updateStore();

                    wx.messageBus.sendMessage(this.userData, "tinyx.user.login");

                    this.close();
                }

                this.isBusy(false);
            });

        };
        
        if(!this.signedIn()){
            this.show();
        }
    }

    private updateStore() {
        if (this.rememberme) {
            console.log(`updating ${this.userData ? this.userData.toString(): "{}"}`);
            this.store.setItem(this.userData);
        } else {
            console.log(`removing ${this.userData ? this.userData.toString(): "{}"}`);
            this.store.deleteItem(this.userData);
        }
    }


}