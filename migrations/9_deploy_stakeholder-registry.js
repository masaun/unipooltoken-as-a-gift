var StakeholderRegistry = artifacts.require("StakeholderRegistry");
var IERC20 = artifacts.require("IERC20");

//@dev - Import from exported file
var contractAddressList = require('./contractAddress/contractAddress.js');
var tokenAddressList = require('./tokenAddress/tokenAddress.js');
var walletAddressList = require('./walletAddress/walletAddress.js');

const daiAddress = tokenAddressList["Ropsten"]["DAI"];     // DAI address on Ropsten
const zrxAddress = tokenAddressList["Ropsten"]["ZRX"];     // ZRX address on Ropsten
const batAddress = tokenAddressList["Ropsten"]["BAT"];     // BAT address on Ropsten
const _uniswapV2Factory = contractAddressList["Ropsten"]["Uniswap"]["UniswapV2Factory"];
const _uniswapV2Router01 = contractAddressList["Ropsten"]["Uniswap"]["UniswapV2Router01"];

const depositedAmount = web3.utils.toWei("0.15");    // 0.15 DAI which is deposited in deployed contract. 

module.exports = async function(deployer, network, accounts) {
    // Initialize owner address if you want to transfer ownership of contract to some other address
    let ownerAddress = walletAddressList["WalletAddress1"];

    await deployer.deploy(StakeholderRegistry, 
                          daiAddress, 
                          zrxAddress, 
                          batAddress, 
                          _uniswapV2Factory, 
                          _uniswapV2Router01)
                  .then(async function(stakeholderRegistry) {
                      if(ownerAddress && ownerAddress!="") {
                          console.log(`=== Transfering ownership to address ${ownerAddress} ===`)
                          await stakeholderRegistry.transferOwnership(ownerAddress);
                      }
                  }
    );

    //@dev - Transfer 2.1 DAI from deployer's address to contract address in advance
    const stakeholderRegistry = await StakeholderRegistry.deployed();
    const iERC20 = await IERC20.at(daiAddress);
    await iERC20.transfer(stakeholderRegistry.address, depositedAmount);
};
