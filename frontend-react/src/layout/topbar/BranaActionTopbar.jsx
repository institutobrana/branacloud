import { TopbarBrand } from './components/TopbarBrand.jsx';
import { TopbarActions } from './components/TopbarActions.jsx';
import { TopbarPatientSearch } from './components/TopbarPatientSearch.jsx';
import { TopbarUserMenu } from './components/TopbarUserMenu.jsx';
import './styles/topbar.css';

export function BranaActionTopbar({ user, onSignOut, loading, onNavigate, onPlaceholder, onUserNavigate, onUserPlaceholder }) {
  return <header className="brana-action-topbar"><TopbarBrand /><div className="brana-action-topbar-center"><TopbarActions onNavigate={onNavigate} onPlaceholder={onPlaceholder} /><TopbarPatientSearch onSubmit={onPlaceholder} /></div><TopbarUserMenu user={user} loading={loading} onSignOut={onSignOut} onNavigate={onUserNavigate} onPlaceholder={onUserPlaceholder} /></header>;
}
