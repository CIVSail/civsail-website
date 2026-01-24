/**
 * @file app/ports/africa/sudan/page.tsx
 * @description Sudan country page - redirects to Port Sudan (only port)
 */

import { redirect } from 'next/navigation';

export default function SudanPage() {
  redirect('/ports/africa/sudan/port-sudan');
}
