const { depositETH } = require('@nahmii/sdk')
const ethers = require('ethers')
const { networks } = require('../utils/networks')

async function main() {
  // Set up our L1 RPC provider connection.
  // Switching networks can be done by replacing `networks.*.{l1,l2}` by either mainnet, testnet or localhost.
  const l1RpcProvider = new ethers.providers.JsonRpcProvider(networks.testnet.l1)

  // Set up your wallet by passing in a private key.
  // Make sure this wallet comes with Ether.
  const key = ''
  const l1Wallet = new ethers.Wallet(key, l1RpcProvider)

  // L1 standard bridge address.
  const l1StandardBridge = '0x21De2607E90edb1736bc460a4cd58c0FCd74ABcc' //Ropsten L1 standard bridge

  // Deploy the paired ERC20 token to L2.
  console.log('Depositing Ether...')

  // Deposit Ether into Nahmii 2.0
  const transaction = await depositETH(
      l1StandardBridge,
      ethers.utils.parseUnits("0.02"),
      l1RpcProvider,
      l1Wallet
  )

  const txReceipt = await transaction.wait()
  console.log(`   Deposit hash: ${txReceipt.transactionHash}`)
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
