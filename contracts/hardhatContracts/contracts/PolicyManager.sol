// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/interfaces/IERC20.sol";
import "../interfaces/IPolicyManager.sol";
import "../interfaces/IInsurancePool.sol";
import "../interfaces/IToken.sol";

// Policy Manager Contract
contract PolicyManager is IPolicyManager, Ownable {
    IToken public safeToken;
    IInsurancePool public insurancePool;
    mapping(uint256 => Policy) public policies;
    uint256 public nextPolicyId = 1;
    uint256 public nextClaimId = 1;
    mapping(address user=>uint256[] policyIdArray) public addressToPolicy;
    mapping(uint256 => Claim) public Claims;
    Claim[] public UnverifiedClaims;

    constructor(address _safeToken, address _insurancePool) Ownable(msg.sender){
        safeToken = IToken(_safeToken);
        insurancePool = IInsurancePool(_insurancePool);
    }

    modifier checkPolicyId(uint256 policyId){
        uint256[] storage policyIdArray = addressToPolicy[msg.sender];
        bool flag = false;
        for(uint256 index = 0;index<policyIdArray.length;index++){
            if(policyId==index){
                flag = true;
            }
        }
        if(!flag){
            revert("User does not purchased policy");
        }
        _;
    }

    function checkOwnershipOfPolicy(uint256 policyId,address owner) view public returns(bool){
         uint256[] storage policyIdArray = addressToPolicy[owner];
        bool flag = false;
        for(uint256 index = 1;index<policyIdArray.length;index++){
            if(policyId==index){
                flag = true;
            }
        }
        return flag;
    }

    function createPolicy(string memory _title,uint256 coverageAmount,string memory _description, uint256 expirationDate, string memory coverageType) external onlyOwner override     returns (uint256) {
        uint256 premium = calculatePremium(coverageAmount, expirationDate, coverageType);
        require(safeToken.transferFrom(msg.sender, address(insurancePool), premium), "Premium payment failed");

        uint256 policyId = nextPolicyId++;

        policies[policyId] = Policy({
            id:policyId,
            title:_title,
            description:_description,
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

    function purchasePolicy(uint256 policyId) payable external{
        Policy storage policy = policies[policyId];
        require(block.timestamp <= policy.expirationDate, "Policy expired");
        uint256 premium = policy.premium;      
        require(msg.value==premium,"Insufficient funds sent");
        insurancePool.receivePremium{value:msg.value}(msg.sender,msg.value);
        addressToPolicy[msg.sender].push(policyId);
        emit PolicyPurchased(policyId,msg.sender);
    }

    function claimPolicy(uint256 policyId,string memory _documentIPFSHash,string memory _description) external   {
        Claims[nextClaimId]  = Claim({
            claimId : nextClaimId,
            policyId : policyId,
            buyerAddress:msg.sender,
            documentIPFSHash : _documentIPFSHash,
            description : _description,
            isVerified : false,
            isPaid : false
        });
        UnverifiedClaims.push(Claims[nextClaimId]);
        nextClaimId++;
        emit ClaimCreated(policyId,msg.sender,_description);
    }

    function verifyClaim(uint256 claimId) external onlyOwner{
        Claim storage claim = Claims[claimId];
        uint256 policyId = claim.policyId;
        Policy storage policy = policies[policyId];
        bool flag = checkOwnershipOfPolicy(policyId, msg.sender);
        
        require(claimId>=0,"Claim does not exist");
        require(claimId<=UnverifiedClaims.length, "Claim does not exist");
        require(flag,"User doesn't purchased the policy");
        
        try insurancePool.payClaim(claim.buyerAddress, policy.coverageAmount){}
        catch{revert("Claim Pay Failed");}
        
        claim.isVerified=true;
        claim.isPaid=true;

        delete addressToPolicy[msg.sender][policyId];
        delete UnverifiedClaims[claimId];
        emit PolicyClaimed(policyId, msg.sender, policy.coverageAmount);
    }

    function payPremium(uint256 userPolicyId) checkPolicyId(userPolicyId) external payable     {
        Policy storage policy = policies[userPolicyId];
        require(block.timestamp <= policy.expirationDate, "Policy expired");
        uint256 premium = policy.premium;
        require(msg.value==premium,"Insufficient funds sent");
        insurancePool.receivePremium{value:msg.value}(msg.sender,msg.value);
        policy.nextPremiumDate = block.timestamp + 188 days;
        emit PremiumPaid(userPolicyId, msg.sender, premium);
    }

    function getPolicyDetails(uint256 policyId) external view returns (Policy memory) {
        return policies[policyId];
    }

    function getAllPolicies() external view returns (Policy[] memory) {
        uint256 policyCount = nextPolicyId;
        Policy[] memory policiesArray = new Policy[](policyCount);
        for(uint256 index=1; index < policyCount; index++){
            policiesArray[index] = policies[index];
        }
        return policiesArray;
     }

    function getAllPoliciesForUser(address user) public view returns (Policy[] memory) {
        uint256 policyCount = addressToPolicy[user].length;
        Policy[] memory policiesOfUser = new Policy[](policyCount);
        for(uint256 index=1; index < policyCount; index++){
            policiesOfUser[index] = policies[index];
        }
        return policiesOfUser;
     }

    function getAllUnverifiedClaims() external view returns(Claim[] memory){
        return UnverifiedClaims;
    }

    function calculatePremium(uint256 coverageAmount, uint256 duration, string memory coverageType) public view returns (uint256) {
        uint256 baseRate = 1; // 1% per year
        if (keccak256(bytes(coverageType)) == keccak256(bytes("exchange_hack"))) {
            baseRate = 2; // 2% per year for exchange hack coverage
        } else if (keccak256(bytes(coverageType)) == keccak256(bytes("defi_risk"))) {
            baseRate = 3; // 3% per year for general DeFi risk
        }
        return (coverageAmount * baseRate * (duration-block.timestamp)) / (365 days*100);
    }
}







