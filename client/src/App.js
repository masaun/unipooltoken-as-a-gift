import React, { Component } from "react";
import getWeb3, { getGanacheWeb3, Web3 } from "./utils/getWeb3";
import Header from "./components/Header/index.js";
import Footer from "./components/Footer/index.js";
import Hero from "./components/Hero/index.js";
import Web3Info from "./components/Web3Info/index.js";

// UniPoolToken as a Gift
import UniPoolTokenAsAGift from "./components/UniPoolTokenAsAGift/index.js";

import { Grid } from '@material-ui/core';
import { Loader, Button, Card, Input, Heading, Table, Form, Flex, Box, Image, EthAddress } from 'rimble-ui';
import { zeppelinSolidityHotLoaderOptions } from '../config/webpack';

import styles from './App.module.scss';
//import './App.css';



class App extends Component {
  constructor(props) {    
    super(props);

    this.state = {
      /////// Default state
      storageValue: 0,
      web3: null,
      accounts: null,
      route: window.location.pathname.replace("/", "")
    };
  }



  ///////--------------------- Functions of testFunc ---------------------------  


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
 
    let UniPoolTokenAsAGift = {};
    try {
      UniPoolTokenAsAGift = require("../../build/contracts/UniPoolTokenAsAGift.json");          // Load artifact-file of UniPoolTokenAsAGift
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

        let instanceUniPoolTokenAsAGift = null;
        let deployedNetwork = null;

        // Create instance of contracts
        if (UniPoolTokenAsAGift.networks) {
          deployedNetwork = UniPoolTokenAsAGift.networks[networkId.toString()];
          if (deployedNetwork) {
            instanceUniPoolTokenAsAGift = new web3.eth.Contract(
              UniPoolTokenAsAGift.abi,
              deployedNetwork && deployedNetwork.address,
            );
            console.log('=== instanceUniPoolTokenAsAGift ===', instanceUniPoolTokenAsAGift);
          }
        }

        if (UniPoolTokenAsAGift) {
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
            unipooltoken_as_a_gift: instanceUniPoolTokenAsAGift
          }, () => {
            this.refreshValues(
              instanceUniPoolTokenAsAGift
            );
            setInterval(() => {
              this.refreshValues(instanceUniPoolTokenAsAGift);
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

  componentWillUnmount() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  refreshValues = (instanceUniPoolTokenAsAGift) => {
    if (instanceUniPoolTokenAsAGift) {
      console.log('refreshValues of instanceUniPoolTokenAsAGift');
    }
  }

  renderLoader() {
    return (
      <div className={styles.loader}>
        <Loader size="80px" color="red" />
        <h3> Loading Web3, accounts, and contract...</h3>
        <p> Unlock your metamask </p>
      </div>
    );
  }

  renderDeployCheck(instructionsKey) {
    return (
      <div className={styles.setup}>
        <div className={styles.notice}>
          Your <b> contracts are not deployed</b> in this network. Two potential reasons: <br />
          <p>
            Maybe you are in the wrong network? Point Metamask to localhost.<br />
            You contract is not deployed. Follow the instructions below.
          </p>
        </div>
      </div>
    );
  }

  renderInstructions() {
    return (
      <div className={styles.wrapper}>
        <Hero />
      </div>
    );
  }

  renderUniPoolTokenAsAGift() {
    return (
      <div className={styles.wrapper}>
        <UniPoolTokenAsAGift />
      </div>
    );
  }

  render() {
    return (
      <div className={styles.App}>
        <Header />
          {this.state.route === '' && this.renderInstructions()}
          {this.state.route === 'unipooltoken-as-a-gift' && this.renderUniPoolTokenAsAGift()} 
        <Footer />
      </div>
    );
  }
}

export default App;
