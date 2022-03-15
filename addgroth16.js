const buildGroth16 = require("websnark/src/groth16");
const circuit = require("./src/utils/circuits/anon.json");
const fs = require("fs");

async function getGroth() {
  window.groth16 = await buildGroth16();
  window.proving_key = fs.readFileSync(
    __dirname + "/src/utils/circuits/withdraw_proving_key.bin"
  ).buffer;
  window.circuit = circuit;
}

getGroth();
