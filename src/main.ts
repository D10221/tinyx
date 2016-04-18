// webpack ts loader needs this refs
///<reference path="./LoginDialogViewModel.ts"/>
///<reference path="./mdl.ts"/>
///<reference path="./reference.d.ts"/>
///<reference path="./MainViewModel.ts"/>


import {Dialog} from "./definitions";
import {LoginDialogViewModel} from "./LoginDialogViewModel";
import {LoginButtonViewModel} from "./LoginButtonViewModel";
import {MainViewModel} from "./MainViewModel";
import {Tab2VieModel} from "./components/tab2/Tab2VieModel";

import Observable = Rx.Observable;
import IObservableProperty = wx.IObservableProperty;
import MaterialSnackBarContainer = mdl.MaterialSnackBarContainer;
import SnackBarMessageData = mdl.SnackBarMessageData;
import {MaterialsViewModel} from "./components/materials/MaterialsViewModel";


wx.app.devModeEnable();

var loginDialog = <Dialog>document.getElementById('login-dialog');

var snackbarContainer = <MaterialSnackBarContainer>document.querySelector('#material-snackBar-container');

wx.messageBus
    .listen("tinyx-snackbar-show")
    .subscribe(message=> snackbarContainer.MaterialSnackbar.showSnackbar(<SnackBarMessageData>message));

wx.router.state({
    name: "home",
    views: {'main': "hello"}
});

wx.router.go('home');

wx.app.component('login-button', {
   viewModel:  ()=> new LoginButtonViewModel(),
    template: require('../templates/login-button-template.html')
});

wx.app.component('tab-two', {
    template: require('../src/components/tab2/tab2-template.html'),
    viewModel: (params)=> new Tab2VieModel(params)
});

wx.app.component('plain-link',{
    template:`
            <a data-bind="attr: {href: link}" ><span data-bind="text: label"></span></a>
        `,
    /***
     * LinkViewModel
     * @param params is an object whose key/value pairs are the parameters, passed from the component binding or custom element.
     */
    viewModel: ( params )=> {
        return {
            link: ( params.link ? params.link : "/help" ),
            label: ( params.label ? params.label : "???" )
        };
    }
});

wx.app.component('materials', {
    template: require('../src/components/materials/materials-template.html'),
    viewModel: (params)=> new MaterialsViewModel({x: 1}),
    preBindingInit: 'preBindingInit',
    postBindingInit: 'postBindingInit',
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


