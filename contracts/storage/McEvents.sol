pragma solidity ^0.5.16;

import "./McObjects.sol";


contract McEvents {


    event _PairCreated(
        address indexed _token0, 
        address indexed _token1, 
        address _pair
    );


    /***
     * @dev - Example
     **/
    event Example(
        uint256 indexed Id, 
        uint256 exchangeRateCurrent,
        address msgSender,
        uint256 approvedValue    
    );

}
