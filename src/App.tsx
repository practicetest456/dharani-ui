import { Route, Routes } from 'react-router-dom';
import MainHeader from './components/MainHeader';
import Dashboard from './pages/Dashboard';
import Info from './pages/Info';
import LandSearch from './pages/LandSearch';
import Ror1b from './pages/Ror1b';

// To add a page: create it in src/pages, add a route here, and add a tile in src/config/modules.ts.
export default function App() {
  return (
    <>
      <MainHeader />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/info" element={<Info />} />
        <Route path="/info/land-search" element={<LandSearch />} />
        <Route path="/info/ror1b" element={<Ror1b />} />
        <Route path="*" element={<Dashboard />} />
      </Routes>
    </>

  );
}
