pragma solidity ^0.4.24;


contract Journal {
    address public creator;
    constructor() public {creator = msg.sender;}
    
    event RegisterEvent(address user, bytes32 email);
    event PostArticleEvent(address indexed user, bytes32 signedHash);
    event PostReviewEvent(address indexed user, bytes32 signedHash);
    event VoteYesEvent(address user, bytes32 signedHash, bytes32 indexed contentHash);
    event VoteNoEvent(address user, bytes32 signedHash, bytes32 indexed contentHash);

    function register(address reciever, bytes32 email) public returns(bool) {
        require(msg.sender == creator, "Sender not authorized");
        emit RegisterEvent(reciever, email);
        return true;
    }
    function postArticle(address user, bytes32 signedHash) public{
        emit PostArticleEvent(user, signedHash);
    }
    function postReviewEvent(address user, bytes32 signedHash) public{
        emit PostReviewEvent(user, signedHash);
    }
    function voteReviewYes(address user, bytes32 signedHash, bytes32 contentHash) public {
        emit VoteYesEvent(user, signedHash, contentHash);
    }
    function voteReviewNo(address user, bytes32 signedHash, bytes32 contentHash) public {
        emit VoteNoEvent(user, signedHash, contentHash);
    }
}