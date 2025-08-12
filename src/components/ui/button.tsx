import type { ButtonHTMLAttributes } from 'react'

const variants: Record<'primary'|'outline'|'ghost', string> = {
  primary: 'btn',
  outline: 'btn-outline',
  ghost: 'px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-50'
}

export default function Button(props: ButtonHTMLAttributes<HTMLButtonElement> & {variant?:'primary'|'outline'|'ghost'}){
  const { className='', variant='primary', ...rest } = props
  const base = variants[variant]
  return <button className={base + (className? ' '+className : '')} {...rest} />
}
