// function log<T>(value: T): T {
//     console.log(value);
//     return value;
// }


// type Log = <T>(value: T) => T;
// let myLog: Log = log;
// myLog<string>('a');

// type Log<T> = (value: T) => T;
// let myLog: Log<number> = log;
// myLog(1);

// interface Log {
//     <T>(value: T): T
// }
// let myLog: Log = log;
// myLog<string>('a');

// interface Log<T> {
//     (value: T): T
// }
// let myLog: Log<string> = log;
// myLog('a');

class log<T> {
    run(value: T) {
        console.log(value);
        return value;
    }
}

let l = new log<number>();
l.run(11)

