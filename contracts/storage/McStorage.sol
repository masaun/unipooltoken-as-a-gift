pragma solidity ^0.5.16;
pragma experimental ABIEncoderV2;

import "./McObjects.sol";
import "./McEvents.sol";


// shared storage
contract McStorage is McObjects, McEvents {

    ///////////////////////////////////
    // @dev - Define as memory
    ///////////////////////////////////
    address[] exampleGroups;

    
    //////////////////////////////////
    // @dev - Define as storage
    ///////////////////////////////////
    ExampleObject[] public exampleObjects;

    mapping (uint256 => Sample) samples;

}
