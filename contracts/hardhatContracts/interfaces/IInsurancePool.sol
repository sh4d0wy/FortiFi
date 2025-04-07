// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// Insurance Pool Interface
interface IInsurancePool {
    event LiquidityProvided(address provider, uint256 amount);
    event LiquidityWithdrawn(address provider, uint256 amount);
    event RewardsClaimed(address provider, uint256 amount);
    
    struct LiquidityProvider {
        uint256 balance;
        uint256 lastUpdateTime;
    }

    function provideLiquidity() payable external;
    function withdrawLiquidity(uint256 amount) external;
    function claimRewards() external;
    function getProviderBalance(address provider) external view returns (uint256);
    function getTotalLiquidity() external view returns (uint256);
    function receivePremium(address from, uint256 amount) external payable;
    function payClaim(address to, uint256 amount) external;
}