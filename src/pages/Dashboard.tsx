import ModuleGrid from '../components/ModuleGrid';
import PageHeader from '../components/PageHeader';
import { dashboardModules } from '../config/modules';

export default function Dashboard() {
  return <div className="wrap"><PageHeader title="Dashboard" /><ModuleGrid items={dashboardModules} /></div>;
}
