// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "../interfaces/IInsurancePool.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
// import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "../interfaces/IToken.sol";

error FAILED_TRANSACTION();

// Insurance Pool Contract
contract InsurancePool is IInsurancePool, Ownable {
    IToken public safeToken;
    mapping(address => LiquidityProvider) public providers;
    mapping(address => uint256) public rewardsOfProviders;
    uint256 public totalLiquidity;
    uint256 public rewardRate; // Rewards per second per safe
    address public policyManager;
    event PremiumReceived(address _addr, uint256 _premium);
    event ClaimPaid(address to, uint256 claimPaid);

    constructor(address _safeToken) Ownable(msg.sender){
        safeToken = IToken(_safeToken);
    }

    modifier onlyPolicyManager() {
        require(msg.sender == policyManager, "Caller is not the PolicyManager");
        _;
    }

    function setPolicyManager(address _policyManager) external onlyOwner {
        policyManager = _policyManager;
    }

    function provideLiquidity() external payable override{
        safeToken.approve(address(this),msg.value);       
        safeToken.transferFrom(address(this),msg.sender,msg.value);  
        updateRewards(msg.sender);
        providers[msg.sender].balance += msg.value;
        totalLiquidity += msg.value;
        emit LiquidityProvided(msg.sender, msg.value);
    }

    function checkTransferFrom() public{
        require(safeToken.allowance(msg.sender,address(this))>=1e16,"Less allowance than needed");
        require(safeToken.balanceOf(address(this))>1e16,"Insufficient funds");
        safeToken.approve(address(this),1e16);
        safeToken.transferFrom(address(this),msg.sender,1e16);
    }
    function withdrawLiquidity(uint256 amount) external override    {
        require(providers[msg.sender].balance >= amount, "Insufficient balance");
        updateRewards(msg.sender);
        providers[msg.sender].balance -= amount;
        totalLiquidity -= amount;
        safeToken.burn(msg.sender,amount);
        payable(msg.sender).transfer(amount);
        emit LiquidityWithdrawn(msg.sender, amount);
    }

    function claimRewards() external override    {
        updateRewards(msg.sender);
        uint256 rewards = providers[msg.sender].balance;
        if (rewards > 0) {
            providers[msg.sender].balance = 0;
            require(safeToken.transfer(msg.sender, rewards), "Transfer failed");
            (bool success,) = payable(msg.sender).call{value: rewards}("");
            if(!success){
                revert("XFI Tokens transfer failed");
            }
            emit RewardsClaimed(msg.sender, rewards);
        }
    }   

    function updateRewards(address provider) internal {
        uint256 timeElapsed = block.timestamp - providers[provider].lastUpdateTime;
        uint256 rewards = (providers[provider].balance * rewardRate * timeElapsed) / 1e18;
        providers[provider].balance += rewards;
        providers[provider].lastUpdateTime = block.timestamp;
        rewardsOfProviders[provider] += rewards;
    }

    function receivePremium(address from, uint256 amount) external payable override onlyPolicyManager {
        require(msg.value==amount,"Insufficient Funds Transferred");
        totalLiquidity += amount;
        emit PremiumReceived(from, amount);
    }

    function payClaim(address to, uint256 amount) external override onlyPolicyManager {
        require(totalLiquidity >= amount, "Insufficient liquidity for claim");
        totalLiquidity -= amount;
        (bool success,) = payable(to).call{value: amount}("");
        if(!success){
            revert("Transfer failed");
        }
        emit ClaimPaid(to, amount);
    }

    function getProviderBalance(address provider) external view override returns (uint256) {
        return providers[provider].balance;
    }

    function getTotalLiquidity() external view override returns (uint256) {
        return totalLiquidity;
    }

    function setRewardRate(uint256 _rewardRate) external onlyOwner {
        rewardRate = _rewardRate;
    }
}