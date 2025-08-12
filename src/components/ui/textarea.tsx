import type { TextareaHTMLAttributes } from 'react'
export default function Textarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>){
  const { className='', ...rest } = props
  return <textarea className={'textarea ' + className} {...rest} />
}
