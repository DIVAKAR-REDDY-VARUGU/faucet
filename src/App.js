import { useEffect, useState } from 'react';
import './App.css';
import detectEthereumProvider from "@metamask/detect-provider";
import Web3 from 'web3';
import { loadContract} from './util/load-contract.js'

function App() {

  const [web3Api,setWeb3Api]=useState({
    web3:null,
    provider:true,
    contract:null
  })
  const [reload,setReload]=useState(false)
  const [Balance,setBalance]=useState(null)
  const [account,setAccount]=useState(null)


  useEffect(()=>{
    console.clear();
    (async()=>{         
      let provider=await detectEthereumProvider();    // imported after installing metamask detect provider liberary 
      if(provider){
        let contract=await loadContract('Faucet',provider)
        setAccountListiner(provider);
        setWeb3Api({
          web3:new Web3(provider),
          provider,
          contract
        })
      }
      else console.log(" install metamask dude !!! ")
    })();             
  },[])

  useEffect(()=>{
    let {contract,web3}=web3Api
    contract&&(async()=>{
      let bal=await web3.eth.getBalance(contract.address)
      setBalance(web3.utils.fromWei(bal,"ether"))
      Reload();
    })()
  },[web3Api,reload])
  
  useEffect(()=>{
    (()=>{
      web3Api.web3&&web3Api.web3.eth
        .getAccounts()
        .then((data) => {
          setAccount(data[0])
          Reload();
        })
        .catch(() => {
          console.log("error while getting Accounts");
        });
    })()
  },[web3Api.web3,reload])


const addFunds=async ()=>{
  const {web3,contract}=web3Api
  console.log(account);
  await contract.addFunds({
    from : account,
    value:web3.utils.toWei("2","ether")
  })
}

const withdraw=async()=>{
  let {web3,contract}=web3Api;
  await contract.withdraw(web3.utils.toWei("1", "ether"),{from:account});
  Reload()
}

const setAccountListiner=provider=>{
  provider.on('accountChange',accounts=>setAccount(accounts[0]))
  provider.on('chainChange',()=>{Reload()})
  Reload()
}

const Reload=()=>setReload(!reload)


  return (
    <>
      <div className="faucet-wrapper">
        <div className="faucet">
          <div>
            Account :
            <strong>
              {account ? (
                account
              ) : !web3Api.provider?<>
              <span className='notification is-warning is-small is-rounded ml-4'>
                Wallet is Not Detected <a target='_blank' href='https://docs.metamask.io'> Install MetaMask</a>
              </span>
              </>:
                <button className="button is-info ml-4 is-small" onClick={() => web3Api.provider.request({ method: "eth_requestAccounts" })}>Connect</button>
              }
            </strong>
          </div>
          <div className="is-size-2 my-4">Current Balance : {Balance}ETH</div>
          <button
            className="button is-link  mr-2"
            disabled={!account}
            onClick={addFunds}
          >
            Donate 2 Eth
          </button>
          <button
            className="button is-primary  "
            disabled={!account}
            onClick={withdraw}
          >
            WithDraw 1 Eth
          </button>
        </div>
      </div>
    </>
  );
}

export default App;
