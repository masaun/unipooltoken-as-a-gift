# Uniswap🦄 × AAVE📈 NYBW Hack 2020

***
## 【Introduction of Uniswap🦄 × AAVE📈 NYBW Hack 2020】
- This is a dApp

&nbsp;

## 【User Flow】
- ① 
- ②
- ③
- ④

&nbsp;

***

## 【Setup】
### Setup wallet by using Metamask
1. Add MetaMask to browser (Chrome or FireFox or Opera or Brave)    
https://metamask.io/  


2. Adjust appropriate newwork below 
```
Kovan Test Network
```

&nbsp;


### Setup backend
1. Deploy contracts to Kovan Test Network
```
(root directory)

$ npm run migrate:Kovan
```

&nbsp;


### Setup frontend
1. Move to `./client`
```
$ cd client
```

2. Add an `.env` file under the directory of `./client`.
```
$ cp .env.example .env
```

3. Execute command below in root directory.
```
$ npm run client
```

4. Access to browser by using link 
```
http://127.0.0.1:3000/pooltogether-nybw-hack-2020
```

&nbsp;


***

## 【References】
- [Uniswap-v2]：  
  - Bounty   
    - https://gitcoin.co/issue/aave/aave-gitcoin-hackaton-2019/8/4326  
    - https://gitcoin.co/issue/Uniswap/uniswap-v2-core/76/4324  

  - Repos
    - uniswap-v2-core  
      https://github.com/Uniswap/uniswap-v2-core
    - uniswap-v2-periphery  
      https://github.com/Uniswap/uniswap-v2-periphery
    - uniswap-lib  
      https://github.com/Uniswap/uniswap-lib 

  - Doc  
    - Uniswap-v2 / Factory Contract（Crete Pare）  
      https://uniswap.org/docs/v2/smart-contracts/factory/

  - Article
    - Uniswap V2 Mainnet Launch
      https://uniswap.org/blog/launch-uniswap-v2/
