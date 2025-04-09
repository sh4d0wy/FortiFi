import { cookieStorage, createStorage, http } from '@wagmi/core'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { mainnet, arbitrum } from '@reown/appkit/networks'
import { defineChain } from 'viem'

// Define Educhain testnet
const eduChainTestnet = defineChain({
  id: 656476,
  name: 'Educhain Testnet',
  nativeCurrency: {
    name: 'Educhain',
    symbol: 'EDU',
    decimals: 18,
  },
  rpcUrls: {
    default: { http: ['https://rpc.open-campus-codex.gelato.digital/'] },
  },
  blockExplorers: {
    default: { 
      name: 'Blockscout',
      url: 'https://opencampus-codex.blockscout.com',
    },
  },
  testnet: true,
})

// Get projectId from https://cloud.reown.com
export const projectId = process.env.NEXT_PUBLIC_REOWN_PROJECT_ID

if (!projectId) {
  throw new Error('Project ID is not defined')
}

export const networks = [mainnet, arbitrum, eduChainTestnet]

//Set up the Wagmi Adapter (Config)
export const wagmiAdapter = new WagmiAdapter({
  storage: createStorage({
    storage: cookieStorage
  }),
  ssr: true,
  projectId,
  networks,
  transports: {
    [eduChainTestnet.id]: http(),
  }
})

export const config = wagmiAdapter.wagmiConfig