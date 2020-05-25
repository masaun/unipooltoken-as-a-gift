import React, { Component } from "react";
import getWeb3, { getGanacheWeb3, Web3 } from "../../utils/getWeb3";

import App from "../../App.js";

import { Grid } from '@material-ui/core';
import { Loader, Button, Card, Input, Heading, Table, Form, Flex, Box, Image, EthAddress } from 'rimble-ui';
import { zeppelinSolidityHotLoaderOptions } from '../../../config/webpack';

import styles from '../../App.module.scss';
//import './App.css';

import { walletAddressList } from '../../data/walletAddress/walletAddress.js'
import { contractAddressList } from '../../data/contractAddress/contractAddress.js'
import { tokenAddressList } from '../../data/tokenAddress/tokenAddress.js'


export default class UniswapAaveNYBW extends Component {
    constructor(props) {    
        super(props);

        this.state = {
            /////// Default state
            storageValue: 0,
            web3: null,
            accounts: null,
            route: window.location.pathname.replace("/", "")
        };

        /////// Uniswap-v2
        this.createUniToken = this.createUniToken.bind(this);
        this.addLiquidity = this.addLiquidity.bind(this);
        this.mintUniToken = this.mintUniToken.bind(this);

        /////// AAVE
        this.depositToAaveMarket = this.depositToAaveMarket.bind(this);

        /////// Getter Functions of Uniswap-v2
        this.getPair = this.getPair.bind(this);
        this.getUniToken = this.getUniToken.bind(this);
        this._getTotalSupplyOfUniToken = this._getTotalSupplyOfUniToken.bind(this);

        /////// Getter Functions of AAVE
        this._getLendingPoolManagerAddress = this._getLendingPoolManagerAddress.bind(this);

        /////// Getter Functions of others
        this._balanceOfContract = this._balanceOfContract.bind(this);

        /////// Test Functions
        this.timestampFromDate = this.timestampFromDate.bind(this);
    }

    /***
     * @notice - Uniswap-v2
     **/
    createUniToken = async () => {
        const { accounts, web3, dai, uniswap_aave_nybw } = this.state;

        //const _tokenA = tokenAddressList["Ropsten"]["DAI"];
        const _tokenA = tokenAddressList["Ropsten"]["ZRX"];
        const _tokenB = tokenAddressList["Ropsten"]["BAT"];

        let res = await uniswap_aave_nybw.methods.createUniToken(_tokenA, _tokenB).send({ from: accounts[0] });
        console.log('=== createUniToken() ===\n', res);
    }

    addLiquidity = async () => {
        const { accounts, web3, dai, zrx, bat, uniswap_aave_nybw, UNISWAP_AAVE_NYBW_ADDRESS, UNISWAP_V2_ROUTOR_01_ADDRESS } = this.state;

        /// Get pair contract address
        const _tokenA = tokenAddressList["Ropsten"]["ZRX"];
        const _tokenB = tokenAddressList["Ropsten"]["BAT"];
        const _pair = await uniswap_aave_nybw.methods._getPair(_tokenA, _tokenB).call(); // Pair of BAT and ZRX on Ropsten
        console.log('=== _pair() ===\n', _pair);

        const _amountADesired = web3.utils.toWei('1', 'ether');
        const _amountBDesired = web3.utils.toWei('1', 'ether');
        const _amountAMin = 0;
        const _amountBMin = 0;
        const _to = walletAddressList["WalletAddress1"];
        //const _deadline = 1590116732; // (GMT): Friday, May 22, 2020 3:05:32 AM 

        /// Transfer token0 and toke1 from wallet address to executor contract address
        let transferred1 = await zrx.methods.transfer(UNISWAP_AAVE_NYBW_ADDRESS, _amountADesired).send({ from: accounts[0] });
        let transferred2 = await bat.methods.transfer(UNISWAP_AAVE_NYBW_ADDRESS, _amountBDesired).send({ from: accounts[0] });

        /// Approve token0 and toke1 for pair address (as spender)
        let approved1 = await zrx.methods.approve(_pair, _amountADesired).send({ from: accounts[0] });
        let approved2 = await bat.methods.approve(_pair, _amountBDesired).send({ from: accounts[0] });

        /// Add liquidity of UniToken
        let res = await uniswap_aave_nybw.methods._addLiquidity(_tokenA,
                                                                _tokenB,
                                                                _amountADesired,
                                                                _amountBDesired,
                                                                _amountAMin,
                                                                _amountBMin,
                                                                _to
                                                                //_deadline
                                                                ).send({ from: accounts[0] });
        console.log('=== _addLiquidity() ===\n', res);
    }

