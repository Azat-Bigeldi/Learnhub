import { useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useAppDispatch } from '../store'
import { setUser, clearUser } from '../store/Authslice'

/**
 * Загружает публичный профиль пользователя (роль, доступ к курсу) из
 * таблицы public.profiles. Эти поля намеренно не хранятся в user_metadata:
 * user_metadata пользователь может изменить сам через supabase.auth.updateUser,
 * а роль/доступ к курсу должны быть под контролем администратора и защищены
 * RLS-политиками на бэкенде (см. supabase/001_profiles_and_access.sql).
 */
async function fetchProfile(userId) {
    const { data, error } = await supabase
        .from('profiles')
        .select('full_name, role, has_access')
        .eq('id', userId)
        .maybeSingle()

    if (error) {
        console.error('[useAuthSession] Не удалось загрузить профиль:', error.message)
        return null
    }
    return data
}

/**
 * Если строки профиля ещё нет (пользователь зарегистрировался до того, как
 * появилась таблица profiles, а бэкфилл не выполнялся) — создаём её на лету.
 * Безопасно благодаря RLS-политике "Users can insert own profile".
 */
async function ensureProfile(supabaseUser) {
    const { data, error } = await supabase
        .from('profiles')
        .upsert(
            {
                id: supabaseUser.id,
                email: supabaseUser.email,
                full_name: supabaseUser.user_metadata?.full_name || '',
            },
            { onConflict: 'id', ignoreDuplicates: true }
        )
        .select('full_name, role, has_access')
        .maybeSingle()

    if (error) {
        console.error('[useAuthSession] Не удалось создать профиль:', error.message)
        return null
    }
    return data
}

function mapSupabaseUserToAppUser(supabaseUser, profile) {
    if (!supabaseUser) return null
    return {
        id: supabaseUser.id,
        full_name: profile?.full_name || supabaseUser.user_metadata?.full_name || '',
        email: supabaseUser.email,
        role: profile?.role || 'student',
        has_access: profile?.has_access === true,
    }
}

/**
 * Держит Redux-состояние авторизации в актуальном состоянии относительно
 * реальной сессии Supabase и таблицы profiles, а не "замороженного" снимка
 * в localStorage.
 */
export default function useAuthSession() {
    const dispatch = useAppDispatch()

    useEffect(() => {
        let isMounted = true

        async function syncUser(supabaseUser) {
            if (!supabaseUser) {
                localStorage.removeItem('user')
                dispatch(clearUser())
                return
            }

            let profile = await fetchProfile(supabaseUser.id)
            if (!profile) {
                profile = await ensureProfile(supabaseUser)
            }
            if (!isMounted) return

            const appUser = mapSupabaseUserToAppUser(supabaseUser, profile)
            localStorage.setItem('user', JSON.stringify(appUser))
            dispatch(setUser(appUser))
        }

        supabase.auth.getSession().then(({ data }) => {
            syncUser(data.session?.user)
        })

        const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
            syncUser(session?.user)
        })

        return () => {
            isMounted = false
            subscription.subscription.unsubscribe()
        }
    }, [dispatch])
}
