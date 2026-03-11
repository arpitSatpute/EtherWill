// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import {Script} from "forge-std/Script.sol";
import {Inheritance} from "../src/Inheritance.sol";

contract Deploy is Script {
    function run() external returns (Inheritance) {
        vm.startBroadcast();

        Inheritance inheritance = new Inheritance();

        vm.stopBroadcast();
        return inheritance;
    }
}