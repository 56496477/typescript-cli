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

// class log<T> {
//     run(value: T) {
//         console.log(value);
//         return value;
//     }
// }

// let l = new log<number>();
// l.run(11)

class Student {
    public fullName: string;
    public constructor(
        public firstName: string,
        public middleInitial: string,
        public lastName: string
    ) {
        this.fullName = firstName + ' ' + middleInitial + ' ' + lastName;
    }
}

interface Person {
    fullName: string;
    firstName: string;
    middleInitial: string;
    lastName: string;
}

function greeter(person: Person): string {
    return 'Hello, ' + person.fullName;
}

let user = new Student('a', '2', 'b');
console.log(user);
document.body.innerHTML = greeter(user);
