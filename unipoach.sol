pragma solidity ^0.5.17;

// https://github.com/Uniswap/uniswap-v1/blob/master/contracts/uniswap_exchange.vy

// uv1F https://etherscan.io/address/0xc0a47dfe034b400b47bdad5fecda2621de6c4d95#code
// uv2F https://etherscan.io/address/0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f#code

// uv2 router: https://etherscan.io/address/0x7a250d5630b4cf539739df2c5dacb4c659f2488d#code

// WETH 0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2

// ropDAI 0xaD6D458402F60fD3Bd25163575031ACDce07538D

// DAI 0x6b175474e89094c44da98b954eedeac495271d0f
// DAI uv1 0x2a1530C4C41db0B0b2bB646CB5Eb1A67b7158667
// DAI uv2 0xA478c2975Ab1Ea89e8196811F51A7B7Ade33eB11

// BAT 0x0d8775f648430679a709e98d2b0cb6250d2887ef

// 10000000000

contract Unipoach {
    
    address weth = 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2;
    //address weth = 0xc778417E063141139Fce010982780140Aa0cD5Ab; // Ropsten
    Uv1F uv1F = Uv1F(0xc0a47dFe034B400B47bDaD5FecDa2621de6c4d95);
    //Uv1F uv1F = Uv1F(0x9c83dCE8CA20E9aAF9D3efc003b2ea62aBC08351); // Ropsten
    
    Uv2F uv2F = Uv2F(0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f);
    Uv2Router uv2Router = Uv2Router(0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D);
    
    uint public e12eGas = 0;
    uint public e21eGas = 0;
        
    function getBalance() public view returns(uint balance) {
        balance = address(this).balance;
    }
    
    function setgas(uint e12eLimit,uint e21eLimit) public{
        e12eGas=e12eLimit;
        e21eGas=e21eLimit;
    }
    
    function e12e(address token) public payable returns (uint256 outgoing){
        
        address uv1exchange = uv1F.getExchange(token);
        address uv2exchange = uv2F.getPair(weth,token);
        require(uv1exchange!=address(0), "no uniswap-v1 exchange for this token");
        require(uv2exchange!=address(0), "no uniswap-v2 exchange for this token");
        Uv1 uv1 = Uv1(uv1exchange);
        Uv2 uv2 = Uv2(uv2exchange);
        ERC20 erc20 = ERC20(token);
        
        // https://ropsten.etherscan.io/tx/0xb011260183b81e7e7592b1945bdec63e1e35c9d81b02980747a07fd8c5ed4d6c
        address[] memory path = new address[](2);
        path[0]=token;
        path[1]=weth;
        uint256 token_count;
        token_count=uv1.ethToTokenSwapInput.value(address(this).balance)(1,block.timestamp+600);
        
        // https://ropsten.etherscan.io/tx/0x2c6cf92bd8f8bb60cb5e06c90037b72a394a7173ad9dbd567731b2d180299c60
        // erc20.approve(address(uv2Router),0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff);

        // https://ropsten.etherscan.io/tx/0x52a0ec778d67238d3df09eae7eda2650025c1e9618d92d55ce814ea15c73cdfe
        uint256[] memory values = uv2Router.swapExactTokensForETH(token_count, 1, path,msg.sender,block.timestamp+600);
        uint256 winnings=values[1];
        
        require(winnings>msg.value+tx.gasprice*e12eGas,"OOPS NM");
    }
    
    function e12eCheck(address token, uint256 value) public view returns (uint256 outgoing){
     // summon the exchange contracts
     address uv1exchange = uv1F.getExchange(token);
     address uv2exchange = uv2F.getPair(weth,token);
     require(uv1exchange!=address(0), "no uniswap-v1 exchange for this token");
     require(uv2exchange!=address(0), "no uniswap-v2 exchange for this token");
     Uv1 uv1 = Uv1(uv1exchange);
     Uv2 uv2 = Uv2(uv2exchange);
     
     uint256 token_count = uv1.getEthToTokenInputPrice(value); // get tokens from v1
     (uint r0,uint r1,uint time) = uv2.getReserves();
     return uv2Router.quote(token_count,r0,r1); // spend tokens on v2
    }
    
    function e21e(address token) public payable returns (uint256 outgoing){
        
      address uv1exchange = uv1F.getExchange(token);
      address uv2exchange = uv2F.getPair(weth,token);
      require(uv1exchange!=address(0), "no uniswap-v1 exchange for this token");
      require(uv2exchange!=address(0), "no uniswap-v2 exchange for this token");
      Uv1 uv1 = Uv1(uv1exchange);
      Uv2 uv2 = Uv2(uv2exchange);
      ERC20 erc20 = ERC20(token);
    
      address[] memory path = new address[](2);
      path[0]=weth;
      path[1]=token;
      
      // buy some tokens
      
      // 0,["0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2","0x6b175474e89094c44da98b954eedeac495271d0f"],"0x7ab874Eeef0169ADA0d225E9801A3FfFfa26aAC3",1600000000
      //uint256[] memory values = uv2Router.swapExactETHForTokens.value(address(this).balance)(0, path, address(this), block.timestamp+600); // https://etherscan.io/tx/0x2456b6ba6f894cc0e8f1bba8ee529f19da78f9c5f3f20bf923993ca5a940570f
      uint256[] memory values = uv2Router.swapExactETHForTokens.value(address(this).balance)(0, path, address(this), block.timestamp+600); // https://etherscan.io/tx/0x2456b6ba6f894cc0e8f1bba8ee529f19da78f9c5f3f20bf923993ca5a940570f
      
      uint256 token_count=values[1]; // quantity of tokenns purchased in second slot

      // this uses 19829 gas, better to skip?
      // about 0.1 ETH, or 40 dollars around time of testing
      erc20.approve(uv1exchange,0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff);

      // sell some tokens
      uint256 winnings = uv1.tokenToEthTransferInput(token_count,1,block.timestamp+600,msg.sender);
      
      require(winnings>msg.value+tx.gasprice*e21eGas,"OOPS NM");
    }

    function approveIt(address token) public {
      //address token = 0x0D8775F648430679A709E98d2b0Cb6250d2887EF;
      address spender = uv1F.getExchange(token);
      ERC20 erc20 = ERC20(token);
      
      // let's be nice and revert if we're already approved
      require(erc20.allowance(address(this),address(uv2Router))==0,"ALREADY GOOD");
      
      erc20.approve(address(uv2Router),0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff);
      erc20.approve(spender,0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff);
    }

    function e21eCheck(address token, uint256 value) public view returns (uint256 outgoing){

     // summon the exchange contracts
     address uv1exchange = uv1F.getExchange(token);
     address uv2exchange = uv2F.getPair(weth,token);
     require(uv1exchange!=address(0), "no uniswap-v1 exchange for this token");
     require(uv2exchange!=address(0), "no uniswap-v2 exchange for this token");
     Uv1 uv1 = Uv1(uv1exchange);
     Uv2 uv2 = Uv2(uv2exchange);
    
     (uint r0,uint r1,uint time) = uv2.getReserves(); // get tokens from v1
     uint token_count = uv2Router.quote(value,r1,r0);
     
     return uv1.getTokenToEthInputPrice(token_count); // spend them on v1
    }
}


