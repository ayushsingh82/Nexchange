#!/bin/bash

# some authors - bisontrails2.poolv1.near , zavodil.poolv1.near , allnodes.poolv1.near , cosmose.poolv1.near , stake1.poolv1.near

ACCOUNT="nearayush.near"

# CONTRACTS=( "sol.omft.near" "aptos-88cb7619440a914fe6400149a12b443c3ac21d59.omft.near" "duelx.near"  "ray.tkn.near"   "poop.token0.near" "gtf.aidols.near" "cos.tkn.near" "musk.token0.near" "morexrp.mmroot.near" "ccc-5.aidols.near" "kmdrqa.ribano.near" "nbtc.bridge.near" "token.sweat"   "eth.bridge.near"   "aaaaaa20d9e0e2461697782ef11675f668207961.factory.bridge.near"  "853d955acef822db058eb8505911ed77f175b99e.factory.bridge.near"   "2260fac5e5542a773aa44fbcfedf7c193bc2c599.factory.bridge.near"   "853d955acef822db058eb8505911ed77f175b99e.factory.bridge.near"   "2260fac5e5542a773aa44fbcfedf7c193bc2c599.factory.bridge.near"  "token.rhealab.near"  "token.publicailab.near" "jambo-1679.meme-cooking.near" "xrp.omft.near" "doge.omft.near" "babyneko.tkn.near" "lb.gra-fun.near" "yepyep.aidols.near
# " "asix.gra-fun.near" "xrp.mmroot.near" "sad.aidols.near" "chlhit.gra-fun.near" "rs.tkn.near" "fuuf.token0.near" "zino2024.gra-fun.near" "ofp.tkn.near" "urhodh.gra-fun.near" "banmeme.gra-fun.near" "evioai.gra-fun.near" "myriadcore.near")

CONTRACTS=(
  "sol.omft.near"
  "aptos-88cb7619440a914fe6400149a12b443c3ac21d59.omft.near"
  "duelx.near"
  "ray.tkn.near"
  "poop.token0.near"
  "gtf.aidols.near"
  "cos.tkn.near"
  "musk.token0.near"
  "morexrp.mmroot.near"
  "ccc-5.aidols.near"
  "kmdrqa.ribano.near"
  "nbtc.bridge.near"
  "token.sweat"
  "eth.bridge.near"
  "aaaaaa20d9e0e2461697782ef11675f668207961.factory.bridge.near"
  "853d955acef822db058eb8505911ed77f175b99e.factory.bridge.near"
  "2260fac5e5542a773aa44fbcfedf7c193bc2c599.factory.bridge.near"
  "token.rhealab.near"
  "token.publicailab.near"
  "jambo-1679.meme-cooking.near"
  "xrp.omft.near"
  "doge.omft.near"
  "babyneko.tkn.near"
  "lb.gra-fun.near"
  "yepyep.aidols.near"
  "asix.gra-fun.near"
  "xrp.mmroot.near"
  "sad.aidols.near"
  "chlhit.gra-fun.near"
  "rs.tkn.near"
  "fuuf.token0.near"
  "zino2024.gra-fun.near"
  "ofp.tkn.near"
  "urhodh.gra-fun.near"
  "banmeme.gra-fun.near"
  "evioai.gra-fun.near"
  "myriadcore.near"
)


for c in "${CONTRACTS[@]}"
do
  near call $c ft_balance_of '{"account_id":"'"$ACCOUNT"'"}' --accountId nexchangenear.near --network-id mainnet
done

echo "All balances fetched."
