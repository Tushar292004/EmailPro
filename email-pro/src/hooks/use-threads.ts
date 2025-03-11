import { api } from '@/trpc/react'
import React, { use } from 'react'
import { useLocalStorage } from "usehooks-ts"
import {atom, useAtom} from 'jotai'

export const threadIdAtom = atom<string | null>(null)

const useThreads = () => {
    const { data: accounts } = api.account.getAccounts.useQuery()
    const [accountId] = useLocalStorage('accountId', ' ')
    const [tab] = useLocalStorage('normalhuman-tab', 'inbox')
    const [data] = useLocalStorage('normalhuman-done', false)
    const [threadId, setThreadId] = useAtom(threadIdAtom)

    const { data: threads, isFetching, refetch } = api.account.getThreads.useQuery({
        accountId,
        tab,
        done: data
    }, { 
        enabled: !!accountId && !!tab, refetchInterval: 5000

    })
    return {
        threads,
        isFetching,
        refetch,
        accountId,
        threadId, setThreadId,
        //Some changes here
        account: accounts?.find((e: { id: string }) => e.id === accountId)
    }
}


export default useThreads