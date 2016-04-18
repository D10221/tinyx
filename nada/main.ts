///<reference path="../typings/tsd.d.ts"/>
///<reference path="../src/reference.d.ts"/>


(function () {

    var loginDialog = <Dialog>document.getElementById('login-dialog');
    
    interface Dialog extends HTMLElement{
        showModal();
        close();
    }

    class User {
        constructor(public username: string, public password: string) {

        }
    }

    class LoginDialogViewModel {

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

            wx.messageBus.listen("login-dialog-show").subscribe(e=> this.show());

            this.rememberme(true);

            this.loadUser = () => {
               // console.log('maybe loading user');
                if (this.rememberme) {
                    var user:User = JSON.parse(localStorage.getItem('tinyx.user'));
                   // console.log(user);
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
                
                this.error("");
                
                this.busy(true);

                Rx.Observable.timer(1000, 500).take(1).subscribe(()=>{
                    
                    this.busy(false);
                    
                    if(this.username() == "admin" && this.password() == "password ") {
                        
                        //console.log(`login ins as ${this.username()}: ${this.password()}`);

                        this.close();
                        
                    } else {
                        
                        this.error("Bad username || password ");
                    }
                    
                });

            };
        }

        hasError = wx.property(false);
        
        error = wx.property("");
        
        busy = wx.property(false);

        private loadUser: ()=> void;
        private saveUser: ()=> void;


    }

    class MainViewModel {

        brand = wx.property("Brilliant|Link...");

        isBusy = wx.property(false);

        showLoginCmd = wx.command(()=> wx.messageBus.sendMessage({ x: "1"}, "login-dialog-show"));

        constructor() {


            this.loadConfig = ()=> {

                this.isBusy(true);

                Rx.Observable.timer(1000, 500)
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


    wx.app.component('plain-link',{
        template:`
            <a data-bind="attr: {href: link}" ><span data-bind="text: label"></span></a>
        `,
        /***
         * LinkViewModel
         * @param params is an object whose key/value pairs are the parameters, passed from the component binding or custom element.
         */
        viewModel: ( params )=> {
            console.log(params)
            return {
                link: ( params.link ? params.link : "/help" ),
                label: ( params.label ? params.label : "???" )
            };
        }
    });

    wx.applyBindings(new MainViewModel(), document.getElementById("main-view"));

    wx.applyBindings(new LoginDialogViewModel(loginDialog), document.getElementById("login-dialog"));
    
})();