import { ethers } from 'hardhat';
import keccak256 from 'keccak256';
import { MerkleTree } from 'merkletreejs';

import { MerkleTreeData } from './interfaces';

export const makeMerkleTree = async (): Promise<MerkleTreeData> => {
  const signers = await ethers.getSigners();
  // alice, bob, carol
  const inputs = [
    {
      address: signers[1].address,
      quantity: 1,
    },
    {
      address: signers[2].address,
      quantity: 2,
    },
    {
      address: signers[3].address,
      quantity: 1,
    },
  ];

  // create leaves from inputs
  const leaves = inputs.map((x) =>
    ethers.utils.solidityKeccak256(
      ['address', 'uint256'],
      [x.address, x.quantity]
    )
  );

  // create a Merkle Tree using keccak256 hash function
  const tree = new MerkleTree(leaves, keccak256, { sort: true });

  // get the root
  const root = tree.getHexRoot();

  const proofs = leaves.map((leaf) => tree.getHexProof(leaf));
  return {
    proofs,
    root,
  };
};
