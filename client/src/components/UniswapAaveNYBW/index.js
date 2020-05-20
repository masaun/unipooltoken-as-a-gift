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
        this.mintUniToken = this.mintUniToken.bind(this);

        /////// Getter Functions
        this.getPair = this.getPair.bind(this);
        this.getUniToken = this.getUniToken.bind(this);
        this._getTotalSupplyOfUniToken = this._getTotalSupplyOfUniToken.bind(this);
        this._balanceOfContract = this._balanceOfContract.bind(this);

        /////// Test Functions
        this.timestampFromDate = this.timestampFromDate.bind(this);
    }

    /***
     * @notice - Uniswap-v2
     **/
    createUniToken = async () => {
        const { accounts, web3, dai, uniswap_aave_nybw } = this.state;

        //const _tokenA = tokenAddressList["Rinkeby"]["DAI"];
        const _tokenA = tokenAddressList["Rinkeby"]["ZRX"];
        const _tokenB = tokenAddressList["Rinkeby"]["BAT"];

        let res = await uniswap_aave_nybw.methods.createUniToken(_tokenA, _tokenB).send({ from: accounts[0] });
        console.log('=== createUniToken() ===\n', res);
    }

    mintUniToken = async () => {
        const { accounts, web3, dai, uniswap_aave_nybw } = this.state;

        const _pair = "0xFba8f6edfc207B1cC536eb49079b02f29139c95a";    // Pair of BAT and DAI on Rinkeby 
        //const _pair = "0xaC62050E010E068af361476A69D9e3412CfDe429";  // Pair of BAT and ZRX on Rinkeby
        const _to = walletAddressList["WalletAddress1"];

        let res = await uniswap_aave_nybw.methods.mintUniToken(_pair, _to).send({ from: accounts[0] });
        console.log('=== mintUniToken() ===\n', res);
    }


    /***
     * @notice - Getter function
     **/
    getPair = async () => {
        const { accounts, web3, dai, uniswap_aave_nybw } = this.state;

        //const _tokenA = tokenAddressList["Rinkeby"]["DAI"];
        const _tokenA = tokenAddressList["Rinkeby"]["ZRX"];
        const _tokenB = tokenAddressList["Rinkeby"]["BAT"];

        let res = await uniswap_aave_nybw.methods._getPair(_tokenA, _tokenB).call();
        console.log('=== _getPair() ===\n', res);
    }

    getUniToken = async () => {
        const { accounts, web3, dai, uniswap_aave_nybw } = this.state;

        const _pair = "0xFba8f6edfc207B1cC536eb49079b02f29139c95a";    // Pair of BAT and DAI on Rinkeby 
        //const _pair = "0xaC62050E010E068af361476A69D9e3412CfDe429";  // Pair of BAT and ZRX on Rinkeby

        let res = await uniswap_aave_nybw.methods.getUniToken(_pair).call();
        console.log('=== getUniToken() ===\n', res);
    }

    _getTotalSupplyOfUniToken = async () => {
        const { accounts, web3, dai, uniswap_aave_nybw } = this.state;

        const _pair = "0xFba8f6edfc207B1cC536eb49079b02f29139c95a";
        //const _pair = "0xaC62050E010E068af361476A69D9e3412CfDe429";  // Pair of BAT and ZRX on Rinkeby

        let res = await uniswap_aave_nybw.methods.getTotalSupplyOfUniToken(_pair).call();
        console.log('=== getTotalSupplyOfUniToken() ===\n', res);
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
        let Dai = {};
        let BokkyPooBahsDateTimeContract = {};
        try {
          UniswapAaveNYBW = require("../../../../build/contracts/StakeholderRegistry.json");  // Load artifact-file of StakeholderRegistry
          Dai = require("../../../../build/contracts/IERC20.json");               //@dev - DAI（Underlying asset）
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

            //@dev - Create instance of DAI-contract
            let instanceDai = null;
            let DAI_ADDRESS = tokenAddressList["Rinkeby"]["DAI"]; //@dev - DAI（on Rinkeby）
            instanceDai = new web3.eth.Contract(
              Dai.abi,
              DAI_ADDRESS,
            );
            console.log('=== instanceDai ===', instanceDai);

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
                dai: instanceDai,
                bokkypoobahs_datetime_contract: instanceBokkyPooBahsDateTimeContract,
                UNISWAP_AAVE_NYBW_ADDRESS: UNISWAP_AAVE_NYBW_ADDRESS,
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

                            <Button size={'small'} mt={3} mb={2} onClick={this.mintUniToken}> Mint UNItoken </Button> <br />

                            <Button mainColor="DarkCyan" size={'small'} mt={3} mb={2} onClick={this.getPair}> Get Pair </Button> <br />

                            <Button mainColor="DarkCyan" size={'small'} mt={3} mb={2} onClick={this.getUniToken}> Get UniToken </Button> <br />

                            <Button mainColor="DarkCyan" size={'small'} mt={3} mb={2} onClick={this._getTotalSupplyOfUniToken}> Get TotalSupply Of UniToken </Button> <br />

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
