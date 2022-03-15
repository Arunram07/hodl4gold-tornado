import snarkjs from "snarkjs";
import circomlib from "circomlib";
import crypto from "crypto";
// import Web3 from "web3";
// import instanceAbi from "./abi/ETHAnon.json"
// import config from "./config"
import assert from "assert";
import { genWitnessAndProve, toSolidityInput } from "websnark/src/utils";
import merkleTree from "fixed-merkle-tree";
import buildGroth16 from "websnark/src/groth16";

const bigInt = snarkjs.bigInt;

let groth16, proving_key, circuit;

const rbigint = (nbytes) => bigInt.leBuff2int(crypto.randomBytes(nbytes));

const pedersenHash = (data) =>
  circomlib.babyJub.unpackPoint(circomlib.pedersenHash.hash(data))[0];

function toHex(number, length = 32) {
  const str =
    number instanceof Buffer
      ? number.toString("hex")
      : bigInt(number).toString(16);
  return "0x" + str.padStart(length * 2, "0");
}

function parseNote(noteString: string) {
  const noteRegex =
    /anon-(?<currency>\w+)-(?<amount>[\d.]+)-(?<netId>\d+)-0x(?<note>[0-9a-fA-F]{124})/g;
  const match: any = noteRegex.exec(noteString);
  if (!match) {
    throw new Error("The note has invalid format");
  }

  const buf = Buffer.from(match.groups.note, "hex");
  const nullifier = bigInt.leBuff2int(buf.slice(0, 31));
  const secret = bigInt.leBuff2int(buf.slice(31, 62));
  const deposit = createDeposit({ nullifier, secret });
  const netId = Number(match.groups.netId);

  return {
    currency: match.groups.currency,
    amount: match.groups.amount,
    netId,
    deposit,
  };
}

function createDeposit({ nullifier, secret }) {
  const deposit: any = { nullifier, secret };
  deposit.preimage = Buffer.concat([
    deposit.nullifier.leInt2Buff(31),
    deposit.secret.leInt2Buff(31),
  ]);

  deposit.commitement = pedersenHash(deposit.preimage);
  deposit.commitementHex = toHex(deposit.commitement);
  deposit.nullifierHash = pedersenHash(deposit.nullifier.leInt2Buff(31));
  deposit.nullifierHex = toHex(deposit.nullifierHash);
  return deposit;
}

export function deposit({ currency, amount, chainId }) {
  const nullifier = rbigint(31);
  const secret = rbigint(31);
  const deposit: any = createDeposit({ nullifier: nullifier, secret: secret });

  const note = toHex(deposit.preimage, 62);
  const noteString = `anon-${currency}-${amount}-${chainId}-${note}`;
  return { noteString, deposit };
}

export async function withdraw(note: string, anon: any, recipient: any) {
  const { currency, amount, netId, deposit } = parseNote(note);
  const { proof, args } = await generateProof(anon, deposit, recipient);
  return { proof, args };
}

async function generateProof(anon, deposit, recipient) {
  const { root, pathElements, pathIndices } = await generateMerkleProof(
    anon,
    deposit
  );

  const input = {
    // Public snark inputs
    root: root,
    nullifierHash: deposit.nullifierHash,
    recipient: bigInt(recipient),
    relayer: bigInt(0),
    fee: bigInt(0),
    refund: bigInt(0),

    // Private snark inputs
    nullifier: deposit.nullifier,
    secret: deposit.secret,
    pathElements: pathElements,
    pathIndices: pathIndices,
  };

  const proving_key = await (
    await fetch("circuits/withdraw_proving_key.bin")
  ).arrayBuffer();

  const proofData = await genWitnessAndProve(
    groth16,
    input,
    circuit,
    proving_key
  );

  const { proof } = toSolidityInput(proofData);

  const args = [
    toHex(input.root),
    toHex(input.nullifierHash),
    toHex(input.recipient, 20),
    toHex(input.relayer, 20),
    toHex(input.fee),
    toHex(input.refund),
  ];

  return { proof, args };
}

async function generateMerkleProof(anon, deposit) {
  const events = await anon.getPastEvents("Deposit", {
    fromBlock: 0,
    toBlock: "latest",
  });
  const leaves = events
    .sort((a, b) => a.returnValues.leafIndex - b.returnValues.leafIndex) // Sort events in chronological order
    .map((e) => e.returnValues.commitment);
  const tree = new merkleTree(20, leaves);

  // Find current commitment in the tree
  const depositEvent = events.find(
    (e) => e.returnValues.commitment === toHex(deposit.commitement)
  );
  const leafIndex = depositEvent ? depositEvent.returnValues.leafIndex : -1;

  // Validate that our data is correct
  const root = tree.root();
  console.log(toHex(root));
  const isValidRoot = await anon.methods.isKnownRoot(toHex(root)).call();
  const isSpent = await anon.methods
    .isSpent(toHex(deposit.nullifierHash))
    .call();
  assert(isValidRoot === true, "Merkle tree is corrupted");
  assert(isSpent === false, "The note is already spent");
  assert(leafIndex >= 0, "The deposit is not found in the tree");

  // Compute merkle proof of our commitment
  const { pathElements, pathIndices } = tree.path(leafIndex);
  return { pathElements, pathIndices, root: tree.root() };
}

async function init() {
  console.log("started building");

  try {
    circuit = require("./circuits/withdraw.json");
  } catch (e) {
    console.log("circuit err");
  }

  try {
    proving_key = await (
      await fetch("./circuits/withdraw_proving_key.bin")
    ).arrayBuffer();
  } catch (e) {
    console.log("proving err");
  }

  try {
    groth16 = await buildGroth16();
  } catch (e) {
    console.log("groth16 err");
  }

  console.log("groth16 finished building");

  return;
}

init();
