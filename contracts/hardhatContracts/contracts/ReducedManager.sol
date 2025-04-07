// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../interfaces/IPolicyManager.sol";
import "../interfaces/IInsurancePool.sol";
import "../interfaces/IToken.sol";

contract ReducedManager is IPolicyManager {
    IToken public immutable safeToken;
    IInsurancePool public immutable insurancePool;
    
    mapping(uint256 => Policy) public policies;
    mapping(uint256 => Claim) public claims;
    mapping(address=> uint256[]) public addressToPolicy;
    uint256 public nextPolicyId;
    uint256 public nextClaimId;

    error PremiumPaymentFailed();
    error ClaimDoesNotExist();
    error ClaimPayFailed();

    constructor(address _safeToken, address _insurancePool)  {
        safeToken = IToken(_safeToken);
        insurancePool = IInsurancePool(_insurancePool);
    }

    function createPolicy(string calldata _title, uint256 coverageAmount, string calldata _description, uint256 expirationDate, string calldata coverageType) external override returns (uint256) {
        uint256 premium = (coverageAmount * 2 * (expirationDate - block.timestamp)) / (365 days * 100);
        if (!safeToken.transferFrom(msg.sender, address(insurancePool), premium)) {
            revert PremiumPaymentFailed();
        }

        uint256 policyId = nextPolicyId++;
        policies[policyId] = Policy({
            id: policyId,
            title: _title,
            description: _description,
            owner: msg.sender,
            coverageAmount: coverageAmount,
            premium: premium,
            expirationDate: expirationDate,
            isActive: true,
            coverageType: coverageType,
            nextPremiumDate: block.timestamp + 188 days
        });

        emit PolicyCreated(policyId, msg.sender, coverageAmount, premium, expirationDate);
        return policyId;
    }

    function claimPolicy(uint256 policyId, string calldata _documentIPFSHash, string calldata _description) external {
        uint256 claimId = nextClaimId++;
        claims[claimId] = Claim({
            claimId: claimId,
            policyId: policyId,
            buyerAddress: msg.sender,
            documentIPFSHash: _documentIPFSHash,
            description: _description,
            isVerified: false,
            isPaid: false
        });
        emit ClaimCreated(policyId, msg.sender, _description);
    }

    function purchasePolicy(uint256 policyId) external payable {
        insurancePool.receivePremium{value: msg.value}(msg.sender, msg.value);
        addressToPolicy[msg.sender].push(policyId);
        emit PolicyPurchased(policyId, msg.sender);
    }

    function getTotallengthOfPolicies() external view returns(uint256){
        uint256 length = addressToPolicy[msg.sender].length;
        return length;
    }
    function verifyClaim(uint256 claimId) external {
        if (claimId >= nextClaimId) revert ClaimDoesNotExist();

        Claim storage claim = claims[claimId];
        Policy storage policy = policies[claim.policyId];
        
        try insurancePool.payClaim(claim.buyerAddress, policy.coverageAmount) {
            claim.isVerified = true;
            claim.isPaid = true;
            emit PolicyClaimed(claim.policyId, msg.sender, policy.coverageAmount);
        } catch {
            revert ClaimPayFailed();
        }
    }
}