/*
*  Name: ???
* */


export interface Dialog extends HTMLElement{
    showModal();
    close();
}

export interface MaybeError {
    error?:string;
}

export interface UserData extends MaybeError {
    username:string;
    token?:string;
    roles?:string[];
}

/***
 * https://github.com/danylaporte/Rebuild-Framework/blob/master/Rebuild.TypeScript/guid.ts
 */
export class Guid {
    private id: string;
    private static emptyGuid = new Guid("00000000-0000-0000-0000-000000000000");
    constructor(id: string) {
        this.id = id.toLowerCase();
    }
    static empty() {
        return Guid.emptyGuid;
    }
    static newGuid() {
        return new Guid(
            Guid.s4() + Guid.s4() + '-' + Guid.s4() + '-' + Guid.s4() + '-' +
            Guid.s4() + '-' + Guid.s4() + Guid.s4() + Guid.s4()
        );
    }
    static regex(format?: string) {
        switch (format) {
            case 'x':
            case 'X':
                return (/\{[a-z0-9]{8}(?:-[a-z0-9]{4}){3}-[a-z0-9]{12}\}/i);

            default:
                return (/[a-z0-9]{8}(?:-[a-z0-9]{4}){3}-[a-z0-9]{12}/i);
        }
    }
    private static s4() {
        return Math
            .floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    toString(format: string) {
        switch (format) {
            case "x":
            case "X":
                return "{" + this.id + "}";

            default:
                return this.id;
        }
    }
    valueOf() {
        return this.id;
    }
}

export interface IHaveId {
    idx: Guid;
}