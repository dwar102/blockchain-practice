const Blockchain = require('./blockchain');
const Block = require('./block');
const { GENESIS_DATA } = require('./config');

describe('Blockchain', () => {
    let blockchain;

    beforeEach(() => {
        blockchain = new Blockchain();
    });

    it('contains a `chain` Array instance', () => {
        expect(blockchain.chain instanceof Array).toBe(true);
    });

    it('starts with the genesis block', () => {
        expect(blockchain.chain[0]).toEqual(Block.genesis());
    });

    it('adds a new block to the chain', () => {
        const newData = 'foo bar';
        blockchain.addBlock({ data: newData });

        expect(blockchain.chain[blockchain.chain.length - 1].data).toEqual(newData);
    });

    describe('isValidChain()', () => {
        describe('when the chain does not start with the genesis block', () => {
            it('should return false', () => {
                blockchain.chain[0] = { data: 'fake-genesis-block' };

                expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
            });
        });

        describe('when the chain starts with the genesis block and contains multiple blocks', () => {
            describe('and lastHash reference is changed', () => {
                it('should return false', () => {
                    blockchain.addBlock({ data: 'One' });
                    blockchain.addBlock({ data: 'Two' });
                    blockchain.addBlock({ data: 'Three' });

                    blockchain.chain[2].lastHash = 'broken-lastHash';

                    expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
                });
            });

            describe('and the chain contains a block with an invalid field', () => {
                it('should return false', () => {
                    blockchain.addBlock({ data: 'One' });
                    blockchain.addBlock({ data: 'Two' });
                    blockchain.addBlock({ data: 'Three' });

                    blockchain.chain[2].data = 'broken-data';

                    expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
                });
            });

            describe('and the chain does not contain any invalid blocks', () => {
                it('should return true', () => {
                    blockchain.addBlock({ data: 'One' });
                    blockchain.addBlock({ data: 'Two' });
                    blockchain.addBlock({ data: 'Three' });

                    expect(Blockchain.isValidChain(blockchain.chain)).toBe(true);
                });
            });
        });
    });
});