import contract from "@truffle/contract";

export const loadContract = async (contractName, provider) => {
  console.log(" we are in loadContract function ");
  let res;
  try {
    res = await fetch(`./contracts/${contractName}.json`);
  } catch (e) {
    console.log("Error while fetching " + contractName + ".json");
  }
  let Artifact = await res.json();      // converting fetched data to json formate
  const _contract = contract(Artifact); //  converting to contract 
  _contract.setProvider(provider);      //  setting provider 
  let deployedContract=await _contract.deployed()
  return deployedContract;            //  sending that deployed instance 
};
