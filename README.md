# js-ethwallet
An ethereum wallet tool for Javascript

# API
+ connect
+ switchChain
+ getNetwork
+ getSigner
+ getWalletAddress
+ isConnected
+ hasWallet
+ isMetaMask
+ produceMessage
+ makeNonce
+ dataEncryption

# Example

```javasript
  isConnected() // true or false
  hasWallet()   // true or false
  isMetaMask()  // true or false

  switchChain(chainId,()=>{
    // success
  })

  const connectWallet = async () => {
    try {
      let { account, chainId } = await connect();
    } catch (error) {
      // error  window.ethereum is undefined
      console.log(error)
      if(error?.code == 4001){
        // connect cancel
      }
    }
  }

  const network = async () => {
    let net = await getNetwork();
  }

  const signer = () => {
    let s = getSigner();
  }

  const address = async () => {
    let addr = await getWalletAddress();
  }

```