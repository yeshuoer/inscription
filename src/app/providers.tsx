'use client';

import * as React from 'react';
import {
  RainbowKitProvider,
  getDefaultWallets,
  getDefaultConfig,
  lightTheme,
  createAuthenticationAdapter,
  RainbowKitAuthenticationProvider,
  AuthenticationStatus,
} from '@rainbow-me/rainbowkit';
import {
  injectedWallet,
  metaMaskWallet,
  okxWallet,
} from '@rainbow-me/rainbowkit/wallets';
import {
  sepolia,
} from 'wagmi/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { SiweMessage } from 'siwe';
import { getNonce } from '@/libs/api';
import { log } from '@/libs';
import { useEffect } from 'react';
import { signIn, signOut, useSession } from 'next-auth/react'

const { wallets } = getDefaultWallets();

const config = getDefaultConfig({
  appName: 'RainbowKit demo',
  projectId: 'YOUR_PROJECT_ID',
  wallets: [
    // ...wallets,
    {
      groupName: 'Popular',
      wallets: [
        metaMaskWallet,
        // okxWallet,
      ],
    },
  ],
  chains: [
    sepolia,
    // ...(process.env.NEXT_PUBLIC_ENABLE_TESTNETS === 'true' ? [sepolia] : []),
  ],
  ssr: true,
});

const queryClient = new QueryClient();

export function Providers({
  children
}: { children: React.ReactNode }) {
  const { data, status, update } = useSession()
  // const [status, setStatus] = React.useState<AuthenticationStatus>('unauthenticated')

  useEffect(() => {
    log('effect sesion', status, data?.user?.address, update)
  }, [])

  const authenticationAdapter = createAuthenticationAdapter({
    getNonce: async () => {
      log('nonce call?')
      const nonce = await getNonce()
      log('nonce', nonce)
      return nonce
    },
    createMessage: ({ nonce, address, chainId }) => {
      log('create message')
      return new SiweMessage({
        domain: window.location.host,
        address,
        statement: 'Sign in with Ethereum to the app.',
        uri: window.location.origin,
        version: '1',
        chainId,
        nonce,
      });
    },
    getMessageBody: ({ message }) => {
      log('get message body', message)
      return message.prepareMessage();
    },
    verify: async ({ message, signature }) => {
      try {
        // await signInAction(signature, message.prepareMessage())
        await signIn('credentials', {
          signature,
          message: message.prepareMessage(),
        })
        return true
      } catch {
        return false
      }
    },
    signOut: async () => {
      log('sign out')
      signOut()
    },
  });

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitAuthenticationProvider
          adapter={authenticationAdapter}
          status={status}
        >
          <RainbowKitProvider theme={lightTheme({
            accentColor: '#81192a',
            accentColorForeground: '#e8d1d1',
            overlayBlur: 'small',
          })}>{children}</RainbowKitProvider>
        </RainbowKitAuthenticationProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
