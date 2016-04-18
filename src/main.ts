// webpack ts loader needs this refs
///<reference path="./LoginDialogViewModel.ts"/>
///<reference path="./mdl.ts"/>
///<reference path="./reference.d.ts"/>


import {Dialog} from "./definitions";
import {LoginDialogViewModel} from "./LoginDialogViewModel";
import {LoginButtonViewModel} from "./LoginButtonViewModel";


import Observable = Rx.Observable;
import IObservableProperty = wx.IObservableProperty;
import MaterialSnackBarContainer = mdl.MaterialSnackBarContainer;
import SnackBarMessageData = mdl.SnackBarMessageData;


var loginDialog = <Dialog>document.getElementById('login-dialog');

var snackbarContainer = <MaterialSnackBarContainer>document.querySelector('#material-snackBar-container');

wx.messageBus
    .listen("tinyx-snackbar-show")
    .subscribe(message=> snackbarContainer.MaterialSnackbar.showSnackbar(<SnackBarMessageData>message));

export class MainViewModel {

    brand = wx.property("?");

    isBusy = wx.property(false);
    
    private loadConfig :() => void;

    constructor() {

        this.loadConfig = ()=> {

            this.isBusy(true);

            Observable.timer(1000, 500)
                .take(1)
                .subscribe( () => {

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

wx.app.component('login-button', {
   viewModel:  ()=> new LoginButtonViewModel(),
    template: require('../templates/login-button-template.html')
});

wx.applyBindings(new MainViewModel(), document.getElementById("main-view"));

wx.applyBindings(new LoginDialogViewModel(loginDialog), loginDialog);


Observable
    .timer(3000, 0)
    .take(1)
    .subscribe( e =>
        wx.messageBus
            .sendMessage(<SnackBarMessageData>{
                message: "Hello", timeout: 2000, actionHandler: ()=> {}, actionText: "undo"
            }, "tinyx-snackbar-show") );