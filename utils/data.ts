import { ethers } from 'hardhat';
import { Users } from './interfaces';

export const makeUsers = async (): Promise<Users> => {
  const signers = await ethers.getSigners();
  return {
    alice: signers[1],
    bob: signers[2],
    carol: signers[3],
    david: signers[3],
  };
};
