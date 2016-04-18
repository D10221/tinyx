import {UserData} from "./definitions";
/***
 * 
 */
export class LoginButtonViewModel {
    
    showLoginDialogCmd = wx.command(()=> wx.messageBus.sendMessage({}, "login-dialog-show"));
    
    userData: UserData;
    
    constructor() {
        wx.messageBus.listen('tinyx.user.login').subscribe(userData=>{
            this.userData = <UserData>userData;
        })
    }
}