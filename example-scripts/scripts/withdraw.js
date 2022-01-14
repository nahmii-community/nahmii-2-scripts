const { initiateWithdrawal, finalizeWithdrawal, sleep } = require('@nahmii/sdk')
const ethers = require('ethers')
const { networks } = require('../utils/networks')

async function main() {
  // Set up our L1 and L2 RPC provider connection.
  // Switching networks can be done by replacing `networks.*.{l1,l2}` by either mainnet, testnet or localhost.
  const l1RpcProvider = new ethers.providers.JsonRpcProvider(networks.testnet.l1)
  const l2RpcProvider = new ethers.providers.JsonRpcProvider(networks.testnet.l2)

  // Set up your wallet by passing in a private key.
  // Make sure this wallet comes with Ether and the to bridge ERC20 token.
  const key = ''
  const l1Wallet = new ethers.Wallet(key, l1RpcProvider)
  const l2Wallet = new ethers.Wallet(key, l2RpcProvider)

  // L2 (bridged) token address. This can be either wrapped ETH or any
  // other bridged L2 token mapped to a L1 token.
  const l2TokenAddress = '0x4200000000000000000000000000000000000006' // Testnet wrapped ETH address.

  // L1 cross domain messenger address.
  const l1CrossDomainMessengerAddress = '0x4F693f826b1eB96f575ea06b145e490D564bb1B8' // Ropsten CDM address.

  // Deploy the paired ERC20 token to L2.
  console.log('Depositing ERC20 token...')

  // Initiating withdrawal from Nahmii 2.0.
  const initWithdrawTx = await initiateWithdrawal(
      l2TokenAddress,
      ethers.utils.parseUnits('0.1'),
      l2RpcProvider,
      l2Wallet
  )

  const initWithdrawTxReceipt = await initWithdrawTx.wait()
  console.log(`   Initiate withdrawal hash: ${initWithdrawTxReceipt.transactionHash}`)
  
  console.log(`   Fraud proof window in progress...`)
  await sleep(1000*60*5) // Testnet fraud proof window is 5 minutes.
  console.log(`   Fraud proof window passed...`)

  console.log(`   Submitting withdrawal finalization to L1...`)
  // Finalize withdrawal, this call can only be done successfully after
  // the fraud proof window has passed. It will return the users funds.
  let finalizeWithdrawTx;
  const [messageResult, ...rest] = await finalizeWithdrawal(
    initWithdrawTxReceipt.transactionHash,
    l1CrossDomainMessengerAddress,
    l1RpcProvider,
    l2RpcProvider,
    l1Wallet,
    1,
    0,
    (tx) => { finalizeWithdrawTx = tx }
  )
  if (finalizeWithdrawTx || messageResult.success == 0) {
      console.log(`   Withdrawing tokens...`)
      const finalizeWithdrawTxReceipt = await finalizeWithdrawTx.wait(3)
      console.log(`   Finalize withdrawal hash: ${finalizeWithdrawTxReceipt.transactionHash}`)
  } else if (messageResult.success == 1) {
      console.log(`   Withdrawal request was already sent`)
  } else if (messageResult.success == 2) {
      console.log(`   Withdrawal failed`)
  } else {
      console.log(`   Withdrawal request not sent`)
  }
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
