import { Link } from 'react-router-dom';

export default function PageHeader({ title, back }: { title: string; back?: string }) {
  return (
    <div className="top">
      <h1>{title}</h1>
      <span className="sp" />
      {back && <Link className="back" to={back}>Back</Link>}
    </div>
  );
}
