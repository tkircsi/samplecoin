const SHA256 = require('crypto-js/sha256');

class Transaction {
  constructor(fromAddress, toAddress, amount) {
    this.fromAddress = fromAddress;
    this.toAddress = toAddress;
    this.amount = amount;
  }
}

class Block {
  constructor(timestamp, transactions, previousHash = '') {
    this.timestamp = timestamp;
    this.transactions = transactions;
    this.previousHash = previousHash;
    this.hash = this.calculateHash();
    this.nonce = 0;
  }

  calculateHash() {
    return SHA256(
      this.previousHash +
        this.timestamp +
        JSON.stringify(this.transactions) +
        this.nonce
    ).toString();
  }

  mineBlock(difficulty) {
    while (
      this.hash.substring(0, difficulty) !== Array(difficulty + 1).join('0')
    ) {
      this.hash = this.calculateHash();
      this.nonce++;
    }
    console.log('Block mined: ' + this.hash);
  }
}

class Blockchain {
  constructor() {
    this.chain = [this.createGenesisBlock()];
    this.difficulty = 4;
    this.pendingTransactions = [];
    this.miningReward = 100;
  }

  createGenesisBlock() {
    return new Block('01/01/2020', 'Genesis block', 0);
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  minePendingTransactions(miningRewardAddress) {
    let block = new Block(
      Date.now(),
      this.pendingTransactions,
      this.getLatestBlock().hash
    );
    block.mineBlock(this.difficulty);

    console.log('Block successfully mined.');
    this.chain.push(block);

    this.pendingTransactions = [
      new Transaction(null, miningRewardAddress, this.miningReward)
    ];
  }

  createTransaction(transaction) {
    this.pendingTransactions.push(transaction);
  }

  getBalanceOfAddress(address) {
    let balance = 0;

    for (const block of this.chain) {
      for (const trans of block.transactions) {
        if (trans.fromAddress === address) {
          balance -= trans.amount;
        }
        if (trans.toAddress === address) {
          balance += trans.amount;
        }
      }
    }
    return balance;
  }

  isChainValid() {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];

      if (currentBlock.hash !== currentBlock.calculateHash()) {
        return false;
      }

      if (currentBlock.previousHash !== previousBlock.hash) {
        return false;
      }
    }

    return true;
  }
}

let samplecoin = new Blockchain();
samplecoin.createTransaction(new Transaction('address1', 'address2', 100));
samplecoin.createTransaction(new Transaction('address2', 'address1', 50));

console.log('\nStarting the miner....');
samplecoin.minePendingTransactions('tkircsi-address');

console.log(
  '\nBalance of tkircsi: ',
  samplecoin.getBalanceOfAddress('tkircsi-address')
);

console.log('\nStarting the miner again....');
samplecoin.minePendingTransactions('tkircsi-address');

console.log(
  '\nBalance of tkircsi: ',
  samplecoin.getBalanceOfAddress('tkircsi-address')
);

console.log(JSON.stringify(samplecoin.chain, null, 4));
// console.log('Mining block 1....');
// samplecoin.addBlock(new Block(1, '02/02/2020', { amount: 10 }));

// console.log('Mining block 2....');
// samplecoin.addBlock(new Block(2, '05/02/2020', { amount: 25 }));
