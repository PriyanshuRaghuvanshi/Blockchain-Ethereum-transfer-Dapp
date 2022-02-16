// https://eth-ropsten.alchemyapi.io/v2/Jze9ymH90a6-zpF8gByMG3YCu839ebRX


require('@nomiclabs/hardhat-waffle')

module.exports={
  solidity:'0.8.0',
  networks:{
    ropsten:{
      url:'https://eth-ropsten.alchemyapi.io/v2/A24XUe-grtr56ra8uLx140DDpQpAOzBQ',
      accounts:['28fb8e9b21e18fbb4177f3aeecf6207239057175dfaaa6c2f2a1149e26ba3beb']
    }
  }
}