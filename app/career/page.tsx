import type { Metadata } from 'next'
import { CareerExperience } from '@/components/career/career-experience'
import { profileOpenGraph } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Career: Data Science, AI Engineering & Research',
  description:
    'Walk through Thabang Mashinini-Sekgoto’s career as an interactive 3D journey, from a BSc at Wits to leading a data science capability at ABSA Insurance.',
  alternates: { canonical: '/career' },
  openGraph: profileOpenGraph('/career'),
}

export default function CareerPage() {
  return <CareerExperience />
}
