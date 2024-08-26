import { GetServerSideProps } from 'next';
import { getTopStories } from '../../services/hackerNewsService';

const BASE_URL = 'https://hn-2-xhs.vercel.app/';

function generateSiteMap(posts: { id: number }[]) {
  return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
     <url>
       <loc>${BASE_URL}</loc>
     </url>
     <url>
       <loc>${BASE_URL}/about</loc>
     </url>
     ${posts
       .map(({ id }) => {
         return `
       <url>
           <loc>${`${BASE_URL}/post/${id}`}</loc>
       </url>
     `;
       })
       .join('')}
   </urlset>
 `;
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const posts = await getTopStories(50);

  const sitemap = generateSiteMap(posts);

  res.setHeader('Content-Type', 'text/xml');
  res.write(sitemap);
  res.end();

  return {
    props: {},
  };
};

export default function SiteMap() {}