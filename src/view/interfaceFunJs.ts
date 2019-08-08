// function add(x: number, y?: number) {
//     return y ? x + y : x;
// }

interface Add {
    (x: number, y: number): number
}

// type Add = (x: number, y: number) => number;


let add: Add = (x, y) => x + y;


interface Lib {
    (): void;
    version: string,
    doSomething(): void
}

function getLib() {
    let lib: Lib = (() => {}) as Lib;
    lib.version = '1.0.0';
    lib.doSomething = () => {}
    return lib;
}

let lib1 = getLib();

lib1.doSomething();

function addz(...rest: number[]): number;
function addz(...rest: string[]): string;
function addz(...rest: any[]) {
    let first = rest[0];
    if (typeof first === 'number') {
        return rest.reduce((pre, cur) => pre + cur);
    }
    if (typeof first === 'string') {
        return rest.join('');
    }
}
console.log(addz(1, 2, 3));
console.log(addz('a', 'b', 'c'));