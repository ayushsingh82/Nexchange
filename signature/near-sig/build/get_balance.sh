#!/bin/bash

# some authors - bisontrails2.poolv1.near , zavodil.poolv1.near , allnodes.poolv1.near , cosmose.poolv1.near , stake1.poolv1.near

ACCOUNT="nexchangenear.near"

CONTRACTS=( "sol.omft.near" "aptos-88cb7619440a914fe6400149a12b443c3ac21d59.omft.near" "duelx.near"  "ray.tkn.near"   "poop.token0.near" "gtf.aidols.near" "cos.tkn.near" "musk.token0.near" "morexrp.mmroot.near" "ccc-5.aidols.near" "kmdrqa.ribano.near" "nbtc.bridge.near" "token.sweat"   "eth.bridge.near"   "aaaaaa20d9e0e2461697782ef11675f668207961.factory.bridge.near"  "853d955acef822db058eb8505911ed77f175b99e.factory.bridge.near"   "2260fac5e5542a773aa44fbcfedf7c193bc2c599.factory.bridge.near")


for c in "${CONTRACTS[@]}"
do
  near call $c ft_balance_of '{"account_id":"'"$ACCOUNT"'"}' --accountId nexchangenear.near --network-id mainnet
done

echo "All balances fetched."
