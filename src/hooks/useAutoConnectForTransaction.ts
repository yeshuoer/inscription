import { useAccount, useChainId, useConnect, useSwitchChain } from "wagmi"
import { injected } from "wagmi/connectors"
import { sepolia } from "viem/chains"

export function useAutoConnectForTransaction() {
  const { address, isConnected } = useAccount()
  const chainId = useChainId()
  const { connectAsync } = useConnect()
  const { switchChainAsync } = useSwitchChain()

  const ensureConnected = async () => {
    let result = true
    // check all vilad
    let currentChainId = chainId
    let currentAccount = address

    try {
      if (!isConnected) {
        result = false
        const connectedData = await connectAsync({
          connector: injected(),
          chainId: sepolia.id,
        })
        currentChainId = connectedData.chainId
        currentAccount = connectedData.accounts[0]
      }
  
      if (currentChainId !== sepolia.id) {
        await switchChainAsync({
          chainId: sepolia.id,
        })
      }

      result = true
    } catch(err) {
      result = false
    }

    return {
      connected: result,
      account: currentAccount,
    }
  }

  return {
    ensureConnected,
  }
}
