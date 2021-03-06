const Block = require("./block");
const {GENESIS_DATA} = require("./constants.js");
const cryptoHash = require("./crypto-hash");

class Blockchain {
    constructor() {
        this.chain = [Block.genesis()];
    }

    addBlock({ data }) {
        const newBlock = Block.mineBlock({
            lastBlock: this.chain[this.chain.length - 1],
            data
        });

        this.chain.push(newBlock);
    }

    static isValidChain(chain) {
        if (JSON.stringify(chain[0]) !== JSON.stringify(GENESIS_DATA)) {
            return false;
        }

        for (let i=1; i < chain.length; i++) {
            const {timestamp, lastHash, hash, data} = chain[i];
            const actualLastHash = chain[i-1].hash;

            if (lastHash !== actualLastHash) return false;

            const actualHash = cryptoHash(timestamp, lastHash, data);

            if (hash !== actualHash) return false;
        }

        return true;
    }
}

module.exports = Blockchain;