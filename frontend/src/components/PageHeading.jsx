import React from 'react'

export default function PageHeading({children}) {
  return (
    <div className='text-xl bg-teal-500 w-full text-center align-middle py-5'>
        <span className="inline-block align-middle">{children}</span>
    </div>
  )
}
