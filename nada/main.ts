///<reference path="../typings/tsd.d.ts"/>

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

                console.log(`login ins as ${this.username()}: ${this.password()}`);
            };
        }

        private loadUser: ()=> void;
        private saveUser: ()=> void;


    }

    wx.applyBindings(new LoginDialogViewModel(loginDialog), document.body);
    
})();