import { createClient } from '@supabase/supabase-js';
import RetirementHero from '@/components/retirement/RetirementHero';
import MarkBrownBio from '@/components/retirement/MarkBrownBio';
import FinalMusterArticles from '@/components/retirement/FinalMusterArticles';
import ReviewsSection from '@/components/retirement/ReviewsSection';
import QuestionForm from '@/components/retirement/QuestionForm';

// Metadata for SEO
export const metadata = {
  title: 'CIVMAR Retirement Planning | CIVSail',
  description:
    'Expert retirement guidance for civilian mariners. Learn about FERS, TSP, military buybacks, and more with Mark Brown of High 3 Team.',
};

// Fetch reviews from Supabase (only approved ones via RLS)
async function getReviews() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data, error } = await supabase
    .from('retirement_reviews')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching reviews:', error);
    return [];
  }

  return data || [];
}

export default async function RetirementPage() {
  const reviews = await getReviews();

  return (
    <main>
      <RetirementHero />
      <MarkBrownBio />
      <FinalMusterArticles />
      <ReviewsSection reviews={reviews} />
      <QuestionForm />
    </main>
  );
}