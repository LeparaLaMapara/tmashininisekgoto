'use client'

import Giscus from '@giscus/react'

interface GiscusCommentsProps {
  slug: string
}

export function GiscusComments({ slug }: GiscusCommentsProps) {
  return (
    <div className="mt-16 pt-10 border-t border-border">
      <h2 className="font-display text-2xl font-bold text-ivory mb-8">
        Comments
      </h2>
      <Giscus
        id="comments"
        repo="LeparaLaMapara/tmashininisekgoto"
        repoId="R_kgDOQtrt5w"
        category="General"
        categoryId="DIC_kwDOQtrt984C5HiF"
        mapping="specific"
        term={slug}
        reactionsEnabled="1"
        emitMetadata="0"
        inputPosition="top"
        theme="transparent_dark"
        lang="en"
        loading="lazy"
      />
    </div>
  )
}
