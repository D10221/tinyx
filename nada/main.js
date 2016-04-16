///<reference path="../typings/tsd.d.ts"/>
(function () {
    var loginDialog = document.getElementById('login-dialog');
    var User = (function () {
        function User(username, password) {
            this.username = username;
            this.password = password;
        }
        return User;
    }());
    var LoginDialogViewModel = (function () {
        function LoginDialogViewModel(dialog) {
            var _this = this;
            this.dialog = dialog;
            this.showCmd = wx.command(function () { return _this.show(); });
            this.closeCmd = wx.command(function () { return _this.close(); });
            this.loginCmd = wx.command(function () { return _this.login(); });
            this.label = 'Sign In';
            this.rememberme = wx.property(false);
            this.username = wx.property("");
            this.password = wx.property("");
            wx.messageBus.listen("login-dialog-show").subscribe(function (e) { return _this.show(); });
            this.rememberme(true);
            this.loadUser = function () {
                console.log('maybe loading user');
                if (_this.rememberme) {
                    var user = JSON.parse(localStorage.getItem('tinyx.user'));
                    console.log(user);
                    if (user) {
                        _this.username(user.username);
                        _this.password(user.password);
                    }
                }
            };
            this.loadUser();
            this.show = function () {
                _this.dialog.showModal();
            };
            this.close = function () {
                _this.dialog.close();
            };
            this.saveUser = function () {
                if (_this.rememberme) {
                    localStorage['tinyx.user'] =
                        JSON.stringify(new User(_this.username(), _this.password()));
                }
            };
            this.login = function () {
                _this.close();
                console.log("login ins as " + _this.username() + ": " + _this.password());
            };
        }
        return LoginDialogViewModel;
    }());
    var MainViewModel = (function () {
        function MainViewModel() {
            var _this = this;
            this.brand = wx.property("Brilliant|Link...");
            this.isBusy = wx.property(false);
            this.showLoginCmd = wx.command(function () { return wx.messageBus.sendMessage({ x: "1" }, "login-dialog-show"); });
            this.loadConfig = function () {
                _this.isBusy(true);
                Rx.Observable.timer(1000, 500)
                    .take(1)
                    .subscribe(function (e) {
                    fetch('../data/app_settings.json')
                        .then(function (r) { return r.json(); })
                        .then(function (config) {
                        _this.brand(config.brand || _this.brand());
                        _this.isBusy(false);
                        console.log("fetch config complete");
                    }).catch(function (e) {
                        console.log(e);
                        _this.isBusy(false);
                    });
                });
            };
            this.loadConfig();
        }
        MainViewModel.prototype.loadConfig = function () {
        };
        return MainViewModel;
    }());
    wx.applyBindings(new MainViewModel(), document.getElementById("main-view"));
    wx.applyBindings(new LoginDialogViewModel(loginDialog), document.getElementById("login-dialog"));
})();
