const { Blockchain, Transaction } = require('./blockchain');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

const myKey = ec.keyFromPrivate(
  '3c304a01598ba63c1aebd55a6bfc6372ef06be37f5a35bf04304a235c8cdea1b'
);
const myWallettAddress = myKey.getPublic('hex');

// Create the blockchain
//  initialize chain
//  add genesis block
//  create an empty transaction array
let samplecoin = new Blockchain();

// Create a new transaction
const tx1 = new Transaction(myWallettAddress, 'public key goes here', 10);
//  sign the transaction SHA256 hash with myKey
//  set the 'signature' property to the signed hash
tx1.signTransaction(myKey);

// Push the transaction into blockchain transactions
samplecoin.addTransaction(tx1);

// push reward Tx into blockchain's pending transactions
// create a new block and mine a new hash
// add the new block to the chain
console.log('\nStarting the miner....');
samplecoin.minePendingTransactions(myWallettAddress);

console.log(
  '\nBalance of tkircsi: ',
  samplecoin.getBalanceOfAddress(myWallettAddress)
);

console.log('Is chain valid? ', samplecoin.isChainValid());
