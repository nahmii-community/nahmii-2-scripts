const { depositERC20 } = require('@nahmii/sdk')
const ethers = require('ethers')
const { networks } = require('../utils/networks')

async function main() {
  // Set up our L1 RPC provider connection.
  // Switching networks can be done by replacing `networks.*.{l1,l2}` by either mainnet, testnet or localhost.
  const l1RpcProvider = new ethers.providers.JsonRpcProvider(networks.testnet.l1)

  // Set up your wallet by passing in a private key.
  // Make sure this wallet comes with Ether and the to bridge ERC20 token.
  const key = ''
  const l1Wallet = new ethers.Wallet(key, l1RpcProvider)

  // L1 and L2 (bridged) token address.
  const l1TokenAddress = '0x11ca3411f42a7f6c8ca3a1ef5f8045893ff0bba5' // Ropsten NUSD address
  const l2TokenAddress = '0xab151cD390C6b0eB41A4a45E1E372972C3067b1a' // Testnet NUSD address

  // L1 standard bridge address.
  const l1StandardBridge = '0x21De2607E90edb1736bc460a4cd58c0FCd74ABcc' // Ropsten L1 standard bridge

  // Deploy the paired ERC20 token to L2.
  console.log('Depositing ERC20 token...')

  // Deposit ERC20 into Nahmii 2.0
  const transaction = await depositERC20(
      l1TokenAddress,
      l2TokenAddress,
      l1StandardBridge,
      ethers.utils.parseUnits("1", 6),
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
