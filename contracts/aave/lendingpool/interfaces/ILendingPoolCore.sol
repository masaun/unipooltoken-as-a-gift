pragma solidity ^0.5.16;

import "../../configuration/LendingPoolAddressesProvider.sol";


interface ILendingPoolCore {
    function getReserveCurrentLiquidityRate(address _reserve) external view returns (uint256);
    function getReserveInterestRateStrategyAddress(address _reserve) external view returns (address);
    function getReserveTotalBorrowsStable(address _reserve) external view returns (uint256);
    function getReserveTotalBorrowsVariable(address _reserve) external view returns (uint256);
    function getReserveCurrentAverageStableBorrowRate(address _reserve) external view returns (uint256);
    function getReserveAvailableLiquidity(address _reserve) external view returns (uint256);

    function initialize(LendingPoolAddressesProvider _addressesProvider) external;  /// _addressesProvider is contract address of LendingPoolAddressesProvider.sol
    function activateReserve(address _reserve) external;
}
