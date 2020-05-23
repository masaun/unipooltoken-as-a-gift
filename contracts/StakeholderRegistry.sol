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

// AAVE 
import "./aave/lendingpool/interfaces/ILendingPool.sol";
import "./aave/lendingpool/interfaces/ILendingPoolCore.sol";
import "./aave/lendingpool/interfaces/ILendingPoolProvider.sol";
import "./aave/lendingpool/interfaces/IInterestRateStrategy.sol";
import "./aave/lendingpool/interfaces/AToken.sol";


/***
 * @notice - This contract is that ...
 **/
contract StakeholderRegistry is OwnableOriginal(msg.sender), McStorage, McConstants {
    using SafeMath for uint;

    IERC20 public dai;
    IERC20 public zrx;
    IERC20 public bat;    
    IUniswapV2Factory public uniswapV2Factory;
    IUniswapV2Router01 public uniswapV2Router01;
    ILendingPool public lendingPool;
    ILendingPoolCore public lendingPoolCore;
    ILendingPoolProvider public lendingPoolProvider;
    AToken public aDai;

    address UNISWAP_V2_ROUTOR_01_ADDRESS;

    constructor(
        address daiAddress, 
        address zrxAddress, 
        address batAddress, 
        address _uniswapV2Factory, 
        address _uniswapV2Router01, 
        address _lendingPool, 
        address _lendingPoolCore, 
        address _lendingPoolProvider, 
        address _aDai
    ) public {
        dai = IERC20(daiAddress);
        zrx = IERC20(zrxAddress);
        bat = IERC20(batAddress);
        uniswapV2Factory = IUniswapV2Factory(_uniswapV2Factory);
        uniswapV2Router01 = IUniswapV2Router01(_uniswapV2Router01);
        lendingPool = ILendingPool(_lendingPool);
        lendingPoolCore = ILendingPoolCore(_lendingPoolCore);
        lendingPoolProvider = ILendingPoolProvider(_lendingPoolProvider);
        aDai = AToken(_aDai);

        UNISWAP_V2_ROUTOR_01_ADDRESS = _uniswapV2Router01;
    }


    /***
     * @notice - Uniswap-v2 / Create Pair (=Create UNItoken)
     **/
    function createUniToken(address _tokenA, address _tokenB) public {
        address _pair = uniswapV2Factory.createPair(_tokenA, _tokenB);
        emit _PairCreated(_tokenA, _tokenB, _pair);   
    }

    function _addLiquidity(
        address _tokenA,
        address _tokenB,
        uint _amountADesired,
        uint _amountBDesired,
        uint _amountAMin,
        uint _amountBMin,
        address _to
        //uint _deadline
    ) public {
        uint _amountA; 
        uint _amountB;
        uint _liquidity;

        /// Approve tokenA and tokenB for UniswapV2Router01.sol address
        zrx.approve(UNISWAP_V2_ROUTOR_01_ADDRESS, _amountADesired);
        bat.approve(UNISWAP_V2_ROUTOR_01_ADDRESS, _amountBDesired);

        /// Add liquidity
        uint _deadline = now + 30 days;
        (_amountA, _amountB, _liquidity) = uniswapV2Router01.addLiquidity(_tokenA,
                                                                          _tokenB,
                                                                          _amountADesired,
                                                                          _amountBDesired,
                                                                          _amountAMin,
                                                                          _amountBMin,
                                                                          _to,
                                                                          _deadline);
        emit _AddLiquidity(_amountA, _amountB, _liquidity);
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
     * @notice - AAVE
     **/
    function depositToAaveMarket(address _reserve, uint256 _amount, uint16 _referralCode) public returns (bool) {
        //lendingPoolCore.activateReserve(_reserve);
        IERC20(_reserve).approve(lendingPoolProvider.getLendingPoolCore(), _amount);
        lendingPool.deposit(_reserve, _amount, _referralCode);
    }

    /***
     * @notice - Get balance
     **/
    function balanceOfContract() public view returns (uint balanceOfContract_DAI, uint balanceOfContract_ETH) {
        return (dai.balanceOf(address(this)), address(this).balance);
    }

}
