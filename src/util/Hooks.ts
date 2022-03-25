import { EffectCallback, useEffect } from "react"

/* eslint-disable react-hooks/exhaustive-deps */
export const useMount = (callback: EffectCallback) => useEffect(callback, [])
