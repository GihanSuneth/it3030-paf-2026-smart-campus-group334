import { useCallback, useEffect, useRef, useState } from 'react'
import { MOCK_DATA_EVENT } from '../constants/events'

export function useMockQuery(queryFn, dependencies = []) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const queryRef = useRef(queryFn)

  useEffect(() => {
    queryRef.current = queryFn
  }, [queryFn])

  const runQuery = useCallback(async () => {
    setLoading(true)
    setError('')

    try {
      const response = await queryRef.current()
      setData(response)
    } catch (queryError) {
      setError(queryError.message || 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }, [])

  const dependencyKey = JSON.stringify(dependencies)

  useEffect(() => {
    runQuery()

    const handler = () => {
      runQuery()
    }

    window.addEventListener(MOCK_DATA_EVENT, handler)
    return () => window.removeEventListener(MOCK_DATA_EVENT, handler)
  }, [dependencyKey, runQuery])

  return {
    data,
    loading,
    error,
    refetch: runQuery,
  }
}
