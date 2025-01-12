import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);

        this.state = {hasError:false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI.
        return { hasError: true };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        this.setState({
            error: error,
            errorInfo: errorInfo
        });
        console.log('Error:', error);
        console.log('Error Info:', errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (

                <div style={{
                    padding: '20px',
                    margin: '20px',
                    border: '1px solid #ff0000',
                    borderRadius: '4px'
                }}>
                    <h2 style={{ color: '#d32f2f' }}>Ops! Algo deu errado</h2>
                    
                    {this.state.error && (
                        <div style={{ margin: '10px 0' }}>
                            <p>{this.state.error.toString()}</p>
                        </div>
                    )}
                    
                    {this.state.errorInfo && (
                        <details style={{ whiteSpace: 'pre-wrap' }}>
                            <summary>Detalhes do erro</summary>
                            <p>{this.state.errorInfo.componentStack}</p>
                        </details>
                    )}

                    <button 
                        onClick={() => window.location.reload()}
                        style={{
                            marginTop: '15px',
                            padding: '8px 16px',
                            backgroundColor: '#4CAF50',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}
                    >
                        Tentar Novamente
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;