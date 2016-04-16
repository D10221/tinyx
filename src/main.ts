
import Observable = Rx.Observable;

var loginDialog = <tiny.Dialog>document.getElementById('login-dialog');

namespace tiny {


    import Observable = Rx.Observable;

    import IObservableProperty = wx.IObservableProperty;

    export interface Dialog extends HTMLElement{
        showModal();
        close();
    }

    class User {
        constructor(public username: string, public password: string) {

        }
    }

    export class LoginDialogViewModel {

        showCmd =  wx.command(()=> this.show());

        closeCmd = wx.command(()=> this.close());

        loginCmd = wx.command(()=> this.login());

        show : ()=> void;

        close: ()=> void ;

        login: ()=> void;

        label = 'Sign In';

        rememberme = wx.property(false);

        username = wx.property("");

        password = wx.property("");

        constructor(private dialog: Dialog) {

            wx.messageBus.listen('login-dialog-show').subscribe(e=> this.show());

            this.rememberme(true);

            this.loadUser = () => {
                console.log('maybe loading user');
                if (this.rememberme) {
                    var user:User = JSON.parse(localStorage.getItem('tinyx.user'));
                    console.log(user);
                    if (user) {
                        this.username(user.username);
                        this.password(user.password);
                    }
                }
            };

            this.loadUser();
            
            this.show = () => {
                this.dialog.showModal();
            };

            this.close = ()=>{
                this.dialog.close();
            };

            this.saveUser =() => {
                if(this.rememberme){
                    localStorage['tinyx.user'] =
                        JSON.stringify(
                            new User(this.username(), this.password()));
                }
            };

            this.login = ()=> {
              this.close();
                
                console.log(`login in as ${this.username()}: ${this.password()}`);
            };
        }

        private loadUser: ()=> void;
        private saveUser: ()=> void;


    }

    export class MainViewModel {

        brand = wx.property("Brilliant|Link...");

        isBusy = wx.property(false);

        showLoginDialogCmd = wx.command(()=> wx.messageBus.sendMessage({}, "login-dialog-show"));

        constructor() {

            this.loadConfig = ()=> {

                this.isBusy(true);

                Observable.timer(1000, 500)
                    .take(1)
                    .subscribe(e=> {

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

        private loadConfig() {

        }
    }
}


wx.router.state({
    name: "home",
    views: {'main': "hello"}
});


wx.router.go('home');

var mainViewModel = new tiny.MainViewModel();

wx.applyBindings(mainViewModel, document.getElementById("main-view"));

wx.applyBindings(new tiny.LoginDialogViewModel(loginDialog), document.getElementById("login-dialog"));

// Observable.timer(500, 500).subscribe(e=> {
//     mainViewModel.loginDialogViewModel.rememberme(
//         !mainViewModel.loginDialogViewModel.rememberme()
//     );
// });