    mintUniToken = async () => {
        const { accounts, web3, dai, zrx, bat, uniswap_aave_nybw, UNISWAP_AAVE_NYBW_ADDRESS } = this.state;

        /// Get pair contract address
        const _tokenA = tokenAddressList["Ropsten"]["ZRX"];
        const _tokenB = tokenAddressList["Ropsten"]["BAT"];
        const _pair = await uniswap_aave_nybw.methods._getPair(_tokenA, _tokenB).call(); // Pair of BAT and ZRX on Ropsten
        console.log('=== _pair() ===\n', _pair);

        const _to = walletAddressList["WalletAddress1"];

        /// Transfer token0 and toke1 from wallet address to executor contract address
        const amount = web3.utils.toWei('1', 'ether');
        let transferred1 = await zrx.methods.transfer(UNISWAP_AAVE_NYBW_ADDRESS, amount).send({ from: accounts[0] });
        let transferred2 = await bat.methods.transfer(UNISWAP_AAVE_NYBW_ADDRESS, amount).send({ from: accounts[0] });        

        /// Approve token0 and toke1 for pair address (as spender)
        let transferred3 = await zrx.methods.transfer(_pair, amount).send({ from: accounts[0] });
        let transferred4 = await bat.methods.transfer(_pair, amount).send({ from: accounts[0] });

        /// mint
        let res = await uniswap_aave_nybw.methods.mintUniToken(_pair, _to).send({ from: accounts[0] });
        console.log('=== mintUniToken() ===\n', res);
    }

    /***
     * @notice - AAVE
     **/
    depositToAaveMarket = async () => {
        const { accounts, web3, dai, uniswap_aave_nybw, lendingPool, lendingPoolCore, lendingPoolAddressesProvider, UNISWAP_AAVE_NYBW_ADDRESS, LENDINGPOOL, LENDINGPOOL_CORE, LENDINGPOOL_ADDRESS_PROVIDER } = this.state;

        const _reserve = tokenAddressList["Ropsten"]["DAIaave"];
        //const _reserve = tokenAddressList["Ropsten"]["DAI"];
        const _amount = web3.utils.toWei("1", "ether");
        const _referralCode = 0;

        /// activateReserve become true
        //await lendingPoolCore.methods.initialize(LENDINGPOOL_ADDRESS_PROVIDER).send({ from: accounts[0] });
        //let res1 = await lendingPoolCore.methods.activateReserve(_reserve).send({ from: accounts[0] });
        let res4 = await dai.methods.approve(LENDINGPOOL, _amount).send({ from: accounts[0] });
        let res1 = await dai.methods.approve(LENDINGPOOL_CORE, _amount).send({ from: accounts[0] });
        //let res5 = await dai.methods.approve(UNISWAP_AAVE_NYBW_ADDRESS, _amount).send({ from: accounts[0] });
        let les2 = await lendingPool.methods.deposit(_reserve, _amount, _referralCode).send({ from: accounts[0] });
        let res3 = await uniswap_aave_nybw.methods.depositToAaveMarket(_reserve, _amount, _referralCode).send({ from: accounts[0] });
        console.log('=== depositToAaveMarket() ===\n', res3);
    }

    /***
     * @notice - Getter function
     **/
    getPair = async () => {
        const { accounts, web3, dai, uniswap_aave_nybw } = this.state;

        //const _tokenA = tokenAddressList["Ropsten"]["DAI"];
        const _tokenA = tokenAddressList["Ropsten"]["ZRX"];
        const _tokenB = tokenAddressList["Ropsten"]["BAT"];

        let res = await uniswap_aave_nybw.methods._getPair(_tokenA, _tokenB).call();
        console.log('=== _getPair() ===\n', res);
    }

    getUniToken = async () => {
        const { accounts, web3, dai, uniswap_aave_nybw } = this.state;

        /// Get pair contract address
        //const _tokenA = tokenAddressList["Ropsten"]["ZRX"];
        //const _tokenB = tokenAddressList["Ropsten"]["BAT"];
        //const _pair = await uniswap_aave_nybw.methods._getPair(_tokenA, _tokenB).call(); // Pair of BAT and ZRX on Ropsten
        const _pair = tokenAddressList["Ropsten"]["UNI_USDC_ETH"]; /// UNI_USDC_ETH（on Ropsten）
        console.log('=== _pair() ===\n', _pair);

        let res = await uniswap_aave_nybw.methods.getUniToken(_pair).call();
        console.log('=== getUniToken() ===\n', res);
    }

