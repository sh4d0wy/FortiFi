// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../interfaces/IToken.sol";
import "../interfaces/IInsurancePool.sol";
contract Something{
    IToken public token;
    IInsurancePool public insurancePool;
    constructor(address safeTokenAddress,address insurancePoolAddress){
        token = IToken(safeTokenAddress);
        insurancePool = IInsurancePool(insurancePoolAddress);
    }
}