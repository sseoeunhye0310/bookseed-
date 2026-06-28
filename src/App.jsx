import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { useBooks } from './hooks/useBooks';
import AppHeader from './components/AppHeader';
import BottomNav from './components/BottomNav';
import LoginPage from './pages/LoginPage';
import ShelfPage from './pages/ShelfPage';
import CalendarPage from './pages/CalendarPage';
import AddBookPage from './pages/AddBookPage';
import ReportPage from './pages/ReportPage';
import SettingsPage from './pages/SettingsPage';
import BookDetailPage from './pages/BookDetailPage';

function AppContent({ books, addBook, updateBook, deleteBook, user, logout }) {
  const location = useLocation();
  const hideHeader = location.pathname.startsWith('/book/');

  return (
    <>
      {!hideHeader && <AppHeader />}
      <Routes>
        <Route path="/" element={<Navigate to="/shelf" replace />} />
        <Route path="/shelf" element={<ShelfPage books={books} />} />
        <Route path="/calendar" element={<CalendarPage books={books} />} />
        <Route path="/add" element={<AddBookPage onAdd={addBook} />} />
        <Route path="/report" element={<ReportPage books={books} />} />
        <Route path="/settings" element={<SettingsPage user={user} onLogout={logout} />} />
        <Route path="/book/:id" element={
          <BookDetailPage books={books} onUpdate={updateBook} onDelete={deleteBook} />
        } />
        <Route path="*" element={<Navigate to="/shelf" replace />} />
      </Routes>
      <BottomNav />
    </>
  );
}

export default function App() {
  const { user, loading: authLoading, signIn, logout } = useAuth();
  const { books, loading: booksLoading, addBook, updateBook, deleteBook } = useBooks(user?.uid);

  if (authLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ fontSize: 48 }}>📚</p>
      </div>
    );
  }

  if (!user) return <LoginPage onSignIn={signIn} />;

  if (booksLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
        <p style={{ fontSize: 40 }}>📚</p>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: 14 }}>불러오는 중...</p>
      </div>
    );
  }

  return (
    <AppContent
      books={books} addBook={addBook} updateBook={updateBook} deleteBook={deleteBook}
      user={user} logout={logout}
    />
  );
}
