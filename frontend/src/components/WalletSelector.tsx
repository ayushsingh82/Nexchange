"use client";

import { useNearWallet } from "../provider/wallet";

const WalletSelector = () => {
  const { accountId, status, signIn, signOut } = useNearWallet();

  if (status === "loading") {
    return (
      <div className="px-4 py-2 text-green-400 text-sm">
        Loading...
      </div>
    );
  }

  if (status === "authenticated" && accountId) {
    return (
      <div className="flex items-center gap-3">
        <div className="px-3 py-1 bg-green-900/30 border border-green-500/50 rounded-lg">
          <span className="text-green-400 text-sm font-mono">
            {accountId.length > 20 
              ? `${accountId.slice(0, 8)}...${accountId.slice(-8)}` 
              : accountId
            }
          </span>
        </div>
        <button
          onClick={signOut}
          className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg transition-colors"
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={signIn}
      className="px-4 py-2 bg-[#97FBE4]  text-black font-medium rounded-lg transition-colors"
    >
      Connect Wallet
    </button>
  );
};

export default WalletSelector; 