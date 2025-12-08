import { NextRequest, NextResponse } from 'next/server'
import { auth0 } from '@/lib/auth0'
import { client } from '@/sanity/lib/client'

export async function GET(request: NextRequest) {
  try {
    const session = await auth0.getSession(request)
    
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      )
    }

    // Find user by email
    const user = await client.fetch(
      `*[_type == 'user' && email == $email][0]{ _id }`,
      { email: session.user.email }
    )

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }

    // Fetch saved items
    const savedItems = await client.fetch(
      `*[_type == "savedItem" && user._ref == $userId]{
        _id,
        createdAt,
        notes,
        "content": content->{ 
          _id, 
          _type, 
          title, 
          slug,
          accessType,
          dek,
          publishedAt,
          authors[]->{ _id, name },
          sectors[]->{ _id, title }
        }
      } | order(createdAt desc)`,
      { userId: user._id }
    )

    return NextResponse.json({
      success: true,
      items: savedItems
    })

  } catch (error) {
    console.error('Error fetching saved items:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch saved items' 
      },
      { status: 500 }
    )
  }
}