    _getTotalSupplyOfUniToken = async () => {
        const { accounts, web3, dai, uniswap_aave_nybw } = this.state;

        /// Get pair contract address
        //const _tokenA = tokenAddressList["Ropsten"]["ZRX"];
        //const _tokenB = tokenAddressList["Ropsten"]["BAT"];
        //const _pair = await uniswap_aave_nybw.methods._getPair(_tokenA, _tokenB).call(); // Pair of BAT and ZRX on Ropsten
        const _pair = tokenAddressList["Ropsten"]["UNI_USDC_ETH"]; /// UNI_USDC_ETH（on Ropsten）
        console.log('=== _pair() ===\n', _pair);

        let res = await uniswap_aave_nybw.methods.getTotalSupplyOfUniToken(_pair).call();
        console.log('=== getTotalSupplyOfUniToken() ===\n', res);
    }

    _getLendingPoolManagerAddress = async () => {
        const { accounts, web3, dai, uniswap_aave_nybw } = this.state;

        let res = await uniswap_aave_nybw.methods.getLendingPoolManagerAddress().call();
        console.log('=== getLendingPoolManagerAddress() ===\n', res);
    }

    _balanceOfContract = async () => {
        const { accounts, web3, dai, uniswap_aave_nybw } = this.state;

        let res1 = await uniswap_aave_nybw.methods.balanceOfContract().call();
        console.log('=== balanceOfContract() ===\n', res1);
    }

    /***
     * @notice - Test Functions
     **/
    timestampFromDate = async () => {
        const { accounts, web3, bokkypoobahs_datetime_contract } = this.state;

        const dateToTimestamp = await bokkypoobahs_datetime_contract.methods.timestampFromDate(2020, 5, 4).call();
        console.log('=== dateToTimestamp ===', dateToTimestamp);
    }


    //////////////////////////////////// 
    ///// Refresh Values
    ////////////////////////////////////
    refreshValues = (instanceUniswapAaveNYBW) => {
        if (instanceUniswapAaveNYBW) {
          //console.log('refreshValues of instanceUniswapAaveNYBW');
        }
    }


    //////////////////////////////////// 
    ///// Ganache
    ////////////////////////////////////
    getGanacheAddresses = async () => {
        if (!this.ganacheProvider) {
            this.ganacheProvider = getGanacheWeb3();
        }
        if (this.ganacheProvider) {
            return await this.ganacheProvider.eth.getAccounts();
        }
        return [];
    }

