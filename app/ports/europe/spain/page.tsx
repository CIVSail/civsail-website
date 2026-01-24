/**
 * @file app/ports/europe/spain/page.tsx
 * @description Spain country page - shows all Spanish ports
 */

import { redirect } from 'next/navigation';

// Spain has multiple ports, redirect to first one (Rota - main naval base)
export default function SpainPage() {
  redirect('/ports/europe/spain/rota');
}
