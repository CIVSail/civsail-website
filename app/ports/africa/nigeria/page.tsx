/**
 * @file app/ports/africa/nigeria/page.tsx
 * @description Nigeria country page - redirects to Lagos (only port)
 */

import { redirect } from 'next/navigation';

export default function NigeriaPage() {
  redirect('/ports/africa/nigeria/lagos');
}
