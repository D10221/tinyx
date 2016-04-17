// webpack ts loader needs it
///<reference path="./LoginDialogViewModel.ts"/>
///<reference path="./mdl.ts"/>


import Observable = Rx.Observable;

import IObservableProperty = wx.IObservableProperty;

import {Dialog} from "./definitions";

import {LoginDialogViewModel} from "./LoginDialogViewModel";

import MaterialSnackBarContainer = mdl.MaterialSnackBarContainer;

import SnackBarMessageData = mdl.SnackBarMessageData;

var loginDialog = <Dialog>document.getElementById('login-dialog');

var snackbarContainer = <MaterialSnackBarContainer>document.querySelector('#material-snackBar-container');

wx.messageBus
    .listen("tinyx-snackbar-show")
    .subscribe(message=> snackbarContainer.MaterialSnackbar.showSnackbar(<SnackBarMessageData>message));

export class MainViewModel {

    brand = wx.property("Brilliant|Link...");

    isBusy = wx.property(false);

    showLoginDialogCmd = wx.command(()=> wx.messageBus.sendMessage({}, "login-dialog-show"));

    private loadConfig :() => void;

    constructor() {

        this.loadConfig = ()=> {

            this.isBusy(true);

            Observable.timer(1000, 500)
                .take(1)
                .subscribe( e => {

                    fetch('../data/app_settings.json')
                        .then(r=> r.json())
                        .then(config=> {
                            this.brand(config.brand || this.brand());
                            this.isBusy(false);
                            console.log("fetch config complete")
                        }).catch(e=> {

                        console.log(e);
                        this.isBusy(false);
                    });

                });
        };

        this.loadConfig();
    }
}

wx.router.state({
    name: "home",
    views: {'main': "hello"}
});

wx.router.go('home');


wx.applyBindings(new MainViewModel(), document.getElementById("main-view"));

wx.applyBindings(new LoginDialogViewModel(loginDialog), document.getElementById("login-dialog"));

//wx.applyBindings(new SnackBarViewModel(snackbarContainer), snackbarContainer);

Observable
    .timer(3000, 0)
    .take(1)
    .subscribe( e =>
        wx.messageBus
            .sendMessage(<SnackBarMessageData>{
                message: "Hello", timeout: 2000, actionHandler: ()=> {}, actionText: "undo"
            }, "tinyx-snackbar-show") );