    componentDidMount = async () => {
        const hotLoaderDisabled = zeppelinSolidityHotLoaderOptions.disabled;
     
        let UniswapAaveNYBW = {};
        let Erc20 = {};
        let Dai = {};
        let LendingPool = {};
        let LendingPoolCore = {};
        let LendingPoolAddressesProvider = {};
        let BokkyPooBahsDateTimeContract = {};
        try {
          UniswapAaveNYBW = require("../../../../build/contracts/StakeholderRegistry.json");  // Load artifact-file of StakeholderRegistry
          Erc20 = require("../../../../build/contracts/IERC20.json");
          Dai = require("../../../../build/contracts/IERC20.json");
          LendingPool = require("../../../../build/contracts/ILendingPool.json");
          LendingPoolCore = require("../../../../build/contracts/ILendingPoolCore.json");
          LendingPoolAddressesProvider = require("../../../../build/contracts/ILendingPoolAddressesProvider.json");
          //LendingPoolAddressesProvider = require("../../../../build/contracts/LendingPoolAddressesProvider.json");
          BokkyPooBahsDateTimeContract = require("../../../../build/contracts/BokkyPooBahsDateTimeContract.json");   //@dev - BokkyPooBahsDateTimeContract.sol (for calculate timestamp)
        } catch (e) {
          console.log(e);
        }

        try {
          const isProd = process.env.NODE_ENV === 'production';
          if (!isProd) {
            // Get network provider and web3 instance.
            const web3 = await getWeb3();
            let ganacheAccounts = [];

            try {
              ganacheAccounts = await this.getGanacheAddresses();
            } catch (e) {
              console.log('Ganache is not running');
            }

            // Use web3 to get the user's accounts.
            const accounts = await web3.eth.getAccounts();
            // Get the contract instance.
            const networkId = await web3.eth.net.getId();
            const networkType = await web3.eth.net.getNetworkType();
            const isMetaMask = web3.currentProvider.isMetaMask;
            let balance = accounts.length > 0 ? await web3.eth.getBalance(accounts[0]): web3.utils.toWei('0');
            balance = web3.utils.fromWei(balance, 'ether');

            // Create instance of contracts
            let instanceUniswapAaveNYBW = null;
            let deployedNetwork = null;
            let UNISWAP_AAVE_NYBW_ADDRESS = UniswapAaveNYBW.networks[networkId.toString()].address;
            if (UniswapAaveNYBW.networks) {
              deployedNetwork = UniswapAaveNYBW.networks[networkId.toString()];
              if (deployedNetwork) {
                instanceUniswapAaveNYBW = new web3.eth.Contract(
                  UniswapAaveNYBW.abi,
                  deployedNetwork && deployedNetwork.address,
                );
                console.log('=== instanceUniswapAaveNYBW ===', instanceUniswapAaveNYBW);
              }
            }

            //@notice - IUniswapV2Router01.sol
            const UNISWAP_V2_ROUTOR_01_ADDRESS = contractAddressList["Ropsten"]["Uniswap"]["UniswapV2Router01"];

            //@notice - ILendingPool.sol
            let instanceLendingPool = null;
            let LENDINGPOOL = contractAddressList["Ropsten"]["Aave"]["LendingPool"];
            instanceLendingPool = new web3.eth.Contract(
              LendingPool.abi,
              LENDINGPOOL,
            );
            console.log('=== instanceLendingPool ===', instanceLendingPool);

            //@notice - ILendingPoolCore.sol
            let instanceLendingPoolCore = null;
            let LENDINGPOOL_CORE = contractAddressList["Ropsten"]["Aave"]["LendingPoolCore"];
            instanceLendingPoolCore = new web3.eth.Contract(
              LendingPoolCore.abi,
              LENDINGPOOL_CORE,
            );
            console.log('=== instanceLendingPoolCore ===', instanceLendingPoolCore);            

            //@notice - LendingPoolAddressesProvider.sol
            let instanceLendingPoolAddressesProvider = null;
            let LENDINGPOOL_ADDRESS_PROVIDER = contractAddressList["Ropsten"]["Aave"]["LendingPoolAddressesProvider"];
            instanceLendingPoolAddressesProvider = new web3.eth.Contract(
              LendingPoolAddressesProvider.abi,
              LENDINGPOOL_ADDRESS_PROVIDER,
            );
            console.log('=== instanceLendingPoolAddressesProvider ===', instanceLendingPoolAddressesProvider);            

            //@dev - Create instance of DAI-contract
            let instanceDai = null;
            let DAI_ADDRESS = tokenAddressList["Ropsten"]["DAIaave"]; //@dev - DAI（on Ropsten）
            instanceDai = new web3.eth.Contract(
              Dai.abi,
              DAI_ADDRESS,
            );
            console.log('=== instanceDai ===', instanceDai);

            //@dev - Create instance of ZRX
            let instanceZRX = null;
            let ZRX_ADDRESS = tokenAddressList["Ropsten"]["ZRX"]; //@dev - ZRX（on Ropsten）
            instanceZRX = new web3.eth.Contract(
              Erc20.abi,
              ZRX_ADDRESS,
            );
            console.log('=== instanceZRX ===', instanceZRX);

            //@dev - Create instance of BAT
            let instanceBAT = null;
            let BAT_ADDRESS = tokenAddressList["Ropsten"]["BAT"]; //@dev - BAT（on Ropsten）
            instanceBAT = new web3.eth.Contract(
              Erc20.abi,
              BAT_ADDRESS,
            );
            console.log('=== instanceBAT ===', instanceBAT);

            //@dev - Create instance of BokkyPooBahsDateTimeContract.sol
            let instanceBokkyPooBahsDateTimeContract = null;
            let BOKKYPOOBAHS_DATETIME_CONTRACT_ADDRESS = contractAddressList["Kovan"]["BokkyPooBahsDateTimeLibrary"]["BokkyPooBahsDateTimeContract"];
            instanceBokkyPooBahsDateTimeContract = new web3.eth.Contract(
              BokkyPooBahsDateTimeContract.abi,
              BOKKYPOOBAHS_DATETIME_CONTRACT_ADDRESS,
            );
            console.log('=== instanceBokkyPooBahsDateTimeContract ===', instanceBokkyPooBahsDateTimeContract);


            if (UniswapAaveNYBW || Dai || BokkyPooBahsDateTimeContract) {
              // Set web3, accounts, and contract to the state, and then proceed with an
              // example of interacting with the contract's methods.
              this.setState({ 
                web3, 
                ganacheAccounts, 
                accounts, 
                balance, 
                networkId, 
                networkType, 
                hotLoaderDisabled,
                isMetaMask, 
                uniswap_aave_nybw: instanceUniswapAaveNYBW,
                lendingPool: instanceLendingPool,
                lendingPoolCore: instanceLendingPoolCore,
                lendingPoolAddressesProvider: instanceLendingPoolAddressesProvider,
                dai: instanceDai,
                zrx: instanceZRX,
                bat: instanceBAT,
                bokkypoobahs_datetime_contract: instanceBokkyPooBahsDateTimeContract,
                UNISWAP_AAVE_NYBW_ADDRESS: UNISWAP_AAVE_NYBW_ADDRESS,
                UNISWAP_V2_ROUTOR_01_ADDRESS: UNISWAP_V2_ROUTOR_01_ADDRESS,
                LENDINGPOOL: LENDINGPOOL,
                LENDINGPOOL_CORE: LENDINGPOOL_CORE,
                LENDINGPOOL_ADDRESS_PROVIDER: LENDINGPOOL_ADDRESS_PROVIDER,
                DAI_ADDRESS: DAI_ADDRESS,
              }, () => {
                this.refreshValues(
                  instanceUniswapAaveNYBW
                );
                setInterval(() => {
                  this.refreshValues(instanceUniswapAaveNYBW);
                }, 5000);
              });
            }
            else {
              this.setState({ web3, ganacheAccounts, accounts, balance, networkId, networkType, hotLoaderDisabled, isMetaMask });
            }
          }
        } catch (error) {
          // Catch any errors for any of the above operations.
          alert(
            `Failed to load web3, accounts, or contract. Check console for details.`,
          );
          console.error(error);
        }
    }


