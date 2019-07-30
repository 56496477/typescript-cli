import { Popo } from 'react-popo';
import { userModel } from './user';
import { productModel } from './product';

const model = new Popo();

model.register(userModel);
model.register(productModel);

const { PopoContainer, connect, store } = model.start();

export { PopoContainer };

export { connect };

export { store };
