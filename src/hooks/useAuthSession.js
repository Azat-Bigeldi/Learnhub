import { useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useAppDispatch } from '../store'
import { setUser, clearUser } from '../store/Authslice'

function mapSupabaseUserToAppUser(supabaseUser) {
    if (!supabaseUser) return null
    return {
        id: supabaseUser.id,
        full_name: supabaseUser.user_metadata?.full_name || '',
        email: supabaseUser.email,
        role: supabaseUser.user_metadata?.role || 'student',
    }
}

/**
 * Держит Redux-состояние авторизации в актуальном состоянии относительно
 * реальной сессии Supabase, а не "замороженного" снимка в localStorage.
 * Важно: роль пользователя (selectIsAdmin) читается из user_metadata,
 * которую сам пользователь изменить не может (в отличие от localStorage) —
 * для полноценной защиты админ-разделов эту роль всё равно нужно
 * дополнительно проверять на бэкенде (RLS/Edge Function), это лишь
 * синхронизация UI-состояния на клиенте.
 */
export default function useAuthSession() {
    const dispatch = useAppDispatch()

    useEffect(() => {
        let isMounted = true

        supabase.auth.getSession().then(({ data }) => {
            if (!isMounted) return
            const appUser = mapSupabaseUserToAppUser(data.session?.user)
            if (appUser) {
                localStorage.setItem('user', JSON.stringify(appUser))
                dispatch(setUser(appUser))
            } else {
                localStorage.removeItem('user')
                dispatch(clearUser())
            }
        })

        const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
            const appUser = mapSupabaseUserToAppUser(session?.user)
            if (appUser) {
                localStorage.setItem('user', JSON.stringify(appUser))
                dispatch(setUser(appUser))
            } else {
                localStorage.removeItem('user')
                dispatch(clearUser())
            }
        })

        return () => {
            isMounted = false
            subscription.subscription.unsubscribe()
        }
    }, [dispatch])
}
