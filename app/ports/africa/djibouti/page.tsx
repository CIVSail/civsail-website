/**
 * @file app/ports/africa/djibouti/page.tsx
 * @description Djibouti country page - redirects to Camp Lemonnier (only port)
 */

import { redirect } from 'next/navigation';

export default function DjiboutiPage() {
  redirect('/ports/africa/djibouti/camp-lemonnier');
}
