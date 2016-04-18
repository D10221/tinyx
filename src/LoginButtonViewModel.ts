import {UserData} from "./definitions";
/***
 * 
 */
export class LoginButtonViewModel {
    
    showLoginDialogCmd = wx.command(()=> wx.messageBus.sendMessage({}, "login-dialog-show"));
    
    private userData: UserData;

    username = wx.property('?');

    constructor() {
        wx.messageBus.listen('tinyx.user.login').subscribe(userData=>{
            this.userData = <UserData>userData;
            if(this.userData){
                this.username(this.userData.username);
                return;
            }
            this.username("?");
        })
    }
}