/***
 * store one item as json
 */
export class TinytStore<T> {

    /*
     interface Storage {
     length: number;
     clear(): void;
     getItem(key: string): any;
     key(index: number): string;
     removeItem(key: string): void;
     setItem(key: string, data: string): void;
     [key: string]: any;
     [index: number]: string;
     }
     */

    prefix = "tinyx";

    constructor(private key:string, private storage?:Storage) {

        storage = storage || localStorage;

        this.getItem = ()=> {

            return <T>JSON.parse(storage[`${this.prefix}.${this.key}`]);
        };

        this.setItem = (item)=> {
            storage[`${this.prefix}.${key}`] = JSON.stringify(item);
        };

    }

    getItem:()=> T;

    setItem:(item:T) => void;

    deleteItem(item:T) {
        this.storage.removeItem(`${this.prefix}.${this.key}`);
    }
}