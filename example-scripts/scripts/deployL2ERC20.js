const ethers = require('ethers')
const { getContractFactory } = require('@eth-optimism/contracts')
const factory__L2_ERC20 = getContractFactory('L2StandardERC20', null, true)
const { networks } = require('../utils/networks')

async function main() {
  // Set up our L2 RPC provider connection.
  // Switching networks can be done by replacing `networks.*.{l1,l2}` by either mainnet, testnet or localhost.
  const l2RpcProvider = new ethers.providers.JsonRpcProvider(networks.testnet.l2)

  // The L1 token address to create a bridge token for.
  const l1TokenAddress = ''

  // Set up your wallet by passing in a private key.
  const key = ''
  const l2Wallet = new ethers.Wallet(key, l2RpcProvider)

  // Deploy the paired ERC20 token to L2.
  console.log('Deploying L2 ERC20...')
  const L2_ERC20 = await factory__L2_ERC20.connect(l2Wallet).deploy(
    '0x4200000000000000000000000000000000000010', // L2 standard bridge address.
    // Use this (\/) value to check what happens when the L1 ERC20 address is invalid
    // '0x1111111111000000000000000000000000000000',
    // Use this (\/) value to check what happens when the L1 ERC20 address is valid
    l1TokenAddress,
    'L2 ERC20', //name
    'L2T', // symbol
    18, // decimals
  )
  await L2_ERC20.deployTransaction.wait()
  console.log(`   L2_ERC20 deployed @ ${L2_ERC20.address}`)
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
