import Observable = Rx.Observable;

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