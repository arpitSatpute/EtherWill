// SPDX-License-Identifier: MIT

pragma solidity ^0.8.27;

import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";
import { ReentrancyGuard } from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import { AggregatorV3Interface } from "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";



contract Inheritance is Ownable, ReentrancyGuard{

    AggregatorV3Interface internal datafeed;
    uint256 public constant INACTIVITY_PERIOD = 180 days;

    
    struct Will {
        address beneficiary;
        uint256 amount;
    }
    
    mapping(address => Will) public heirWill;       // relation of heir to will
    mapping(address => address) public heir;        // relation of beneficiary => heir
    mapping(address => uint256) public lastPing;    // heir => ping_time

    
    error NotABeneficiary(string message);
    error AlreadyHeir(string message);
    error WillNotFound(string message);
    error ClaimFailed(string message);


    event Claimed(address beneficiary, address heir, uint256 amount, uint256 timestamp);
    event WillSet(address heir, address beneficiary, uint256 amount);
    event WillAmountUpdated(address heir, uint256 amount);
    event BeneficiaryUpdated(address heir, address beneficiary);
    event Ping(address heir, uint256 pingTime);
    event Withdraw(address heir, uint256 amount);
    event WillRevoked(address heir, uint256 amount);

    constructor() Ownable(msg.sender) {
        datafeed = AggregatorV3Interface(0x694AA1769357215DE4FAC081bf1f309aDC325306);
    }

    // Set Will and Beneficiary

    function setWillAndBeneficiary(address _beneficiary) public payable {

        require(_beneficiary != address(0), "Invalid beneficiary");        
        require(_beneficiary != msg.sender, "Cannot set yourself as beneficiary");
        require(heirWill[msg.sender].beneficiary == address(0), "Will already exists");

        // check amount is equivalent to 100 usd after integrating chain link oracle

        uint256 ethInUsd = getAnswerFromChainLinkDataFeed(msg.value);
        uint256 minUsd = 100 * (10 ** uint256(datafeed.decimals()));
        require(ethInUsd >= minUsd, "Require at least $100");


        heirWill[msg.sender] = Will({
            beneficiary: _beneficiary,
            amount: msg.value
        });

        heir[_beneficiary] = msg.sender;
        lastPing[msg.sender] = block.timestamp;

        emit WillSet(msg.sender, _beneficiary, msg.value);
    }


    // Update Will

    function updateBeneficiary(address _newBeneficiary) external {

       require(_newBeneficiary != address(0), "Invalid beneficiary");       
       require(heirWill[msg.sender].beneficiary != address(0), "No will found");
       require(_newBeneficiary != heirWill[msg.sender].beneficiary, "Beneficiary address is similar to existing");
       require(_newBeneficiary != msg.sender, "Heir can't be a beneficiary");

       address oldBeneficiary = heirWill[msg.sender].beneficiary;
       delete heir[oldBeneficiary];

       heirWill[msg.sender].beneficiary = _newBeneficiary;

       heir[_newBeneficiary] = msg.sender;

       emit BeneficiaryUpdated(msg.sender, _newBeneficiary);
    }


    // Update Will Amount 

    function updateWillAmount() public payable {
        require(msg.value > 0, "Will amount updated must be greeater than 0");

        heirWill[msg.sender].amount += msg.value;

        emit WillAmountUpdated(msg.sender, msg.value);
    }


    // Ping

    function ping() external {
       
        require(heirWill[msg.sender].beneficiary != address(0), "No will found");
        lastPing[msg.sender] = block.timestamp;
        emit Ping(msg.sender, block.timestamp);

    }


    // Withdraw

    function withdraw(uint256 _amount) external nonReentrant{
        require(heirWill[msg.sender].beneficiary != address(0), "No Will Found");
        uint256 totalWillAmount = heirWill[msg.sender].amount;
        require( totalWillAmount >= _amount, "Amount must be less than Total Will amount");
        require( address(this).balance >= _amount, "Contract has insufficient funds");

        heirWill[msg.sender].amount -= _amount;
        
        (bool success, ) = msg.sender.call{value: _amount} ("");
        require(success, "Transfer failed");


        emit Withdraw(msg.sender, _amount);
    }


    // Revoke Will 

    function revokeWill() external nonReentrant {
        
        require(heirWill[msg.sender].beneficiary != address(0), "No Will Found");
        uint256 refund = heirWill[msg.sender].amount;
        address beneficiary = heirWill[msg.sender].beneficiary;

        delete heirWill[msg.sender];
        delete heir[beneficiary];
        delete lastPing[msg.sender];
        
        if(refund > 0) {
            (bool success, ) = msg.sender.call{value: refund} ("");
            require(success, "Transfer failed");
        }

        emit WillRevoked(msg.sender, refund);
    }


    // Claim

    function claim() external nonReentrant {
        address heirOfBeneficiary = heir[msg.sender];
        require(heirOfBeneficiary != address(0), "No heir found for this address");

        uint256 amount = heirWill[heirOfBeneficiary].amount;
        require(amount > 0, "No Will amount set");

        if(heirWill[heirOfBeneficiary].beneficiary != msg.sender) {
            revert NotABeneficiary("You are not set as Beneficiary in Heir's Will");
        }
        
        // check ping status

        if(canClaim(heirOfBeneficiary)) {
            
            // delete Will status
            // delete mappings heir and heirWill

            delete heirWill[heirOfBeneficiary];
            delete heir[msg.sender];
            delete lastPing[heirOfBeneficiary];
            
            // send ether to beneficiary

            (bool success, ) = msg.sender.call{value: amount} ("");
            require(success, "Claim Failed for unknown reason");
        }
        else {
            revert ClaimFailed("Claim Failed. last Ping within the period of 180 days");
        }

        // emit event
        emit Claimed(msg.sender, heirOfBeneficiary, amount, block.timestamp);

    }

    // Check Claim Period isActive or not

    function canClaim(address _heir) public view returns (bool) {
        uint256 pingTime = lastPing[_heir];
        return block.timestamp >= pingTime + INACTIVITY_PERIOD;
    }


    // View Will Details

    function getWillDetails(address _heir) external view returns (Will memory, uint256) {
        uint256 claimAt = lastPing[_heir] + INACTIVITY_PERIOD;
        uint256 remaining = block.timestamp >= claimAt ? 0 : claimAt - block.timestamp;
        return (heirWill[_heir], remaining);
    }


    // Getting ETH in USD from chainlink oracle

    function getAnswerFromChainLinkDataFeed(uint256 amount) public view returns(uint256) {
        (, int256 answer, , , ) = datafeed.latestRoundData();

        require(answer > 0, "Invalid price");

        uint256 ethPrice = uint256(answer);
        uint256 usdValue = (amount * ethPrice) / 1e18;
 

        return usdValue;
    }    

    receive() external payable {

        require(heirWill[msg.sender].beneficiary != address(0), "Set the beneficiary first");     
        
        updateWillAmount();
    }
}
