import { ethers } from 'hardhat';
import { Inputs, Usernames, Users, UsersQuantity } from './interfaces';

export const usernames: Usernames = ['owner', 'alice', 'bob', 'carol', 'david'];

export const usersQuantity: UsersQuantity = {
  alice: 1,
  bob: 2,
  carol: 1,
};

export const makeUsers = async (): Promise<Users> => {
  const signers = await ethers.getSigners();
  return usernames.reduce((acc: Users, name: string, index) => {
    return {
      ...acc,
      [name]: signers[index],
    };
  }, {} as Users);
};

export const makeInputs = async (
  usernames: string[],
  usersQuantity: UsersQuantity
): Promise<Inputs> => {
  const signers = await ethers.getSigners();

  return usernames
    .filter((name: string) => !['owner', 'david'].includes(name))
    .map((name) => {
      const quantity = usersQuantity[name];
      const signerIndex = usernames.indexOf(name);
      return {
        address: signers[signerIndex].address,
        quantity: quantity,
      };
    });
};
