interface List {
    readonly id: number;
    name: string;
    age?: number;
    // [x: string]: any;
}

interface Result {
    data: List[];
}

function render(result: Result): void {
    result.data.forEach((value): void => {
        console.log(value.id, value.name);
        if(value.age) {
            console.log(value.age);
        }
    });
}

// let result = {
//     data: [
//         {
//             id: 1,
//             name: 'A',
//             sex: 'male'
//         },
//         {
//             id: 2,
//             name: 'B',
//             age: 10
//         }
//     ]
// };

render({
    data: [
        {
            id: 1,
            name: 'A',
            sex: 'male'
        },
        {
            id: 2,
            name: 'B',
            age: 10
        }
    ]
} as Result);
