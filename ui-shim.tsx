import React from 'react'

export const cn = (...a: any[]) => a.filter(Boolean).join(' ')

export function Card({ className, children }: any){ return <div className={cn("rounded-xl border bg-white", className)}>{children}</div> }
export function CardHeader({ children }: any){ return <div className="p-3 border-b">{children}</div> }
export function CardTitle({ children }: any){ return <h3 className="font-semibold text-base">{children}</h3> }
export function CardContent({ className, children }: any){ return <div className={cn("p-3", className)}>{children}</div> }

export function Label({ className, children }: any){ return <label className={cn("text-sm", className)}>{children}</label> }
export function Input(props: React.InputHTMLAttributes<HTMLInputElement>){ return <input {...props} className={cn("border rounded px-2 py-1 w-full", (props as any).className)} /> }
export function Switch({ checked, onCheckedChange }: { checked:boolean, onCheckedChange:(v:boolean)=>void }){
  return <button type="button" onClick={()=>onCheckedChange(!checked)} className={cn("w-10 h-6 rounded-full border px-0.5", checked?"bg-blue-500 border-blue-500":"bg-gray-200 border-gray-300")}>
    <span className={cn("block w-5 h-5 bg-white rounded-full transition-transform", checked?"translate-x-4":"translate-x-0")}/>
  </button>
}
export function Checkbox({ checked, onCheckedChange, disabled }: {checked:boolean, onCheckedChange:(v:boolean)=>void, disabled?:boolean}){
  return <input type="checkbox" checked={checked} disabled={disabled} onChange={e=>onCheckedChange(e.target.checked)} />
}
export function Button({ children, variant, ...rest }: any){
  return <button {...rest} className={cn("px-3 py-1.5 rounded border", variant==="outline"?"border-gray-300":"bg-blue-600 text-white border-blue-600")} >{children}</button>
}
