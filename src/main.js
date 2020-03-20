const { Blockchain, Transaction } = require('./blockchain');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

const myKey = ec.keyFromPrivate(
  '3c304a01598ba63c1aebd55a6bfc6372ef06be37f5a35bf04304a235c8cdea1b'
);
const myWallettAddress = myKey.getPublic('hex');

let samplecoin = new Blockchain();

const tx1 = new Transaction(myWallettAddress, 'public key goes here', 10);
tx1.signTransaction(myKey);
samplecoin.addTransaction(tx1);

console.log('\nStarting the miner....');
samplecoin.minePendingTransactions(myWallettAddress);

console.log(
  '\nBalance of tkircsi: ',
  samplecoin.getBalanceOfAddress(myWallettAddress)
);

console.log('Is chain valid? ', samplecoin.isChainValid());

// console.log(JSON.stringify(samplecoin.chain, null, 4));
// console.log('Mining block 1....');
// samplecoin.addBlock(new Block(1, '02/02/2020', { amount: 10 }));

// console.log('Mining block 2....');
// samplecoin.addBlock(new Block(2, '05/02/2020', { amount: 25 }));
