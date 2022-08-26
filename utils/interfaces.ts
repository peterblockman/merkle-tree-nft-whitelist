import { Signer } from 'ethers';

export type Users = Record<string, Signer>;

export interface MerkleTreeData {
  root: string;
  proofs: string[][];
}
