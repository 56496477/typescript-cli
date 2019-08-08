interface Human {
    name: string, 
    eat(): void
}

class Asian implements Human {
    constructor(name: string) {
        this.name = name;
    }
    name: string
    eat() {}
}

interface Man extends Human {
    run(): void
}

interface Child {
    cry(): void
}

interface Boy extends Man, Child {

}

let boy: Boy = {
    name: '',
    run() {},
    cry() {},
    eat() {}
}

class Auto {
    state = 1
    pay(){}
}

interface AutoInterface extends Auto {}

class C implements AutoInterface {
    state = 2
    pay() {}
}

class Bus extends Auto implements AutoInterface {
    pay() {}
}