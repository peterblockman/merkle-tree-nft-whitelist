import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { expect } from 'chai';
import { ethers } from 'hardhat';
import { makeMerkleTreeData } from '../utils/merkletree';
import { makeUsers, usersQuantity } from '../utils/data';

describe('ExcitedApeYatchClub', function () {
  async function deployOneYearLockFixture() {
    const merkleTreeData = await makeMerkleTreeData();
    const users = await makeUsers();
    const { merkleRoot } = merkleTreeData;

    const ExcitedApeYatchClub = await ethers.getContractFactory(
      'ExcitedApeYatchClub'
    );
    const excitedApeYatchClub = await ExcitedApeYatchClub.deploy(merkleRoot);

    return { excitedApeYatchClub, merkleTreeData, users };
  }
  beforeEach(async function () {
    const { excitedApeYatchClub, users, merkleTreeData } = await loadFixture(
      deployOneYearLockFixture
    );
    this.excitedApeYatchClub = excitedApeYatchClub;
    this.users = users;
    this.merkleTreeData = merkleTreeData;
  });

  describe('Deployment', function () {
    it('Should return correct name and symbol', async function () {
      expect(await this.excitedApeYatchClub.name()).to.equal(
        'Excited Ape Yacht Club'
      );
      expect(await this.excitedApeYatchClub.symbol()).to.equal('EAYC');
    });
  });

  describe('mint', function () {
    beforeEach(async function () {
      await this.excitedApeYatchClub
        .connect(this.users.alice)
        .mint(
          usersQuantity.alice,
          this.merkleTreeData.proofs[await this.users.alice.getAddress()]
        );

      await this.excitedApeYatchClub
        .connect(this.users.bob)
        .mint(
          usersQuantity.bob,
          this.merkleTreeData.proofs[await this.users.bob.getAddress()]
        );
    });

    it('Should allow whitelisted users to mint', async function () {
      const aliceBalance = await this.excitedApeYatchClub.balanceOf(
        await this.users.alice.getAddress()
      );

      expect(aliceBalance).to.equal(1);

      const bobBalance = await this.excitedApeYatchClub.balanceOf(
        await this.users.bob.getAddress()
      );

      expect(bobBalance).to.equal(2);
    });

    it('Should revert when users try to mint over allowed quantity', async function () {
      try {
        await this.excitedApeYatchClub
          .connect(this.users.alice)
          .mint(
            2,
            this.merkleTreeData.proofs[await this.users.alice.getAddress()]
          );
      } catch (error: any) {
        expect(error.message).to.contains('invalid proof');
      }
    });

    it('Should revert when non-whitelisted users try to mint', async function () {
      try {
        await this.excitedApeYatchClub
          .connect(this.users.david)
          .mint(
            1,
            this.merkleTreeData.proofs[await this.users.david.getAddress()]
          );
      } catch (error: any) {
        expect(error.message).to.contains('invalid proof');
      }
    });
  });
});
