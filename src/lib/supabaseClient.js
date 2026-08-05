import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
    // Не роняем всё приложение белым экраном — печатаем понятную ошибку в консоль.
    // Проверьте файл .env (см. .env.example) и перезапустите dev-сервер.
    console.error(
        '[supabaseClient] Отсутствуют переменные окружения VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY. ' +
        'Скопируйте .env.example в .env и заполните значениями из вашего проекта Supabase.'
    )
}

export const supabase = createClient(supabaseUrl ?? '', supabaseAnonKey ?? '')