// interfaces
interface Uv1F{
    function getExchange(address token) external pure returns (address exchange);
}

interface Uv1{
    function getEthToTokenInputPrice(uint256 value) external pure returns (uint256 count);
    function getTokenToEthInputPrice(uint256 value) external pure returns (uint256 count);
    
    function tokenToEthTransferInput(uint256 tokens_sold, uint256 min_eth, uint256 deadline, address recipient) external returns (uint256);
    function ethToTokenTransferInput(uint256 min_tokens, uint256 deadline, address recipient) external payable returns (uint256  tokens_bought);
    function ethToTokenSwapInput(uint256 min_tokens, uint256 deadline) external payable returns (uint256  tokens_bought);
}

interface Uv2F{
    function getPair(address token0, address token1) external pure returns (address pair);
}

interface Uv2{
    function getReserves() external view returns (uint112 _reserve0, uint112 _reserve1, uint32 _blockTimestampLast);
}

interface Uv2Router{
    function quote(uint amountA, uint reserveA, uint reserveB) external pure returns (uint amountB);
    function swapExactETHForTokens(uint amountOutMin, address[] calldata path, address to, uint deadline) external payable returns (uint[] memory amounts);
    function swapExactTokensForETH(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts);
}

interface ERC20{
    function approve(address spender, uint256 value)external returns(bool);
    function allowance(address _owner, address _spender) external view returns (uint256 remaining);
    function balanceOf(address _owner) external view returns (uint256 balance);
}
