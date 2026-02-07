import { ChainWrapper } from './chain-wrapper.js';

export const chain = <T>(value: T): ChainWrapper<T> => {
  return new ChainWrapper(value);
};
