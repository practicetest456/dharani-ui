import ModuleGrid from '../components/ModuleGrid';
import PageHeader from '../components/PageHeader';
import { infoModules } from '../config/modules';

export default function Info() {
  return <div className="wrap"><PageHeader title="Information Modules" back="/" /><ModuleGrid items={infoModules} /></div>;
}
