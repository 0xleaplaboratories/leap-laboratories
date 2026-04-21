import { getJSONContent } from '@/lib/content.server';
import ContributorsDisplay from './ContributorsDisplay';

export default async function Contributors() {
  const content = await getJSONContent('contributors/contributors');

  if (!content) return null;

  const { title, tagline, profile } = content;

  return (
    <ContributorsDisplay 
      title={title} 
      tagline={tagline} 
      profiles={profile} 
    />
  );
}
