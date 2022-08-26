import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { expect } from 'chai';
import { ethers } from 'hardhat';
import { makeMerkleTree } from '../utils/merkletree';
import { makeUsers } from '../utils/data';

describe('ExcitedApeYachtClub', function () {
  async function deployOneYearLockFixture() {
    const merkleTreeData = await makeMerkleTree();
    const { root } = merkleTreeData;

    const users = await makeUsers();

    const ExcitedApeYachtClub = await ethers.getContractFactory(
      'ExcitedApeYachtClub'
    );

    const excitedApeYachtClub = await ExcitedApeYachtClub.deploy(root);

    return { excitedApeYachtClub, merkleTreeData, users };
  }

  beforeEach(async function () {
    const { excitedApeYachtClub, users, merkleTreeData } = await loadFixture(
      deployOneYearLockFixture
    );
    this.excitedApeYachtClub = excitedApeYachtClub;
    this.users = users;
    this.merkleTreeData = merkleTreeData;
  });

  describe('Deployment', function () {
    it('Should return correct name and symbol', async function () {
      expect(await this.excitedApeYachtClub.name()).to.equal(
        'Excited Ape Yacht Club'
      );
      expect(await this.excitedApeYachtClub.symbol()).to.equal('EAYC');
    });
  });

  describe('mint', function () {
    beforeEach(async function () {
      await this.excitedApeYachtClub
        .connect(this.users.alice)
        .mint(1, this.merkleTreeData.proofs[0]);

      await this.excitedApeYachtClub
        .connect(this.users.bob)
        .mint(2, this.merkleTreeData.proofs[1]);
    });

    it('Should allow whitelisted users to mint', async function () {
      const aliceBalance = await this.excitedApeYachtClub.balanceOf(
        await this.users.alice.getAddress()
      );

      expect(aliceBalance).to.equal(1);

      const bobBalance = await this.excitedApeYachtClub.balanceOf(
        await this.users.bob.getAddress()
      );

      expect(bobBalance).to.equal(2);
    });

    it('Should revert when users try to mint over allowed quantity', async function () {
      try {
        await this.excitedApeYachtClub
          .connect(this.users.alice)
          .mint(2, this.merkleTreeData.proofs[1]);
      } catch (error: any) {
        expect(error.message).to.contains('invalid proof');
      }
    });

    it('Should revert when non-whitelisted users try to mint', async function () {
      try {
        await this.excitedApeYachtClub
          .connect(this.users.david)
          .mint(1, this.merkleTreeData.proofs[1]);
      } catch (error: any) {
        expect(error.message).to.contains('invalid proof');
      }
    });
  });
});
