const main=async()=>  {
  
  const Transactions = await hre.ethers.getContractFactory("Transactions");         // using the contract here 
  const transactions = await Transactions.deploy();                              // instance of transaction class from contract

  await transactions.deployed();                                                // take care of capital letters

  console.log("Transactions deployed to:", transactions.address);               //  address of smart contract deployed on blockchain 
}

const runMain = async () =>{
  try {
    await main();
    process.exit(0);          // process went successfully
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

runMain();