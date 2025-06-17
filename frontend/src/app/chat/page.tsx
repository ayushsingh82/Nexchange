"use client";
import React from 'react'

import {BitteAiChat} from "@bitte-ai/chat";
import '@bitte-ai/chat/styles.css';

const page = () => {
  return (
    <div>
        <BitteAiChat agentId={"ref-finance-agent.vercel.app"} apiUrl={"/api/chat"}></BitteAiChat>
    </div>
  )
}

export default page