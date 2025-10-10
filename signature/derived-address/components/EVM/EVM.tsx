"use client";

import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";


import { useDebounce } from "../../hooks/debounce";
import { SIGNET_CONTRACT, MPC_CONTRACT } from "../../config";
import { useWalletSelector } from "@near-wallet-selector/react-hook";
import { chainAdapters } from "chainsig.js";
import { createPublicClient, http } from "viem";
import { bigIntToDecimal } from "../../utils/bigIntToDecimal";


