/** A Mouse click observer must have an onClick()=>void method */
export interface MouseClickObserver{
    onClick:()=>void
   
}

/** A Mouse move observer must have an onMouseMove method */
export interface MouseMoveObserver{
    onMouseMove:(event: React.MouseEvent<HTMLDivElement>)=>void
}