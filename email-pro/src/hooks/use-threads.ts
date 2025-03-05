import { api } from '@/trpc/react'
import React, { use } from 'react'
import { useLocalStorage } from 'usehooks-ts'

const useThreads = () => {
    const { data: accounts } = api.account.getAccounts.useQuery()
    const [accountId] = useLocalStorage('accountId', ' ')
    const [tab] = useLocalStorage('normalhuman-tab', 'inbox')
    const [data] = useLocalStorage('normalhuman-done', false)

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
        account: accounts?.find(e => e.id === accountId)
    }
}


export default useThreads