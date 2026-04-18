import { getJSONContent } from '@/lib/content.shared';
import ContributorsDisplay from './ContributorsDisplay';

/**
 * Contributors (Server Component)
 * Responsible for data fetching and passing props to the Client Component.
 */
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
