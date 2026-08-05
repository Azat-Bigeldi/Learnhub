import { Component } from 'react'

export default class ErrorBoundary extends Component {
    constructor(props) {
        super(props)
        this.state = { hasError: false }
    }

    static getDerivedStateFromError() {
        return { hasError: true }
    }

    componentDidCatch(error, errorInfo) {
        // В реальном продакшене здесь стоит отправлять ошибку в Sentry/аналог.
        console.error('Необработанная ошибка в приложении:', error, errorInfo)
    }

    handleReload = () => {
        this.setState({ hasError: false })
        window.location.reload()
    }

    render() {
        if (!this.state.hasError) return this.props.children

        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-bg text-text px-6 text-center">
                <h1 className="text-3xl font-heading">Что-то пошло не так</h1>
                <p className="text-text/70 max-w-md">
                    Произошла непредвиденная ошибка. Попробуйте обновить страницу — если проблема повторится,
                    свяжитесь с нами через WhatsApp.
                </p>
                <button
                    onClick={this.handleReload}
                    className="bg-primary hover:bg-primary-hover text-white px-6 py-3 rounded-full transition-colors"
                >
                    Обновить страницу
                </button>
            </div>
        )
    }
}
