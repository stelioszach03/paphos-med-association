import type { ButtonHTMLAttributes } from 'react'

export default function Button(props: ButtonHTMLAttributes<HTMLButtonElement> & {variant?:'primary'|'ghost'}){
  const { className='', variant='primary', ...rest } = props
  const base = variant==='primary'
    ? 'btn'
    : 'px-3 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50'
  return <button className={base + ' ' + className} {...rest} />
}
