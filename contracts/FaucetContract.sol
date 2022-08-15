pragma solidity >=0.4.22 <0.9.0;
contract Faucet{


    modifier limitWithdraw(uint amount){
        require(amount<=1200000000000000000,"You cant withdraw more than limit ");
        _;
    }


    function balance() view external returns(uint256){  // to check balance in smart contract 
        return address(this).balance;
    }
    receive() external payable {  }     // special function to recive eth from other accounts
    function addFunds() external payable{} 
    function withdraw(uint amount) external limitWithdraw(amount){
        payable(msg.sender).transfer(amount);
    }
}