class Dog {
    constructor(name: string) {
        this.name = name;
        this.run();
    }
    name: string
    readonly age: number = 22
    static bones: string = 'bones'
    run() {
        console.log('run');
    }
}
// console.log(Dog.prototype);
let d = new Dog('wangwang2');
console.log(d)
console.log(Dog.bones)

class Husky extends Dog {
    constructor(name: string, color: string) {
        super(name);
        this.color = color;
        this.run();
    }
    color: string
}

// console.log(Husky.prototype);
// let h = new Husky('wang', 'red');
// console.log(h)