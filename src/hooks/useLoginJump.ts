import { useRouter } from "next/navigation";
import { useAccount, useConnect } from "wagmi"
import { sepolia } from "viem/chains"
import { injected } from "wagmi/connectors"

export function useLoginJump() {
  const accountData = useAccount();
  const router = useRouter()
  const { connectAsync } = useConnect()

  const jump = async (pathname: string) => {
    const address = await requireLogin()
    router.push(`${pathname}/${address}`)
  }

  const requireLogin = async () => {
    if (!accountData.isConnected) {
      const data = await connectAsync({
        connector: injected(),
        chainId: sepolia.id,
      })
      return data.accounts[0]
    }
    return accountData.address
  }

  return {
    jump,
  }
}
