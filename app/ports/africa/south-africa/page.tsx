/**
 * @file app/ports/africa/south-africa/page.tsx
 * @description South Africa country page - redirects to Cape Town (only port)
 */

import { redirect } from 'next/navigation';

export default function SouthAfricaPage() {
  redirect('/ports/africa/south-africa/cape-town');
}
