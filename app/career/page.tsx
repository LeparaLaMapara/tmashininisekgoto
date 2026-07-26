import type { Metadata } from 'next'
import { CareerExperience } from '@/components/career/career-experience'
import { profileOpenGraph } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Career: 10 Years in Data Science & AI',
  description:
    'Walk through Thabang Mashinini-Sekgoto’s career as an interactive 3D journey — from BSc at Wits to Lead Data Scientist at ABSA.',
  alternates: { canonical: '/career' },
  openGraph: profileOpenGraph('/career'),
}

export default function CareerPage() {
  return <CareerExperience />
}
