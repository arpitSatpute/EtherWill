// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import {Test, console} from "forge-std/Test.sol";
import {Inheritance} from "../src/Inheritance.sol";
import {AggregatorV3Interface} from "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";

contract MockV3Aggregator {
    uint8 public decimals = 8;
    int256 public latestAnswer;

    constructor(int256 _initialAnswer) {
        latestAnswer = _initialAnswer;
    }

    function latestRoundData() external view returns (uint80, int256, uint256, uint256, uint80) {
        return (0, latestAnswer, 0, 0, 0);
    }
}

contract InheritanceTest is Test {
    Inheritance public inheritance;
    MockV3Aggregator public mockAggregator;
    
    address public owner;
    address public heir = address(0x1);
    address public beneficiary = address(0x2);
    address public other = address(0x3);

    address constant AGGREGATOR_ADDRESS = 0x694AA1769357215DE4FAC081bf1f309aDC325306;

    function setUp() public {
        owner = address(this);
        
        // Mock decimals() call
        vm.mockCall(
            AGGREGATOR_ADDRESS,
            abi.encodeWithSelector(AggregatorV3Interface.decimals.selector),
            abi.encode(uint8(8))
        );

        // Mock latestRoundData() call
        // 1 ETH = $2000 (8 decimals)
        vm.mockCall(
            AGGREGATOR_ADDRESS,
            abi.encodeWithSelector(AggregatorV3Interface.latestRoundData.selector),
            abi.encode(uint80(1), int256(2000 * 1e8), uint256(1), uint256(1), uint80(1))
        );
        
        inheritance = new Inheritance();
    }

    function test_SetWillAndBeneficiary() public {
        vm.startPrank(heir);
        vm.deal(heir, 1 ether);
        
        // 0.1 ETH @ $2000/ETH = $200 (sufficient)
        inheritance.setWillAndBeneficiary{value: 0.1 ether}(beneficiary);
        
        (Inheritance.Will memory will, uint256 remaining) = inheritance.getWillDetails(heir);
        assertEq(will.beneficiary, beneficiary);
        assertEq(will.amount, 0.1 ether);
        assertEq(remaining, inheritance.INACTIVITY_PERIOD());
        assertEq(inheritance.heir(beneficiary), heir);
        vm.stopPrank();
    }

    function test_SetWillAndBeneficiary_FailLowAmount() public {
        vm.startPrank(heir);
        vm.deal(heir, 1 ether);
        
        // 0.04 ETH @ $2000/ETH = $80 (insufficient, min is $100)
        vm.expectRevert("Require at least $100");
        inheritance.setWillAndBeneficiary{value: 0.04 ether}(beneficiary);
        vm.stopPrank();
    }

    function test_UpdateBeneficiary() public {
        vm.startPrank(heir);
        vm.deal(heir, 1 ether);
        inheritance.setWillAndBeneficiary{value: 0.1 ether}(beneficiary);
        
        inheritance.updateBeneficiary(other);
        
        (Inheritance.Will memory will, ) = inheritance.getWillDetails(heir);
        assertEq(will.beneficiary, other);
        assertEq(inheritance.heir(other), heir);
        assertEq(inheritance.heir(beneficiary), address(0));
        vm.stopPrank();
    }

    function test_UpdateBeneficiary_FailNoWill() public {
        vm.startPrank(heir);
        vm.expectRevert("No will found");
        inheritance.updateBeneficiary(other);
        vm.stopPrank();
    }

    function test_UpdateWillAmount() public {
        vm.startPrank(heir);
        vm.deal(heir, 1 ether);
        inheritance.setWillAndBeneficiary{value: 0.1 ether}(beneficiary);
        
        inheritance.updateWillAmount{value: 0.05 ether}();
        
        (Inheritance.Will memory will, ) = inheritance.getWillDetails(heir);
        assertEq(will.amount, 0.15 ether);
        vm.stopPrank();
    }

    function test_Ping() public {
        vm.startPrank(heir);
        vm.deal(heir, 1 ether);
        inheritance.setWillAndBeneficiary{value: 0.1 ether}(beneficiary);
        
        uint256 originalPing = inheritance.lastPing(heir);
        vm.warp(block.timestamp + 1000);
        
        inheritance.ping();
        
        assertEq(inheritance.lastPing(heir), block.timestamp);
        assertTrue(inheritance.lastPing(heir) > originalPing);
        vm.stopPrank();
    }

    function test_Ping_FailNoWill() public {
        vm.startPrank(heir);
        vm.expectRevert("No will found");
        inheritance.ping();
        vm.stopPrank();
    }

    function test_Withdraw() public {
        vm.startPrank(heir);
        vm.deal(heir, 1 ether);
        inheritance.setWillAndBeneficiary{value: 0.1 ether}(beneficiary);
        
        uint256 balanceBefore = heir.balance;
        inheritance.withdraw(0.04 ether);
        
        assertEq(heir.balance, balanceBefore + 0.04 ether);
        (Inheritance.Will memory will, ) = inheritance.getWillDetails(heir);
        assertEq(will.amount, 0.06 ether);
        vm.stopPrank();
    }

    function test_Withdraw_FailInsufficientFunds() public {
        vm.startPrank(heir);
        vm.deal(heir, 1 ether);
        inheritance.setWillAndBeneficiary{value: 0.1 ether}(beneficiary);
        
        vm.expectRevert("Amount must be less than Total Will amount");
        inheritance.withdraw(0.2 ether);
        vm.stopPrank();
    }

    function test_RevokeWill() public {
        vm.startPrank(heir);
        vm.deal(heir, 1 ether);
        inheritance.setWillAndBeneficiary{value: 0.1 ether}(beneficiary);
        
        uint256 balanceBefore = heir.balance;
        inheritance.revokeWill();
        
        assertEq(heir.balance, balanceBefore + 0.1 ether);
        (Inheritance.Will memory will, ) = inheritance.getWillDetails(heir);
        assertEq(will.beneficiary, address(0));
        vm.stopPrank();
    }

    function test_RevokeWill_FailNoWill() public {
        vm.startPrank(heir);
        vm.expectRevert("No Will Found");
        inheritance.revokeWill();
        vm.stopPrank();
    }

    function test_Claim() public {
        vm.startPrank(heir);
        vm.deal(heir, 1 ether);
        inheritance.setWillAndBeneficiary{value: 0.1 ether}(beneficiary);
        vm.stopPrank();

        // Try to claim before inactivity period
        vm.prank(beneficiary);
        vm.expectRevert(abi.encodeWithSelector(Inheritance.ClaimFailed.selector, "Claim Failed. last Ping within the period of 180 days"));
        inheritance.claim();

        // Warp to after inactivity period
        vm.warp(block.timestamp + 180 days + 1);
        
        uint256 balanceBefore = beneficiary.balance;
        vm.prank(beneficiary);
        inheritance.claim();
        
        assertEq(beneficiary.balance, balanceBefore + 0.1 ether);
    }

    function test_Claim_FailNotBeneficiary() public {
        vm.startPrank(heir);
        vm.deal(heir, 1 ether);
        inheritance.setWillAndBeneficiary{value: 0.1 ether}(beneficiary);
        vm.stopPrank();

        vm.warp(block.timestamp + 180 days + 1);

        // 'other' is not the heir or beneficiary in any mapping
        // The claim function checks: address heirOfBeneficiary = heir[msg.sender];
        // If heir[other] is address(0), it fails.
        vm.prank(other);
        vm.expectRevert("No heir found for this address");
        inheritance.claim();
    }

    function test_Receive() public {
        vm.startPrank(heir);
        vm.deal(heir, 1 ether);
        inheritance.setWillAndBeneficiary{value: 0.1 ether}(beneficiary);
        
        (bool success, ) = address(inheritance).call{value: 0.05 ether}("");
        assertTrue(success);
        
        (Inheritance.Will memory will, ) = inheritance.getWillDetails(heir);
        assertEq(will.amount, 0.15 ether);
        vm.stopPrank();
    }
}
