
abstract class Animal {
    abstract sleep(): void
}

class Dog1 extends Animal {
   constructor(name: string) {
       super();
       this.name = name;
   }
   name: string
   sleep() {
       console.log('dog')
   }
}

let dd = new Dog1('wang');

console.log(dd.sleep())