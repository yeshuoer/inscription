import { useAccount, useChainId, useConnect, useSwitchChain } from "wagmi"
import { injected } from "wagmi/connectors"
import { sepolia } from "viem/chains"
import { useEffect, useRef } from "react"

interface IAccountRef {
  current: {
    address: `0x${string}` | undefined;
    isConnected: boolean;
    chainId: number;
  }
}

export function useAutoConnectForTransaction() {
  const { address, isConnected } = useAccount()
  const chainId = useChainId()
  const { connectAsync } = useConnect()
  const { switchChainAsync } = useSwitchChain()
  const accountRef: IAccountRef = useRef({ address, isConnected, chainId })

  useEffect(() => {
    accountRef.current.address = address
    accountRef.current.isConnected = isConnected
    accountRef.current
  }, [isConnected, chainId])

  const ensureConnected = async () => {
    let result = true
    // check all vilad
    if (!isConnected) {
      result = false
      const connectedData = await connectAsync({
        connector: injected(),
        chainId: sepolia.id,
      })
      accountRef.current.chainId = connectedData.chainId
      accountRef.current.address = connectedData.accounts[0]
    }
  }

  return {
    ensureConnected,
    accountRef,
  }
}
