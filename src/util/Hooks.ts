import { EffectCallback, useCallback, useEffect, useRef } from "react"

/* eslint-disable react-hooks/exhaustive-deps */
export const useMount = (callback: EffectCallback) => useEffect(callback, [])
export const useMounted = () => {
    const mounted = useRef(false)

    useMount(() => {
        mounted.current = true

        return () => {
            mounted.current = false
        }
    })

    return useCallback(() => mounted.current, [])
}
