declare module mdl {

    export interface SnackBarMessageData {
        message : string;
        timeout: number ;
        actionHandler: ()=> void;
        actionText
    }
    
    export interface MaterialSnackbar {
        showSnackbar ( data: SnackBarMessageData) ;
    }

    export interface MaterialSnackBarContainer extends HTMLElement{
        MaterialSnackbar: MaterialSnackbar
    }
}