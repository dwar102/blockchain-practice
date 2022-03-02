const Block = require("./block");
const { GENESIS_DATA } = require("./constants");
const cryptoHash = require("./crypto-hash.js");

describe('Block', () => {
    const testBlock = {
        timestamp: 'a-date',
        lastHash: 'foo-hash',
        hash: 'bar-hash',
        data: ['blockchain', 'data']
    }

    const block = new Block( testBlock );

    it('has a timestamp, lastHash, hash, and data property', () => {
        expect(block).toEqual(testBlock);
    });

    describe('genesis()', () => {
        const genesisBlock = Block.genesis();

        it('returns a Block instance', () => {
            expect(genesisBlock instanceof Block).toBe(true);
        });

        it('returns the genesis data', () => {
            expect(genesisBlock).toEqual(GENESIS_DATA);
        })
    });

    describe('mineBlock()', () => {
        const lastBlock = Block.genesis();
        const data = 'mined data';
        const minedBlock = Block.mineBlock({ lastBlock, data });

        it('returns a Block instance', () => {
            expect(minedBlock instanceof Block).toBe(true);
        });

        it('sets the `lastHash` to be the `hash` of the lastBlock', () => {
            expect(minedBlock.lastHash).toEqual(lastBlock.hash);
        });

        it('sets the `data`', () => {
            expect(minedBlock.data).toEqual(data);
        });

        it('sets a `timestamp`', () => {
            expect(minedBlock.timestamp).not.toEqual(undefined);
        });

        it('should create a SHA-256 `hash` based on the proper intputs', () => {
            expect(minedBlock.hash)
                .toEqual(cryptoHash(minedBlock.timestamp, lastBlock.hash, data))
        });
    })
});