    render() {
        const { accounts, poolTogether_nybw } = this.state;

        return (
            <div className={styles.widgets}>
                <Grid container style={{ marginTop: 32 }}>
                    <Grid item xs={12}>
                        <Card width={"auto"} 
                              maxWidth={"420px"} 
                              mx={"auto"} 
                              my={5} 
                              p={20} 
                              borderColor={"#E8E8E8"}
                        >
                            <h4>Uniswap Aave NYBW Hack 2020</h4> <br />

                            <Button size={'small'} mt={3} mb={2} onClick={this.createUniToken}> Create UNItoken </Button> <br />

                            <Button size={'small'} mt={3} mb={2} onClick={this.addLiquidity}> Add Liquidity </Button> <br />

                            <Button size={'small'} mt={3} mb={2} onClick={this.mintUniToken}> Mint UNItoken </Button> <br />

                            <hr />

                            <Button size={'small'} mt={3} mb={2} onClick={this.depositToAaveMarket}> Deposit To AaveMarket </Button> <br />

                            <hr />

                            <Button mainColor="DarkCyan" size={'small'} mt={3} mb={2} onClick={this.getPair}> Get Pair </Button> <br />

                            <Button mainColor="DarkCyan" size={'small'} mt={3} mb={2} onClick={this.getUniToken}> Get UniToken </Button> <br />

                            <Button mainColor="DarkCyan" size={'small'} mt={3} mb={2} onClick={this._getTotalSupplyOfUniToken}> Get TotalSupply Of UniToken </Button> <br />

                            <Button mainColor="DarkCyan" size={'small'} mt={3} mb={2} onClick={this._getLendingPoolManagerAddress}> Get LendingPoolManager Address </Button> <br />

                            <Button mainColor="DarkCyan" size={'small'} mt={3} mb={2} onClick={this._balanceOfContract}> Balance of contract </Button> <br />
                        </Card>

                        <Card width={"auto"} 
                              maxWidth={"420px"} 
                              mx={"auto"} 
                              my={5} 
                              p={20} 
                              borderColor={"#E8E8E8"}
                        >
                            <h4>Test Functions</h4> <br />
                            <Button mainColor="DarkCyan" size={'small'} mt={3} mb={2} onClick={this.timestampFromDate}> Timestamp From Date </Button> <br />
                        </Card>
                    </Grid>

                    <Grid item xs={4}>
                    </Grid>

                    <Grid item xs={4}>
                    </Grid>
                </Grid>
            </div>
        );
    }

}
