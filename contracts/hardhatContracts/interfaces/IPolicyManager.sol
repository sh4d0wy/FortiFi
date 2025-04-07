// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// Policy Manager Interface
interface IPolicyManager {
    event PolicyCreated(uint256 indexed policyId, address owner, uint256 coverageAmount, uint256 premium, uint256 expirationDate);
    event PolicyClaimed(uint256 indexed policyId, address owner, uint256 claimAmount);
    event PolicyPurchased(uint256 indexed policyId, address buyer);
    event PremiumPaid(uint256 indexed policyId, address buyer,uint256 amountPaid);
    event ClaimCreated(uint256 indexed policyId, address buyer,string description);

    struct Policy {
        uint256 id;
        address owner;
        string title;
        string description;
        uint256 coverageAmount;
        uint256 premium;
        uint256 expirationDate;
        bool isActive;
        string coverageType; // e.g., "smart_contract_failure", "exchange_hack", "defi_risk"
        uint256 nextPremiumDate;
    }
    struct Claim{
        uint256 claimId;
        uint256 policyId;
        bool isVerified;
        bool isPaid;
        address buyerAddress;
        string documentIPFSHash;
        string description;
    }
    

    function createPolicy(string memory title,uint256 coverageAmount, string memory description,uint256 duration, string memory coverageType) external returns (uint256);
    // function claimPolicy(uint256 policyId,string memory documentIPFSHash, string memory description) external;
    // function verifyClaim(uint256 claimsId) external;
    // function getAllPolicies() external view returns (Policy[] memory);
}