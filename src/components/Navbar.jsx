import { Link, NavLink } from "react-router-dom";

export default function Navbar() {


  return (
    <header className="px-8 py-4 bg-bg text-text">
        <div className="container mx-auto flex items-center justify-between">
            <div className="">
                <Link to="/" className="text-primary font-bold no-underline hover:underline">AtokSchool</Link>
            </div>
            <div className="flex items-center gap-6">
                <NavLink to="/main" className={({ isActive }) => `no-underline hover:no-underline ${isActive ? 'text-primary border-b-2' : 'text-text border-transparent'}`}>Главная</NavLink>
                <NavLink to="/courses" className={({ isActive }) => `no-underline hover:no-underline ${isActive ? 'text-primary border-b-2' : 'text-text border-transparent'}`}>Курсы</NavLink>
                <NavLink to="/results" className={({ isActive }) => `no-underline hover:no-underline ${isActive ? 'text-primary border-b-2' : 'text-text border-transparent'}`}>Результаты</NavLink>
                <NavLink to="/press" className={({ isActive }) => `no-underline hover:no-underline ${isActive ? 'text-primary border-b-2' : 'text-text border-transparent'}`}>Отзывы</NavLink>
                <NavLink to="/faq" className={({ isActive }) => `no-underline hover:no-underline ${isActive ? 'text-primary border-b-2' : 'text-text border-transparent'}`}>FAQ</NavLink>
            </div>
            <div className="flex items-center gap-4">
                <button className="text-text text-sm px-2">RU</button>
                <Link to="/register" className="bg-primary text-white tracking-wide px-6 py-2 rounded-full">Войти</Link>
            </div>
        </div>
    </header>
  )
}



