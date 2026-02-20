import React, { useState, useEffect } from 'react';
import api from '../api/api';
import confetti from 'canvas-confetti';
import { useNavigate, Link } from 'react-router-dom';

const Dashboard = () => {
    const [balance, setBalance] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const verifyAuth = async () => {
            try {
                await api.get('/verify');
                setIsAuthenticated(true);
            } catch (err) {
                setIsAuthenticated(false);
            } finally {
                setIsCheckingAuth(false);
            }
        };
        verifyAuth();
    }, []);

    const triggerConfetti = () => {
        const count = 200;
        const defaults = {
            origin: { y: 0.7 }
        };

        function fire(particleRatio, opts) {
            confetti(Object.assign({}, defaults, opts, {
                particleCount: Math.floor(count * particleRatio)
            }));
        }

        fire(0.25, { spread: 26, startVelocity: 55 });
        fire(0.2, { spread: 60 });
        fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
        fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
        fire(0.1, { spread: 120, startVelocity: 45 });
    };

    const handleCheckBalance = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await api.get('/balance');
            setBalance(response.data.balance);
            triggerConfetti();
        } catch (err) {
            console.error(err);
            if (err.response?.status === 401 || err.response?.status === 403) {
                setIsAuthenticated(false);
            } else {
                setError('Failed to fetch balance');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        // Clear cookie client-side by redirecting, actual clearing requires backend endpoint
        // For now, we simulate logout by clearing state and redirecting
        setIsAuthenticated(false);
        setBalance(null);
        navigate('/login');
    };

    return (
        <div className="page-container">
            <div className="glass-card animate-fade-in" style={{ textAlign: 'center', maxWidth: '600px' }}>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.5rem', gap: '1rem', height: '38px' }}>
                    {!isCheckingAuth && (
                        isAuthenticated ? (
                            <button onClick={handleLogout} style={{ background: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-secondary)', padding: '0.5rem 1rem', borderRadius: '8px', fontWeight: '500' }}>
                                Logout
                            </button>
                        ) : (
                            <>
                                <Link to="/login" style={{ textDecoration: 'none', background: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-secondary)', padding: '0.5rem 1rem', borderRadius: '8px', fontWeight: '500' }}>
                                    Sign In
                                </Link>
                                <Link to="/register" style={{ textDecoration: 'none', background: 'var(--primary-red)', border: '1px solid var(--primary-red)', color: 'white', padding: '0.5rem 1rem', borderRadius: '8px', fontWeight: '600', boxShadow: '0 2px 8px rgba(230, 57, 70, 0.3)' }}>
                                    Sign Up
                                </Link>
                            </>
                        )
                    )}
                </div>

                <div style={{ marginBottom: '2.5rem' }}>
                    <h1 style={{ color: 'var(--primary-red)', fontSize: '2.5rem', marginBottom: '0.5rem', fontWeight: '800' }}>WELCOME TO KODBANK</h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '1px' }}>kodbank secure your money</p>
                </div>

                {isCheckingAuth ? (
                    <div style={{ padding: '2.5rem', background: '#F8F9FA', border: '1px solid var(--border-color)', borderRadius: '16px', marginBottom: '1rem' }}>
                        <p style={{ color: 'var(--text-secondary)' }}>Loading your dashboard...</p>
                    </div>
                ) : isAuthenticated ? (
                    <>
                        <div style={{ padding: '2.5rem', background: '#F8F9FA', border: '1px solid var(--border-color)', borderRadius: '16px', marginBottom: '2rem' }}>
                            {balance !== null ? (
                                <div className="animate-fade-in">
                                    <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Your current balance is</p>
                                    <h1 style={{ fontSize: '4rem', margin: '0', color: 'var(--text-primary)', fontWeight: '800' }}>
                                        ${balance.toLocaleString()}
                                    </h1>
                                </div>
                            ) : (
                                <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>Click below to securely view your account balance</p>
                            )}
                        </div>

                        {error && <div className="text-error" style={{ marginBottom: '1.5rem' }}>{error}</div>}

                        <button
                            className="btn-primary"
                            onClick={handleCheckBalance}
                            disabled={loading}
                            style={{ fontSize: '1.2rem', padding: '1rem 2rem' }}
                        >
                            {loading ? 'Checking...' : 'Check Balance'}
                        </button>
                    </>
                ) : (
                    <div style={{ padding: '2.5rem', background: '#F8F9FA', border: '1px solid var(--border-color)', borderRadius: '16px', marginBottom: '1rem' }}>
                        <h3 style={{ color: 'var(--text-primary)', marginBottom: '1rem' }}>Start your journey with us</h3>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>Please Sign In or Sign Up to view your account details and balance.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
