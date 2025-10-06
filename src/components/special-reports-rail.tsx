
import {sanityFetch} from '@/sanity/lib/live'
import {getTop3SpecialReports} from '@/sanity/lib/queries'
import {urlFor} from '@/sanity/lib/image'
import Link from 'next/link'
import Image from 'next/image'
import { Slide, Slider } from './special_slider'

type SpecialReport = {
  _id: string
  title: string
  slug: { current: string }
  hero?: { image?: any }
}

export default async function SpecialReportsRail() {
  const {data} = await sanityFetch({ query: getTop3SpecialReports })
  const reports = (Array.isArray(data) ? data : []) as SpecialReport[]
  if (reports.length === 0) return null

  return (
    <div className="w-full">
      <div className="mb-4 flex items-center justify-between">
      <div className="mb-12">
          <h2 className="text-4xl font-bold text-brand-blue mb-2">Power List</h2>
          <div className="w-20 h-1 bg-brand-blue"></div>
        </div>
      </div>
      <Slider>
        {reports.map((item) => (
          <Slide key={item._id}>
            <Link href={`/special-reports/${item.slug.current}`} className="block group relative overflow-hidden rounded-lg bg-white">
              <div className="relative aspect-[16/16] w-full">
                {item.hero?.image && (
                  <Image
                    src={urlFor(item.hero.image).url()}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                    
                  />
                )}
                <div className="absolute inset-x-0 bottom-0">
                  <div className="bg-white/95 backdrop-blur-[1px] px-4 py-3 border-t border-gray-200">
                    <h3 className="text-brand-blue text-base font-semibold leading-snug line-clamp-2 group-hover:text-brand-blue transition-colors">
                      {item.title}
                    </h3>
                  </div>
                </div>
              </div>
            </Link>
          </Slide>
        ))}
      </Slider>
    </div>
  )
}



