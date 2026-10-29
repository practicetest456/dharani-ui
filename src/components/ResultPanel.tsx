import type { ReactNode } from 'react';
import { ErrorBanner } from './fields';

// The box under a form that shows the API result (a PDF or an HTML page, passed as children).
export default function ResultPanel({ title, hasResult, pending, error, pendingText, emptyText, children }: {
  title: string; hasResult: boolean; pending: boolean; error: unknown; pendingText: string; emptyText: string; children: ReactNode;
}) {
  return (
    <div className="panel">
      <h2>{title}</h2>
      <div className="out">
        {pending ? <div className="empty">{pendingText}</div> : hasResult ? children : <div className="empty">{emptyText}</div>}
      </div>
      <ErrorBanner error={error} />
    </div>
  );
}
