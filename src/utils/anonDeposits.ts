import snarkjs from "snarkjs";
import circomlib from "circomlib";
import crypto from 'crypto'
// import Web3 from "web3";
// import instanceAbi from "./abi/ETHAnon.json"
// import config from "./config"
const bigInt = snarkjs.bigInt;


const rbigint = (nbytes) => bigInt.leBuff2int(crypto.randomBytes(nbytes));

const pedersenHash = (data) => circomlib.babyJub.unpackPoint(circomlib.pedersenHash.hash(data))[0];

function toHex(number, length = 32) {
  const str =
    number instanceof Buffer
      ? number.toString("hex")
      : bigInt(number).toString(16);
  return "0x" + str.padStart(length * 2, "0");
}

function parseNote(noteString) {
    const noteRegex =
      /anon-(?<currency>\w+)-(?<amount>[\d.]+)-(?<netId>\d+)-0x(?<note>[0-9a-fA-F]{124})/g;
    const match : any = noteRegex.exec(noteString);
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

 function createDeposit({nullifier,secret}){
    const deposit : any = {nullifier,secret}
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

 export function deposit({currency,amount,chainId}){
   const nullifier = rbigint(31)
   const secret = rbigint(31)
    const deposit : any = createDeposit({nullifier : nullifier,secret: secret});

    const note = toHex(deposit.preimage,62);
    const noteString = `anon-${currency}-${amount}-${chainId}-${note}`;
    return {noteString,deposit};
}


// export function withdraw(note : string,recipient : string){
//   const {currency,amount,netId,deposit} = parseNote(note);

//   const {proof,args} = await generateProof({deposit,recipient})
// }

// async function generateProof({deposit,recipient,relayer})

