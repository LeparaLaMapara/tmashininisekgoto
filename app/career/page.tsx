import type { Metadata } from 'next'
import { CareerExperience } from '@/components/career/career-experience'

export const metadata: Metadata = {
  title: 'Career Journey',
  description:
    'Walk through Thabang Mashinini-Sekgoto’s career as an interactive 3D journey — from BSc at Wits to Lead Data Scientist at ABSA.',
}

export default function CareerPage() {
  return <CareerExperience />
}
