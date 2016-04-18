export class LoginButtonViewModel {
    showLoginDialogCmd = wx.command(()=> wx.messageBus.sendMessage({}, "login-dialog-show"));
}