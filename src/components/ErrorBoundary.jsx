import { Component } from 'react'
import { connect } from 'react-redux'
import { selectLanguage } from '../store/languageSlice'
import { translate } from '../i18n/useLanguage'

class ErrorBoundary extends Component {
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

        // Классовые компоненты не могут использовать хуки (useLanguage), поэтому
        // язык приходит через connect() ниже, а перевод делаем чистой функцией.
        const t = (key) => translate(this.props.language, key)

        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-bg text-text px-6 text-center">
                <h1 className="text-3xl font-heading">{t('errorBoundary.title')}</h1>
                <p className="text-text/70 max-w-md">
                    {t('errorBoundary.message')}
                </p>
                <button
                    onClick={this.handleReload}
                    className="bg-primary hover:bg-primary-hover text-white px-6 py-3 rounded-full transition-colors"
                >
                    {t('errorBoundary.reloadBtn')}
                </button>
            </div>
        )
    }
}

const mapStateToProps = (reduxState) => ({ language: selectLanguage(reduxState) })

export default connect(mapStateToProps)(ErrorBoundary)
