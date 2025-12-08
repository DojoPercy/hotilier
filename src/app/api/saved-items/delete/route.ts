import { NextRequest, NextResponse } from 'next/server'
import { auth0 } from '@/lib/auth0'
import { writeClient } from '@/sanity/lib/client'

export async function DELETE(request: NextRequest) {
  try {
    const session = await auth0.getSession(request)
    
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const itemId = searchParams.get('itemId')

    if (!itemId) {
      return NextResponse.json(
        { success: false, error: 'Item ID is required' },
        { status: 400 }
      )
    }

    // Verify the saved item belongs to the current user
    const savedItem = await writeClient.fetch(
      `*[_type == "savedItem" && _id == $itemId && user._ref == *[_type == "user" && email == $email][0]._id][0]`,
      { itemId, email: session.user.email }
    )

    if (!savedItem) {
      return NextResponse.json(
        { success: false, error: 'Saved item not found or access denied' },
        { status: 404 }
      )
    }

    // Delete the saved item
    await writeClient.delete(itemId)

    return NextResponse.json({
      success: true,
      message: 'Saved item deleted successfully'
    })

  } catch (error) {
    console.error('Error deleting saved item:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to delete saved item' 
      },
      { status: 500 }
    )
  }
}
