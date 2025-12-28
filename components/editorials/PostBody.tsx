import { MDXRemote } from 'next-mdx-remote/rsc';

interface PostBodyProps {
  content: string;
}

export function PostBody({ content }: PostBodyProps) {
  return (
    <div className="editorial-prose">
      <MDXRemote source={content} />
    </div>
  );
}