pragma solidity ^0.5.16;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";

// Use original Ownable.sol
import "./lib/OwnableOriginal.sol";

// Storage
import "./storage/McStorage.sol";
import "./storage/McConstants.sol";

// Uniswap-v2
import "./uniswap-v2/uniswap-v2-core/contracts/interfaces/IUniswapV2Factory.sol";
import "./uniswap-v2/uniswap-v2-core/contracts/interfaces/IUniswapV2Pair.sol";
import "./uniswap-v2/uniswap-v2-core/contracts/interfaces/IUniswapV2ERC20.sol";
import "./uniswap-v2/uniswap-v2-periphery/contracts/interfaces/IUniswapV2Router01.sol";


/***
 * @notice - This contract is that ...
 **/
contract StakeholderRegistry is OwnableOriginal(msg.sender), McStorage, McConstants {
    using SafeMath for uint;

    IERC20 public dai;
    IUniswapV2Factory public uniswapV2Factory;
    IUniswapV2Router01 public uniswapV2Router01;

    constructor(address _erc20, address _uniswapV2Factory, address _uniswapV2Router01) public {
        dai = IERC20(_erc20);
        uniswapV2Factory = IUniswapV2Factory(_uniswapV2Factory);
        uniswapV2Router01 = IUniswapV2Router01(_uniswapV2Router01);
    }


    /***
     * @notice - Uniswap-v2 / Create Pair (=Create UNItoken)
     **/
    function createUniToken(address _tokenA, address _tokenB) public {
        address _pair = uniswapV2Factory.createPair(_tokenA, _tokenB);
        emit _PairCreated(_tokenA, _tokenB, _pair);   
    }

    function mintUniToken(address _pair, address _to) public {
        /// Mint UniToken
        IUniswapV2Pair uniswapV2Pair = IUniswapV2Pair(_pair);
        uint _liquidity = uniswapV2Pair.mint(_to);
        emit MintUniToken(_pair, _to, _liquidity);
    }

    function _getPair(address _tokenA, address _tokenB) public view returns (address _pair) {
        address _pair = uniswapV2Factory.getPair(_tokenA, _tokenB);
        return _pair;
    }

    function getUniToken(address _pair) public view returns (string memory _name, string memory _symbol, uint _decimals) {
        IUniswapV2ERC20 uniswapV2ERC20 = IUniswapV2ERC20(_pair);
        string memory _name = uniswapV2ERC20.name();
        string memory _symbol = uniswapV2ERC20.symbol();
        uint _decimals = uniswapV2ERC20.decimals();
        return (_name, _symbol, _decimals);
    }

    function getTotalSupplyOfUniToken(address _pair) public view returns (uint _totalSupplyOfUniToken) {
        IUniswapV2ERC20 uniswapV2ERC20 = IUniswapV2ERC20(_pair);
        uint _totalSupplyOfUniToken = uniswapV2ERC20.totalSupply();
        return _totalSupplyOfUniToken;  
    }



    /***
     * @notice - Get balance
     **/
    function balanceOfContract() public view returns (uint balanceOfContract_DAI, uint balanceOfContract_ETH) {
        return (dai.balanceOf(address(this)), address(this).balance);
    }

}
