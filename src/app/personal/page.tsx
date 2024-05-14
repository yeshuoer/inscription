'use client'

import { useEffect } from "react";
import { useLoginJump } from "@/hooks/useLoginJump";

export default function Personal() {
  const {jump} = useLoginJump()

  useEffect(() => {
    jump('/personal/tokens')
  }, [])

  return <div></div>
}
