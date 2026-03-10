/**
 * @file app/ports/africa/ghana/page.tsx
 * @description Ghana country page - redirects to Tema (only port)
 */

import { redirect } from 'next/navigation';

export default function GhanaPage() {
  redirect('/ports/africa/ghana/tema');
}
