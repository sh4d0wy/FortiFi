// SPDX-License-Identifier: MIT
//0xDF933Cd647f69198D44cC0C6e982568534546f33 deployed on crossfi

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";    
import "../interfaces/IToken.sol";

contract SafeToken is ERC20,IToken,Ownable{
    using SafeERC20 for ERC20;
    event Minted(address indexed account, uint256 indexed amount);
    event Burned(address indexed account, uint256 indexed amount);
    constructor() ERC20("Safetoken","STK") Ownable(msg.sender){ 
    }
    function mint(address account, uint amount) public {
        _mint(account,amount);
        emit Minted(account,amount);
    }
    function burn(address account, uint amount) public {
        _burn(account,amount);
        emit Burned(account, amount);
     }
}